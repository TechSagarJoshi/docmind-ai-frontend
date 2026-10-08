"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import TiltCard from "./TiltCard";

type Props = {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "green" | "amber";
};

const COLOR_MAP = {
  blue: {
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    glow: "glow-blue",
  },
  purple: {
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    glow: "glow-purple",
  },
  green: {
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    glow: "glow-green",
  },
  amber: {
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    glow: "glow-amber",
  },
};

export default function ToolCard({ href, label, desc, icon: Icon, color }: Props) {
  const c = COLOR_MAP[color];
  return (
    <TiltCard maxTilt={5}>
      <Link
        href={href}
        className={`group block p-5 glass rounded-2xl border border-white/60 ${c.glow} icon-bounce transition-shadow duration-300`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center icon-inner`}
          >
            <Icon className={`w-6 h-6 ${c.iconColor}`} strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 mb-1 group-hover:text-slate-950">
              {label}
            </div>
            <div className="text-sm text-slate-500 leading-snug">{desc}</div>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}