"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { callPdfApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (files.length < 2) {
      setMessage("❌ Select at least 2 PDFs.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callPdfApi("/api/pdf/merge", files);
      downloadBlob(blob, "merged.pdf");
      setMessage("✅ Downloaded merged.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Merge PDFs"
      description="Combine multiple PDFs into one"
      icon={Layers}
      color="blue"
    >
      <FileInput
        files={files}
        onChange={setFiles}
        multiple
        accept="application/pdf"
        label="Choose PDF files (2 or more)"
      />
      <SubmitButton loading={loading} onClick={run} label="Merge PDFs" loadingLabel="Merging…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}