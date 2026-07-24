"use client";

import { cn } from "@/lib/utils";
import React from "react";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 16,
  borderWidth = 2,
  duration = 5,
  color = ["#3B82F6", "#FFFFFF", "#2563EB", "#FFFFFF"],
  className,
  children,
}: ShineBorderProps) {
  const colorsArray = Array.isArray(color) ? color : [color];
  const colorString = colorsArray.join(", ");

  return (
    <div
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
      }}
      className={cn("relative w-full overflow-hidden p-[2px]", className)}
    >
      {/* Animated Glowing Conic Gradient (Azul e Branco) */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `conic-gradient(from 0deg at 50% 50%, ${colorString})`,
          animation: `shine-spin ${duration}s linear infinite`,
          filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.8))",
        }}
        className="pointer-events-none"
      />

      {/* Inner Card Wrapper */}
      <div
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
        }}
        className="relative z-10 w-full h-full bg-[#0B1120] overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}
