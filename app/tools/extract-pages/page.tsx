"use client";

import { useState } from "react";
import { FileOutput } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, TextInput } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("1-3");
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
      const blob = await callPdfApiSingle("/api/pdf/extract-pages", files[0], { pages });
      downloadBlob(blob, "extracted.pdf");
      setMessage("✅ Downloaded extracted.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Extract Pages"
      description="Create a new PDF from specific pages"
      icon={FileOutput}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <TextInput label="Pages to extract" value={pages} onChange={setPages} placeholder="e.g. 1-3,5,7-9" />
      <SubmitButton loading={loading} onClick={run} label="Extract Pages" loadingLabel="Extracting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}