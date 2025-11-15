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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background stars - solid colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-20 left-20 w-8 h-8 text-[#58CC02] fill-[#58CC02] animate-float opacity-60" />
        <Star className="absolute top-40 right-32 w-6 h-6 text-[#1CB0F6] fill-[#1CB0F6] animate-float-delayed opacity-50" />
        <Star className="absolute bottom-32 left-1/4 w-7 h-7 text-[#FFC800] fill-[#FFC800] animate-float opacity-40" />
        <Star className="absolute bottom-20 right-1/3 w-8 h-8 text-[#CE82FF] fill-[#CE82FF] animate-float-delayed opacity-50" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-[0_12px_0_0_rgba(0,0,0,0.15)] border-6 border-[#1CB0F6]">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-[#FFC800] fill-[#FFC800]" />
            <CardTitle className="text-4xl font-black text-[#58CC02] comic-text">
              DIABUDDIES
            </CardTitle>
            <Star className="w-8 h-8 text-[#FFC800] fill-[#FFC800]" />
          </div>
          <CardDescription className="text-lg font-bold text-[#3C3C3C]">
            SIGN IN TO CONTINUE YOUR HEALTH ADVENTURE!
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
              <div className="bg-[#FF4B4B] border-4 border-[#D93A3A] text-white px-4 py-3 rounded-2xl text-sm font-bold shadow-[0_4px_0_0_#D93A3A]">
                {error}
              </div>
            )}
            <Button
              type="submit"
              variant="duoGreen"
              size="lg"
              className="w-full text-lg"
            >
              SIGN IN ⚡
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

