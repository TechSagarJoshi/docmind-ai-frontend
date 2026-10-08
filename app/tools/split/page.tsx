"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, TextInput } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("1-2");
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
      const blob = await callPdfApiSingle("/api/pdf/split", files[0], { pages });
      downloadBlob(blob, "split.pdf");
      setMessage("✅ Downloaded split.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Split PDF"
      description="Extract page ranges into a new PDF"
      icon={Scissors}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <TextInput label="Pages to extract" value={pages} onChange={setPages} placeholder="e.g. 1-3,5,7-9" />
      <SubmitButton loading={loading} onClick={run} label="Split PDF" loadingLabel="Splitting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}