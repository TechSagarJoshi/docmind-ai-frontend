"use client";

import { Upload, Settings, Download } from "lucide-react";

type Props = {
  steps?: {
    title: string;
    desc: string;
  }[];
};

const DEFAULT_STEPS = [
  {
    icon: Upload,
    title: "Upload your file",
    desc: "Choose a file from your device or drag and drop it here.",
    color: "blue",
  },
  {
    icon: Settings,
    title: "We process it",
    desc: "Our server runs the conversion or compression in seconds.",
    color: "purple",
  },
  {
    icon: Download,
    title: "Download the result",
    desc: "Save your file instantly. No watermarks, no limits.",
    color: "green",
  },
];

const COLOR_MAP = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  green: { bg: "bg-emerald-100", text: "text-emerald-600" },
};

export default function HowItWorks({ steps }: Props) {
  const items = steps
    ? steps.map((s, i) => ({
        icon: DEFAULT_STEPS[i]?.icon ?? Upload,
        title: s.title,
        desc: s.desc,
        color: DEFAULT_STEPS[i]?.color ?? "blue",
      }))
    : DEFAULT_STEPS;

  return (
    <div className="mt-8 fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">How it works</h2>
        <p className="text-sm text-slate-500">
          Three simple steps — no account needed for basic use
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((s, i) => {
          const c = COLOR_MAP[s.color as keyof typeof COLOR_MAP];
          return (
            <div
              key={i}
              className="glass rounded-2xl p-5 border border-white/60 relative overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-3 right-4 text-4xl font-bold text-slate-200/50 select-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <s.icon className={`w-5 h-5 ${c.text}`} strokeWidth={2.2} />
              </div>
              <div className="font-semibold text-slate-900 mb-1 text-sm">
                {s.title}
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                {s.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}