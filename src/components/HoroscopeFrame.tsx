"use client";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  size?: number;
  variant?: "mini" | "detail";
  axisMarker?: { label: string; angle: number }[];
  /** Pentagon vertices in unit circle (0..1 radius). Order O, C, E, A, N. */
  aspect?: [number, number, number, number, number];
  className?: string;
}

/**
 * Night-sky horoscope frame that wraps a pattern canvas.
 * - mini: subtle ring + 12 ticks, suitable for gallery grid (140-160px)
 * - detail: full wheel with axis markers and optional aspect pentagon (240px+)
 */
export default function HoroscopeFrame({
  children,
  size = 140,
  variant = "mini",
  axisMarker,
  aspect,
  className,
}: Props) {
  const ringInset = variant === "mini" ? 4 : 10;
  const canvasInset = variant === "mini" ? 10 : 22;

  const outerR = size / 2 - ringInset;
  const innerR = outerR - (variant === "mini" ? 6 : 14);
  const cx = size / 2;
  const cy = size / 2;

  const houseLines = Array.from({ length: 12 }, (_, i) => i * 30);
  const markers =
    axisMarker ??
    (variant === "detail"
      ? [
          { label: "O", angle: 0 },
          { label: "C", angle: 72 },
          { label: "E", angle: 144 },
          { label: "A", angle: 216 },
          { label: "N", angle: 288 },
        ]
      : null);

  // Pentagon math — aspect is normalized radii for O/C/E/A/N in that order
  const pentagon = aspect
    ? aspect
        .map((r, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180); // O at top
          const rad = r * (innerR - (variant === "mini" ? 4 : 12));
          return `${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad}`;
        })
        .join(" ")
    : null;

  const tickLen = variant === "mini" ? 4 : 7;
  const markerR = variant === "mini" ? 6 : 9;

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size }}
    >
      <div
        style={{
          position: "absolute",
          inset: canvasInset,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id={`gold-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8cb95" />
            <stop offset="50%" stopColor="#d4b580" />
            <stop offset="100%" stopColor="#a88b55" />
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          fill="none"
          stroke={`url(#gold-${size})`}
          strokeWidth={variant === "mini" ? 1 : 1.5}
        />

        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="none"
          stroke="#d4b580"
          strokeWidth={0.5}
          opacity={0.6}
        />

        {/* 12 house tick marks */}
        <g stroke="#d4b580" strokeWidth={0.8} opacity={0.6}>
          {houseLines.map((deg) => (
            <line
              key={deg}
              x1={cx}
              y1={cy - outerR}
              x2={cx}
              y2={cy - outerR + tickLen}
              transform={`rotate(${deg} ${cx} ${cy})`}
            />
          ))}
        </g>

        {/* Axis markers (detail only) */}
        {markers && (
          <g>
            {markers.map(({ label, angle }) => {
              const rad = (angle - 90) * (Math.PI / 180);
              const mx = cx + Math.cos(rad) * outerR;
              const my = cy + Math.sin(rad) * outerR;
              return (
                <g key={label} transform={`translate(${mx} ${my})`}>
                  <circle
                    r={markerR}
                    fill="#14182e"
                    stroke="#d4b580"
                    strokeWidth={1}
                  />
                  <text
                    y="3.5"
                    textAnchor="middle"
                    fontFamily="Cormorant Garamond, serif"
                    fontSize={variant === "detail" ? 11 : 9}
                    fill="#d4b580"
                    fontStyle="italic"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Aspect pentagon (real data) */}
        {pentagon && (
          <g>
            <polygon
              points={pentagon}
              fill="rgba(155,143,212,0.15)"
              stroke="#9b8fd4"
              strokeWidth={0.8}
              opacity={0.7}
            />
            {aspect?.map((r, i) => {
              const angle = (i * 72 - 90) * (Math.PI / 180);
              const rad = r * (innerR - (variant === "mini" ? 4 : 12));
              return (
                <circle
                  key={i}
                  cx={cx + Math.cos(angle) * rad}
                  cy={cy + Math.sin(angle) * rad}
                  r={2}
                  fill="#d4b580"
                />
              );
            })}
          </g>
        )}

        {/* Inner core ring around the pattern */}
        <circle
          cx={cx}
          cy={cy}
          r={size / 2 - canvasInset}
          fill="none"
          stroke="#d4b580"
          strokeWidth={variant === "mini" ? 0.8 : 1.2}
          opacity={0.9}
        />
      </svg>
    </div>
  );
}
