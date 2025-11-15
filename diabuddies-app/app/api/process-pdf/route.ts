// API route for processing PDF health reports and generating tasks

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Upload file to Anthropic's file API
    const arrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([arrayBuffer], { type: "application/pdf" });

    // Create FormData for Anthropic file upload
    const uploadFormData = new FormData();
    uploadFormData.append("file", fileBlob, file.name);

    // Upload to Anthropic Files API
    const uploadResponse = await fetch("https://api.anthropic.com/v1/files", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "files-api-2025-04-14",
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Anthropic file upload error:", errorText);
      return Response.json(
        { error: "Failed to upload file to Anthropic" },
        { status: 500 }
      );
    }

    const { id: fileId } = await uploadResponse.json();

    // Use Anthropic Messages API directly with document attachment
    const messageResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "files-api-2025-04-14",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "file",
                  file_id: fileId,
                },
              },
              {
                type: "text",
                text: `Analyze this health report PDF and create diabetes health tasks.

Generate 5-8 simple tasks based on the report. Examples:
- Low water? "Drink more water"
- Blood sugar issues? "Check blood sugar before meals"
- Need exercise? "Play outside for 10 minutes"

Also provide 2-3 VERY SHORT tips (one sentence each, max 8 words) for a 6-year-old. Keep it super simple and fun!

IMPORTANT: Extract specific stats/metrics from the PDF (blood sugar levels, hydration, exercise, etc.) and create detailed insights. For each stat found:
- Extract the actual value from the PDF
- Provide a reference point (normal range or average for kids)
- Determine if it's good or needs attention
- Write simple explanations for a 6-year-old

Return JSON:
{
  "tasks": [{"id": "task-id", "title": "Task name", "points": 10, "completed": false}],
  "insights": ["Short tip 1", "Short tip 2"],
  "detailedInsights": [
    {
      "title": "Blood Sugar",
      "userValue": "180",
      "referenceValue": "100-140",
      "isGood": false,
      "explanation": "Your blood sugar is a bit high",
      "action": "Try checking before meals",
      "simpleExplanation": "Lower numbers are better!"
    }
  ]
}

Only include stats that are actually in the PDF. Use general reference points like "Most kids have..." or "Normal is..." for comparison.`,
              },
            ],
          },
        ],
      }),
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error("Anthropic message API error:", errorText);
      return Response.json(
        { error: "Failed to analyze PDF" },
        { status: 500 }
      );
    }

    const messageData = await messageResponse.json();
    const responseText = messageData.content[0].text;

    // Parse the JSON response from Claude
    let tasks, insights, detailedInsights;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      const parsed = JSON.parse(jsonText);
      tasks = parsed.tasks || parsed;
      insights = parsed.insights || [];
      detailedInsights = parsed.detailedInsights || [];
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Validate tasks structure
    if (!Array.isArray(tasks)) {
      return Response.json(
        { error: "Invalid task format from AI" },
        { status: 500 }
      );
    }

    // Ensure all tasks have required fields
    const validatedTasks = tasks.map((task: any, index: number) => ({
      id: task.id || `ai-task-${index}-${Date.now()}`,
      title: task.title || "Health Task",
      points: typeof task.points === "number" ? task.points : 10,
      completed: task.completed || false,
    }));

    // Validate insights
    const validatedInsights = Array.isArray(insights) 
      ? insights.filter((insight: any) => typeof insight === "string" && insight.trim().length > 0)
      : [];

    // Validate detailed insights
    const validatedDetailedInsights = Array.isArray(detailedInsights)
      ? detailedInsights
          .filter((insight: any) => {
            return (
              typeof insight === "object" &&
              insight.title &&
              insight.userValue &&
              insight.referenceValue &&
              typeof insight.isGood === "boolean" &&
              insight.explanation &&
              insight.action &&
              insight.simpleExplanation
            );
          })
          .map((insight: any) => ({
            title: String(insight.title),
            userValue: String(insight.userValue),
            referenceValue: String(insight.referenceValue),
            isGood: Boolean(insight.isGood),
            explanation: String(insight.explanation),
            action: String(insight.action),
            simpleExplanation: String(insight.simpleExplanation),
          }))
      : [];

    return Response.json({ 
      tasks: validatedTasks,
      insights: validatedInsights,
      detailedInsights: validatedDetailedInsights
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return Response.json(
      { error: "Failed to process PDF. Please try again." },
      { status: 500 }
    );
  }
}

