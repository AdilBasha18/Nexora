import React from "react";
import { cn } from "@/lib/utils";

export interface RadialBackgroundProps {
  className?: string;
}

/**
 * RadialBackground component matching the Iris Petal purple-to-pink gradient reference:
 * - Upper-left / left: deep violet / purple (#1B1035, #4A3A8C).
 * - Middle: vibrant light purple (#B58AC9).
 * - Lower-right: soft lilac / pinkish lavender (#F5D6E6).
 * - Angle: 155deg.
 * - Active in Dark Mode across all authenticated dashboard views.
 */
export const RadialBackground: React.FC<RadialBackgroundProps> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 size-full hidden dark:block transition-opacity duration-300",
        className
      )}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        backgroundColor: "#1B1035",
        backgroundImage:
          'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.080\'/></svg>"), linear-gradient(155deg, #1B1035 0%, #4A3A8C 33%, #B58AC9 67%, #F5D6E6 100%)',
        backgroundSize: "120px 120px, 100% 100%",
        backgroundBlendMode: "overlay, normal",
        backgroundAttachment: "fixed",
      }}
    >
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <filter id="grain-fb144aa7">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-fb144aa7)" />
      </svg>
    </div>
  );
};

export default RadialBackground;
