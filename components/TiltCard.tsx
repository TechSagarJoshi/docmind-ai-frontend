"use client";

import { useRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

export default function TiltCard({
  children,
  className = "",
  maxTilt = 6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateY = x * maxTilt * 2;
    const rotateX = -y * maxTilt * 2;

    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}