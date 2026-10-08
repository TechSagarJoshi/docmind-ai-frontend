"use client";

import { useState } from "react";
import { FileArchive } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select } from "@/components/ToolForm";

const QUALITIES = [
  { value: "low", label: "Low (fastest, less compression)" },
  { value: "medium", label: "Medium (balanced)" },
  { value: "high", label: "High (smallest file)" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) {
      setMessage("❌ Select a PDF first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callPdfApiSingle("/api/pdf/compress", files[0], { quality });
      downloadBlob(blob, "compressed.pdf");
      setMessage("✅ Downloaded compressed.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Compress PDF"
      description="Reduce PDF file size"
      icon={FileArchive}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <Select label="Compression level" value={quality} onChange={setQuality} options={QUALITIES} />
      <SubmitButton loading={loading} onClick={run} label="Compress PDF" loadingLabel="Compressing…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}