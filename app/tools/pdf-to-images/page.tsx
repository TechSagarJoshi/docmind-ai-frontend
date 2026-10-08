"use client";

import { useState } from "react";
import { FileImage } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select } from "@/components/ToolForm";

const FORMATS = [
  { value: "jpeg", label: "JPEG (smaller)" },
  { value: "png", label: "PNG (lossless)" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [fmt, setFmt] = useState("jpeg");
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
      const blob = await callConvertApi("/api/convert/pdf-to-images", [files[0]], "file", { fmt });
      downloadBlob(blob, "pdf_images.zip");
      setMessage("✅ Downloaded pdf_images.zip");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="PDF → Images"
      description="Export each PDF page as an image"
      icon={FileImage}
      color="amber"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <Select label="Output format" value={fmt} onChange={setFmt} options={FORMATS} />
      <SubmitButton loading={loading} onClick={run} label="Convert to Images" loadingLabel="Converting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}