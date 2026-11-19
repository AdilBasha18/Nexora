import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ShineBorderProps = {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  duration?: number;
  gradient?: string;
};

/**
 * ShineBorder - Vivid multi-color glowing gradient border matching user's exact reference (PricingCard / Pro Plus).
 * Features a spinning conic gradient with crisp 1.5px/2px border line and subtle ambient outer glow.
 */
export const ShineBorder = ({
  children,
  className,
  borderWidth = 1.5,
  duration = 8,
  gradient,
}: ShineBorderProps) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl group",
        className
      )}
      style={{ padding: borderWidth }}
    >
      {/* Ambient Outer Glow Layer */}
      <div 
        className="absolute -inset-[1px] rounded-2xl opacity-60 blur-[6px] pointer-events-none transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, #f97316 0%, #2dd4bf 35%, #3b82f6 65%, #a855f7 100%)",
        }}
      />

      {/* Animated Conic Gradient Border Layer */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className={cn(
            "absolute -inset-[200%] animate-spin pointer-events-none",
            gradient
          )}
          style={{
            animationDuration: `${duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            background:
              "conic-gradient(from 0deg at 50% 50%, #f97316 0deg, #fb7185 60deg, #2dd4bf 140deg, #06b6d4 190deg, #3b82f6 240deg, #a855f7 300deg, #f97316 360deg)",
          }}
        />
      </div>

      {/* Dark Content Surface */}
      <div className="relative rounded-[calc(1rem-1.5px)] bg-[#0d0e12] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default ShineBorder;
