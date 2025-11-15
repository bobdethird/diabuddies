"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { saveUserAuth, isAuthenticated } from "@/lib/storage";

export default function SignInPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (password !== "diabuddies") {
      setError("Incorrect password. Please try again.");
      return;
    }

    // Save authentication and redirect
    saveUserAuth(name.trim());
    router.push("/");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-3 h-3 bg-orange-300 rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-pink-300 rounded-full animate-float-delayed opacity-50" />
        <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-float opacity-40" />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-purple-300 rounded-full animate-float-delayed opacity-50" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-4 border-orange-200">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-orange-500 animate-pulse-gentle" />
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Dia<span className="text-orange-500">Buddies</span>
            </CardTitle>
            <Star className="w-5 h-5 text-yellow-500 animate-sparkle" />
          </div>
          <CardDescription className="text-base">
            Sign in to continue your health adventure!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-base shadow-lg"
            >
              Sign In ✨
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 pt-2">
          <p className="text-xs text-gray-500 text-center">
            Welcome back! Enter your name and password to continue.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

