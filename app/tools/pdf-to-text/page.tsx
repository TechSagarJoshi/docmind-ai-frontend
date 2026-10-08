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
    if (!files[0]) return setMessage("❌ Select a PDF first.");
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/pdf-to-text", [files[0]], "file");
      downloadBlob(blob, "extracted.txt");
      setMessage("✅ Downloaded extracted.txt");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="PDF → Text"
      description="Extract plain text from a PDF"
      icon={FileType2}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <SubmitButton loading={loading} onClick={run} label="Extract Text" loadingLabel="Extracting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}