"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select, Range } from "@/components/ToolForm";

type Mode = "quality" | "target";

const FORMATS = [
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<Mode>("quality");
  const [quality, setQuality] = useState(75);
  const [targetKb, setTargetKb] = useState(200);
  const [format, setFormat] = useState("jpg");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const showQuality = format === "jpg" || format === "webp";

  async function run() {
    if (!files[0]) {
      setMessage("❌ Select an image first.");
      return;
    }
    setLoading(true);
    setMessage("");
    const originalSize = (files[0].size / 1024).toFixed(1);
    try {
      const blob = await callConvertApi(
        "/api/convert/image-compress",
        [files[0]],
        "file",
        {
          output_format: format,
          quality: String(quality),
          target_kb: mode === "target" ? String(targetKb) : "0",
        }
      );
      const newSize = (blob.size / 1024).toFixed(1);
      const reduction = (
        ((files[0].size - blob.size) / files[0].size) *
        100
      ).toFixed(1);
      downloadBlob(blob, `compressed.${format}`);
      setMessage(`✅ ${originalSize} KB → ${newSize} KB (${reduction}% smaller)`);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Image Compressor"
      description="Reduce image file size"
      icon={Zap}
      color="amber"
    >
      <FileInput files={files} onChange={setFiles} accept="image/*" label="Choose an image" />

      <div className="flex gap-2">
        <button
          onClick={() => setMode("quality")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            mode === "quality"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          By Quality
        </button>
        <button
          onClick={() => setMode("target")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            mode === "target"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Target Size
        </button>
      </div>

      {mode === "quality" && showQuality && (
        <Range label="Quality" value={quality} onChange={setQuality} min={10} max={100} suffix="%" hint="70–85% is usually best" />
      )}

      {mode === "target" && (
        <Range label="Target size" value={targetKb} onChange={setTargetKb} min={20} max={2000} step={10} suffix=" KB" hint="We'll find the highest quality that fits" />
      )}

      <Select label="Output format" value={format} onChange={setFormat} options={FORMATS} />

      <SubmitButton loading={loading} onClick={run} label="Compress Image" loadingLabel="Compressing…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}