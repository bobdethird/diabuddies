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
                text: `Analyze this health report PDF and generate personalized health tasks for diabetes management. 

Based on the report findings, create actionable, specific tasks that address any issues or recommendations found. For example:
- If hydration levels are low, suggest increasing water intake (e.g., "Drink 4 cups of water instead of 3")
- If blood sugar levels need attention, suggest specific monitoring tasks
- If exercise is recommended, create appropriate activity tasks
- Include any medication or insulin-related tasks if mentioned

Generate 5-8 tasks that are:
1. Specific and actionable
2. Appropriate for daily diabetes management
3. Include point values (5-15 points each, with more important tasks worth more)
4. Use clear, kid-friendly language

Return the tasks as a JSON object with this exact structure:
{
  "tasks": [
    {
      "id": "unique-task-id",
      "title": "Task title",
      "points": 10,
      "completed": false
    }
  ]
}`,
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
    let tasks;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      const parsed = JSON.parse(jsonText);
      tasks = parsed.tasks || parsed;
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

    return Response.json({ tasks: validatedTasks });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return Response.json(
      { error: "Failed to process PDF. Please try again." },
      { status: 500 }
    );
  }
}

