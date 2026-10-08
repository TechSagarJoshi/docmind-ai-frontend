"use client";

import { useState } from "react";
import { Combine } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (files.length < 2) {
      setMessage("❌ Select at least 2 Excel files.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/merge-excel", files, "files");
      downloadBlob(blob, "merged.xlsx");
      setMessage("✅ Downloaded merged.xlsx");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Merge Excel"
      description="Join multiple workbooks as sheets"
      icon={Combine}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} multiple accept=".xlsx,.xls" label="Choose 2 or more Excel files" />
      <SubmitButton loading={loading} onClick={run} label="Merge Excel" loadingLabel="Merging…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}