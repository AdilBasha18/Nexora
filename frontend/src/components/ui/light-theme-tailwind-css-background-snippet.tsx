import React from "react";
import { cn } from "@/lib/utils";
import { RadialBackground as BaseRadialBackground } from "./radial-background";

export const RadialBackground = ({ className }: { className?: string }) => {
  return <BaseRadialBackground className={className} />;
};

export default RadialBackground;
