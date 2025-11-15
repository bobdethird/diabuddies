"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DetailedInsight } from "@/types";

interface DetailedTipsModalProps {
  insights: DetailedInsight[];
  isOpen: boolean;
  onClose: () => void;
}

export function DetailedTipsModal({ insights, isOpen, onClose }: DetailedTipsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || insights.length === 0) return null;

  const currentInsight = insights[currentIndex];
  const isLastSlide = currentIndex === insights.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onClose();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleClose = () => {
    setCurrentIndex(0);
    onClose();
  };

  // Determine color scheme based on isGood
  const colorScheme = currentInsight.isGood
    ? {
        badge: "bg-green-500",
        badgeText: "text-green-800",
        border: "border-green-300",
        text: "text-green-700",
        bg: "bg-green-50",
      }
    : {
        badge: "bg-orange-500",
        badgeText: "text-orange-800",
        border: "border-orange-300",
        text: "text-orange-700",
        bg: "bg-orange-50",
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

        {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in border-4 border-blue-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content with slide transition */}
        <div
          key={currentIndex}
          className="p-8 md:p-10 overflow-y-auto max-h-[90vh] animate-slide-in-right"
        >
          {/* Slide Indicator */}
          <div className="text-center mb-6">
            <span className="text-sm font-semibold text-gray-500">
              {currentIndex + 1} of {insights.length}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
            {currentInsight.title}
          </h2>

          {/* Stat Display */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* User Value */}
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Your Number
                </div>
                <div className={`text-5xl md:text-6xl font-bold ${colorScheme.text}`}>
                  {currentInsight.userValue}
                </div>
              </div>

              {/* VS */}
              <div className="text-2xl font-bold text-gray-400">vs</div>

              {/* Reference Value */}
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Normal Range
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-700">
                  {currentInsight.referenceValue}
                </div>
              </div>
            </div>

            {/* Visual Indicator Badge */}
            <div className="flex justify-center mb-4">
              <div
                className={`${colorScheme.badge} ${colorScheme.badgeText} px-6 py-3 rounded-full font-bold text-lg shadow-lg`}
              >
                {currentInsight.isGood ? "✅ Great Job!" : "⚠️ Needs Attention"}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className={`${colorScheme.bg} ${colorScheme.border} border-2 rounded-2xl p-6 mb-6`}>
            <div className="text-xl md:text-2xl font-semibold mb-3 text-gray-800">
              {currentInsight.explanation}
            </div>
            <div className="text-lg text-gray-700 leading-relaxed">
              {currentInsight.simpleExplanation}
            </div>
          </div>

          {/* Action */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <div className="text-lg font-semibold text-blue-800 mb-2">💡 What You Can Do:</div>
            <div className="text-xl text-blue-900 font-medium">{currentInsight.action}</div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-all hover:scale-105"
            >
              {isLastSlide ? (
                "Done! 🎉"
              ) : (
                <>
                  Next Tip
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

