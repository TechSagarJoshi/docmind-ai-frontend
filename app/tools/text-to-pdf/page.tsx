"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) return setMessage("❌ Select a .txt file first.");
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/text-to-pdf", [files[0]], "file");
      downloadBlob(blob, "converted.pdf");
      setMessage("✅ Downloaded converted.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Text → PDF"
      description="Convert a .txt file into a clean PDF"
      icon={FileText}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept=".txt,text/plain" label="Choose a .txt file" />
      <SubmitButton loading={loading} onClick={run} label="Convert to PDF" loadingLabel="Converting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}