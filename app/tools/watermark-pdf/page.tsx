"use client";

import { useState } from "react";
import { Stamp } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, TextInput, Range } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) {
      setMessage("❌ Select a PDF first.");
      return;
    }
    if (!text.trim()) {
      setMessage("❌ Enter watermark text.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callPdfApiSingle("/api/pdf/watermark", files[0], {
        text,
        opacity: String(opacity / 100),
        font_size: String(fontSize),
      });
      downloadBlob(blob, "watermarked.pdf");
      setMessage("✅ Downloaded watermarked.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Watermark PDF"
      description="Add a diagonal text watermark to every page"
      icon={Stamp}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <TextInput label="Watermark text" value={text} onChange={setText} placeholder="e.g. CONFIDENTIAL" />
      <Range label="Opacity" value={opacity} onChange={setOpacity} min={5} max={80} suffix="%" hint="Lower = more subtle" />
      <Range label="Font size" value={fontSize} onChange={setFontSize} min={20} max={120} suffix="pt" />
      <SubmitButton loading={loading} onClick={run} label="Add Watermark" loadingLabel="Adding…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}