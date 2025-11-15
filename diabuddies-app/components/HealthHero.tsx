"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import {
  getProgressToNextLevel,
  getPointsNeededForNextLevel,
} from "@/lib/leveling";
import type { UserProgress } from "@/types";

interface HealthHeroProps {
  progress: UserProgress;
}

/**
 * Get hero evolution image based on level
 * Level 1: First evolution (0-9 points)
 * Level 2: Second evolution (10-34 points)
 * Level 3: Third evolution (35-84 points)
 * Level 4+: Fourth evolution (85+ points)
 */
function getHeroEvolutionImage(level: number): string {
  if (level >= 4) return "/fourth evolution.png";
  if (level >= 3) return "/third evolution.png";
  if (level >= 2) return "/second evolution.png";
  return "/first evolution.png";
}

function getNextEvolutionImage(level: number): string {
  if (level >= 4) return "/fourth evolution.png";
  if (level >= 3) return "/fourth evolution.png";
  if (level >= 2) return "/third evolution.png";
  return "/second evolution.png";
}

export function HealthHero({ progress }: HealthHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showPowerUp, setShowPowerUp] = useState(false);
  const previousLevelRef = useRef(progress.level);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    const initialProgress = getProgressToNextLevel(progress.totalPoints, progress.level);
    setDisplayProgress(initialProgress);
    previousLevelRef.current = progress.level;
  }, []);

  const actualProgressPercent = mounted
    ? getProgressToNextLevel(progress.totalPoints, progress.level)
    : 0;
  const pointsNeeded = mounted
    ? getPointsNeededForNextLevel(progress.totalPoints, progress.level)
    : 0;

  // Detect level-up and trigger animation
  useEffect(() => {
    if (!mounted) return;

    const previousLevel = previousLevelRef.current;
    const currentLevel = progress.level;

    // Level up detected!
    if (currentLevel > previousLevel) {
      // Clear any existing timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      setIsLevelingUp(true);
      
      // Animate progress bar to 100%
      setDisplayProgress(100);

      // After reaching 100%, show power-up animation
      setTimeout(() => {
        setShowPowerUp(true);
        
        // Trigger confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#58CC02", "#FFD700", "#1CB0F6", "#FF6B6B", "#4ECDC4"],
        });

        // Additional burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#58CC02", "#FFD700"],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#1CB0F6", "#FF6B6B"],
          });
        }, 200);
      }, 600);

      // After power-up animation, transition to new level progress
      animationTimeoutRef.current = setTimeout(() => {
        setShowPowerUp(false);
        setIsLevelingUp(false);
        setDisplayProgress(actualProgressPercent);
        previousLevelRef.current = currentLevel;
      }, 2000);
    } else {
      // Normal progress update (no level up)
      if (!isLevelingUp) {
        setDisplayProgress(actualProgressPercent);
      }
      previousLevelRef.current = currentLevel;
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [progress.level, progress.totalPoints, mounted, actualProgressPercent, isLevelingUp]);

  const progressPercent = displayProgress;
  const heroImage = getHeroEvolutionImage(progress.level);
  const nextEvolutionImage = getNextEvolutionImage(progress.level);
  const [isVisible, setIsVisible] = useState(true);
  const [currentImage, setCurrentImage] = useState(heroImage);

  // Smooth transition when evolution changes
  useEffect(() => {
    if (currentImage !== heroImage) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImage(heroImage);
        setIsVisible(true);
      }, 300);
    }
  }, [heroImage, currentImage]);

  // Determine gradient colors based on level
  const gradientColors =
    progress.level >= 4
      ? "from-purple-400 via-pink-400 to-orange-400"
      : progress.level >= 3
      ? "from-blue-400 via-cyan-400 to-teal-400"
      : progress.level >= 2
      ? "from-green-400 via-emerald-400 to-teal-400"
      : "from-orange-400 via-yellow-400 to-pink-400";

  return (
    <div className="relative">
      {/* Hero Card with Glow */}
      <div className="relative rounded-3xl bg-white p-8 shadow-2xl border-4 border-orange-200 overflow-hidden">
        {/* Bubble Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-20 blur-3xl -z-10`}
        />
        
        {/* Ambient Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Star className="absolute top-8 left-12 w-3 h-3 text-yellow-400 animate-float opacity-60" />
          <Sparkles className="absolute top-16 right-16 w-2.5 h-2.5 text-pink-400 animate-float-delayed opacity-50" />
          <Star className="absolute bottom-20 left-20 w-2 h-2 text-blue-400 animate-float opacity-40" />
          <Sparkles className="absolute bottom-12 right-12 w-3 h-3 text-purple-400 animate-float-delayed opacity-50" />
        </div>

        {/* "Your Health Hero" Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-2 rounded-full shadow-lg mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-lg">Your Health Hero</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Hero Avatar Section */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="relative">
            {/* Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 rounded-full blur-2xl opacity-60 animate-pulse-slow -z-10 scale-150" />
            
            {/* Hero Image */}
            <div className="relative h-[260px] w-[260px] flex items-center justify-center">
              <div className="animate-bounce-slow relative">
                <Image
                  src={currentImage}
                  alt="Health Hero"
                  width={260}
                  height={260}
                  className={`drop-shadow-2xl transition-all duration-500 hover:scale-110 animate-pulse-gentle ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                  priority
                />
                {/* Sparkle effect for higher levels */}
                {progress.level >= 3 && (
                  <div className="absolute inset-0 animate-sparkle">
                    <div className="absolute top-4 left-6 w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-75" />
                    <div className="absolute top-12 right-8 w-2 h-2 bg-yellow-300 rounded-full opacity-60" />
                    <div className="absolute bottom-8 left-10 w-2 h-2 bg-yellow-400 rounded-full opacity-70" />
                    <div className="absolute bottom-12 right-6 w-2.5 h-2.5 bg-yellow-300 rounded-full opacity-65" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Circular Level Badge */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-50 animate-pulse-slow transition-all duration-300 ${
              showPowerUp ? "scale-150 opacity-75" : ""
            }`} />
            <div className={`relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-24 h-24 flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300 ${
              showPowerUp ? "scale-110 border-yellow-400 shadow-2xl shadow-yellow-400/50" : ""
            }`}>
              <div className="text-center">
                <div className="text-xs text-white/80 font-semibold uppercase tracking-wide">
                  Level
                </div>
                <div className={`text-4xl font-bold text-white drop-shadow-lg transition-all duration-300 ${
                  showPowerUp ? "scale-125 text-yellow-300" : ""
                }`}>
                  {progress.level}
                </div>
              </div>
            </div>
            {/* Power-up particles around badge */}
            {showPowerUp && (
              <>
                <Sparkles className="absolute -top-2 -left-2 w-6 h-6 text-yellow-400 animate-bounce" />
                <Star className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300 animate-bounce delay-100" />
                <Sparkles className="absolute -bottom-2 -left-2 w-5 h-5 text-yellow-400 animate-bounce delay-200" />
                <Star className="absolute -bottom-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce delay-300" />
              </>
            )}
          </div>
        </div>

        {/* Pill-Shaped Progress Bar */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-700">Progress to Next Level</span>
            <span className={`font-bold text-lg transition-colors duration-300 ${
              showPowerUp ? "text-yellow-500 scale-110" : "text-orange-600"
            }`}>
              {showPowerUp ? "LEVEL UP! 🎉" : `${Math.round(progressPercent)}%`}
            </span>
          </div>
          
          {/* Custom Pill Progress Bar */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner border-2 border-gray-300">
            <div
              className={`h-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full shadow-lg transition-all ease-out ${
                isLevelingUp ? "duration-[600ms]" : "duration-500"
              } ${
                showPowerUp ? "animate-pulse brightness-125" : ""
              }`}
              style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse-slow" />
              {showPowerUp && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 animate-shimmer opacity-75" />
              )}
            </div>
            {/* Progress indicator dot */}
            {progressPercent > 0 && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-orange-500 shadow-lg transition-all ease-out ${
                  isLevelingUp ? "duration-[600ms]" : "duration-500"
                } ${
                  showPowerUp ? "border-yellow-400 scale-125 animate-pulse" : ""
                }`}
                style={{ left: `calc(${Math.max(0, Math.min(100, progressPercent))}% - 12px)` }}
              />
            )}
            {/* Power-up glow effect */}
            {showPowerUp && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 rounded-full opacity-50 animate-pulse blur-sm" />
            )}
          </div>
          
          {/* Encouraging Message */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">
              {pointsNeeded > 0 ? (
                <>
                  <span className="text-orange-600">{pointsNeeded} points</span> until your hero evolves! 🚀
                </>
              ) : (
                <span className="text-green-600">Ready to evolve! 🎉</span>
              )}
            </p>
          </div>

          {/* Next Evolution Preview */}
          {pointsNeeded > 0 && progress.level < 4 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-xs text-gray-500 font-medium">Next evolution:</span>
              <div className="relative">
                <Image
                  src={nextEvolutionImage}
                  alt="Next Evolution"
                  width={40}
                  height={40}
                  className="opacity-60"
                />
              </div>
            </div>
          )}
        </div>

        {/* Total Points Display */}
        <div className="text-center bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-4 border-2 border-orange-200">
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Total Points
          </div>
          <div className="text-3xl font-bold gradient-text-orange">
            {progress.totalPoints}
          </div>
        </div>
      </div>
    </div>
  );
}
