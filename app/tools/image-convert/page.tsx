"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select, Range } from "@/components/ToolForm";

const FORMATS = [
  { value: "jpg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
  { value: "bmp", label: "BMP" },
  { value: "tiff", label: "TIFF" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(90);
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
    try {
      const blob = await callConvertApi(
        "/api/convert/image-convert",
        [files[0]],
        "file",
        { output_format: format, quality: String(quality) }
      );
      downloadBlob(blob, `converted.${format === "jpg" ? "jpg" : format}`);
      setMessage(`✅ Downloaded converted.${format}`);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Image Converter"
      description="Convert between JPG, PNG, WEBP, BMP, TIFF"
      icon={RefreshCw}
      color="amber"
    >
      <FileInput files={files} onChange={setFiles} accept="image/*" label="Choose an image" />
      <Select label="Convert to" value={format} onChange={setFormat} options={FORMATS} />
      {showQuality && (
        <Range label="Quality" value={quality} onChange={setQuality} min={10} max={100} suffix="%" hint="Lower = smaller file" />
      )}
      <SubmitButton loading={loading} onClick={run} label="Convert Image" loadingLabel="Converting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}