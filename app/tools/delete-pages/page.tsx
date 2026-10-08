"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, TextInput } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState("2");
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
      const blob = await callPdfApiSingle("/api/pdf/delete-pages", files[0], { pages });
      downloadBlob(blob, "pages_deleted.pdf");
      setMessage("✅ Downloaded pages_deleted.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Delete Pages"
      description="Remove unwanted pages from a PDF"
      icon={Trash2}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <TextInput label="Pages to delete" value={pages} onChange={setPages} placeholder="e.g. 2,4,6-8" />
      <SubmitButton loading={loading} onClick={run} label="Delete Pages" loadingLabel="Deleting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}