"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (files.length === 0) {
      setMessage("❌ Select at least 1 image.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/images-to-pdf", files, "files");
      downloadBlob(blob, "images.pdf");
      setMessage("✅ Downloaded images.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Images → PDF"
      description="Combine images into a single PDF"
      icon={ImageIcon}
      color="amber"
    >
      <FileInput files={files} onChange={setFiles} multiple accept="image/*" label="Choose images" />
      <SubmitButton loading={loading} onClick={run} label="Convert to PDF" loadingLabel="Converting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}