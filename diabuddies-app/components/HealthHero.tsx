"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import confetti from "canvas-confetti";
import {
  getProgressToNextLevel,
  getPointsNeededForNextLevel,
} from "@/lib/leveling";
import type { UserProgress, DetailedInsight } from "@/types";
import { DetailedTipsModal } from "./DetailedTipsModal";
import { Button } from "@/components/ui/button";

interface HealthHeroProps {
  progress: UserProgress;
  healthInsights?: string[];
  detailedInsights?: DetailedInsight[];
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

export function HealthHero({ progress, healthInsights = [], detailedInsights = [] }: HealthHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showPowerUp, setShowPowerUp] = useState(false);
  const [showDetailedTips, setShowDetailedTips] = useState(false);
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
  const [shouldEvolveBounce, setShouldEvolveBounce] = useState(false);

  // Smooth transition when evolution changes with bounce animation
  useEffect(() => {
    if (currentImage !== heroImage) {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImage(heroImage);
        setIsVisible(true);
        // Trigger evolve bounce animation
        setShouldEvolveBounce(true);
        // Reset after animation completes
        setTimeout(() => {
          setShouldEvolveBounce(false);
        }, 800);
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
      {/* Hero Card - Chunky Duolingo Style */}
      <div className="relative rounded-3xl bg-white p-8 border-5 border-[#1CB0F6] shadow-[0_10px_0_0_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Solid Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-40" />
        
        {/* Fun Stars - No blur, solid colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Star className="absolute top-8 left-12 w-4 h-4 text-[#FFC800] animate-float fill-[#FFC800]" />
          <Star className="absolute top-16 right-16 w-3 h-3 text-[#58CC02] animate-float-delayed fill-[#58CC02]" />
          <Star className="absolute bottom-20 left-20 w-3 h-3 text-[#1CB0F6] animate-float fill-[#1CB0F6]" />
          <Star className="absolute bottom-12 right-12 w-4 h-4 text-[#CE82FF] animate-float-delayed fill-[#CE82FF]" />
        </div>

        {/* "Your Health Hero" Badge - Comic Style */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#58CC02] text-white px-6 py-3 rounded-2xl shadow-[0_5px_0_0_#46A302] border-3 border-[#46A302] mb-4">
            <Star className="w-5 h-5 fill-white" />
            <span className="font-black text-xl tracking-wide">YOUR HEALTH HERO</span>
            <Star className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Hero Avatar Section */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Hero Image - stays centered */}
          <div className="relative h-[260px] w-[260px] flex items-center justify-center">
            {/* Solid Circle Background - No blur */}
            <div className="absolute inset-0 bg-[#FFC800] rounded-full opacity-30 -z-10 scale-110 border-4 border-[#E6B400]" />
            <div className={`relative ${shouldEvolveBounce ? "" : "animate-bounce-slow"}`}>
              <Image
                src={currentImage}
                alt="Health Hero"
                width={260}
                height={260}
                className={`drop-shadow-2xl transition-all duration-500 hover:scale-110 ${
                  shouldEvolveBounce ? "animate-evolve-bounce" : "animate-pulse-gentle"
                } ${
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
          
          {/* Health Insights Speech Bubble - Comic Style positioned on the right */}
          {healthInsights.length > 0 && (
            <div className="absolute left-[calc(50%+150px)] top-1/2 -translate-y-1/2 z-20 w-[280px] sm:w-[320px] hidden md:block">
              <div className="bg-white border-4 border-[#1CB0F6] rounded-2xl p-5 shadow-[0_6px_0_0_rgba(28,176,246,0.3)] animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">💬</div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-[#1CB0F6] mb-3 uppercase tracking-wider">
                      HEALTH TIPS FROM YOUR BUDDY!
                    </div>
                    <div className="space-y-3">
                      {healthInsights.map((insight, index) => (
                        <div
                          key={index}
                          className="text-base text-[#3C3C3C] leading-relaxed animate-slide-in font-bold"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="text-[#58CC02] font-black text-xl">•</span> {insight}
                        </div>
                      ))}
                    </div>
                    {/* Learn More Button */}
                    {detailedInsights.length > 0 && (
                      <div className="mt-4">
                        <Button
                          onClick={() => setShowDetailedTips(true)}
                          variant="duoBlue"
                          size="sm"
                          className="w-full text-sm"
                        >
                          Learn More 📚
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Speech bubble tail pointing left - chunky */}
                <div className="absolute top-1/2 -left-4 -translate-y-1/2">
                  <div className="w-0 h-0 border-t-[16px] border-b-[16px] border-r-[16px] border-t-transparent border-b-transparent border-r-[#1CB0F6]"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Health Insights Speech Bubble - mobile version below avatar */}
          {healthInsights.length > 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-20 w-[90%] max-w-[320px] md:hidden">
              <div className="bg-white border-4 border-[#1CB0F6] rounded-2xl p-5 shadow-[0_6px_0_0_rgba(28,176,246,0.3)] animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">💬</div>
                  <div className="flex-1">
                    <div className="text-sm font-black text-[#1CB0F6] mb-3 uppercase tracking-wider">
                      HEALTH TIPS FROM YOUR BUDDY!
                    </div>
                    <div className="space-y-3">
                      {healthInsights.map((insight, index) => (
                        <div
                          key={index}
                          className="text-base text-[#3C3C3C] leading-relaxed animate-slide-in font-bold"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="text-[#58CC02] font-black text-xl">•</span> {insight}
                        </div>
                      ))}
                    </div>
                    {/* Learn More Button */}
                    {detailedInsights.length > 0 && (
                      <div className="mt-4">
                        <Button
                          onClick={() => setShowDetailedTips(true)}
                          variant="duoBlue"
                          size="sm"
                          className="w-full text-sm"
                        >
                          Learn More 📚
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Speech bubble tail pointing up - chunky */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#1CB0F6]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Tips Modal */}
        <DetailedTipsModal
          insights={detailedInsights}
          isOpen={showDetailedTips}
          onClose={() => setShowDetailedTips(false)}
        />

        {/* Circular Level Badge - Chunky Style */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            {/* Level Up Animation Overlay */}
            {showPowerUp && (
              <div className="absolute inset-0 -m-8 flex items-center justify-center pointer-events-none z-10">
                <div className="text-6xl font-black text-[#FFC800] comic-text animate-pop-in" style={{ textShadow: '4px 4px 0px #3C3C3C, -2px -2px 0px white' }}>
                  LEVEL UP!
                </div>
              </div>
            )}
            <div className={`relative bg-[#1CB0F6] rounded-full w-28 h-28 flex items-center justify-center border-6 border-[#1899D6] shadow-[0_8px_0_0_#1899D6] transition-all duration-300 ${
              showPowerUp ? "scale-110 shadow-[0_12px_0_0_#1899D6] -translate-y-1" : ""
            }`}>
              <div className="text-center">
                <div className="text-xs text-white font-black uppercase tracking-wider">
                  LEVEL
                </div>
                <div className={`text-5xl font-black text-white transition-all duration-300 ${
                  showPowerUp ? "scale-125" : ""
                }`}>
                  {progress.level}
                </div>
              </div>
            </div>
            {/* Power-up stars around badge */}
            {showPowerUp && (
              <>
                <Star className="absolute -top-2 -left-2 w-8 h-8 text-[#FFC800] fill-[#FFC800] animate-star-burst" />
                <Star className="absolute -top-2 -right-2 w-7 h-7 text-[#FFC800] fill-[#FFC800] animate-star-burst delay-100" />
                <Star className="absolute -bottom-2 -left-2 w-7 h-7 text-[#FFC800] fill-[#FFC800] animate-star-burst delay-200" />
                <Star className="absolute -bottom-2 -right-2 w-8 h-8 text-[#FFC800] fill-[#FFC800] animate-star-burst delay-300" />
              </>
            )}
          </div>
        </div>

        {/* Chunky Progress Bar - Duolingo Style */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold text-base text-[#3C3C3C]">Progress to Next Level</span>
            <span className={`font-black text-xl transition-colors duration-300 ${
              showPowerUp ? "text-[#FFC800] scale-110 comic-text" : "text-[#58CC02]"
            }`}>
              {showPowerUp ? "LEVEL UP! 🎉" : `${Math.round(progressPercent)}%`}
            </span>
          </div>
          
          {/* Chunky Progress Bar with thick borders */}
          <div className="relative h-10 bg-gray-200 rounded-full overflow-hidden border-4 border-gray-300 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]">
            <div
              className={`h-full bg-[#58CC02] rounded-full transition-all ease-out ${
                isLevelingUp ? "duration-[600ms]" : "duration-500"
              } ${
                showPowerUp ? "bg-[#FFC800]" : ""
              }`}
              style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
            >
              {showPowerUp && (
                <div className="absolute inset-0 animate-pulse" />
              )}
            </div>
            {/* Progress indicator circle */}
            {progressPercent > 0 && (
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-4 border-[#58CC02] shadow-md transition-all ease-out ${
                  isLevelingUp ? "duration-[600ms]" : "duration-500"
                } ${
                  showPowerUp ? "border-[#FFC800] scale-125" : ""
                }`}
                style={{ left: `calc(${Math.max(0, Math.min(100, progressPercent))}% - 16px)` }}
              />
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

        {/* Total Points Display - Chunky Style */}
        <div className="text-center bg-[#FFC800] rounded-2xl p-5 border-5 border-[#E6B400] shadow-[0_8px_0_0_#E6B400]">
          <div className="text-xs font-black text-[#3C3C3C] uppercase tracking-wider mb-2">
            TOTAL POINTS
          </div>
          <div className="text-4xl font-black text-[#3C3C3C]">
            {progress.totalPoints}
          </div>
        </div>
      </div>
    </div>
  );
}
