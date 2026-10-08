"use client";

import { useState } from "react";
import { FileType2 } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
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
      const blob = await callConvertApi("/api/convert/pdf-to-word", [files[0]], "file");
      downloadBlob(blob, "converted.docx");
      setMessage("✅ Downloaded converted.docx");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="PDF → Word"
      description="Convert PDF to editable .docx"
      icon={FileType2}
      color="purple"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <SubmitButton loading={loading} onClick={run} label="Convert to Word" loadingLabel="Converting… (may take 30-60s)" />
      <FormMessage message={message} />
    </ToolPage>
  );
}