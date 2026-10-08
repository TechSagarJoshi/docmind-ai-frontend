"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
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
      setMessage("❌ Select at least 2 CSV files.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/merge-csv", files, "files");
      downloadBlob(blob, "merged.csv");
      setMessage("✅ Downloaded merged.csv");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Merge CSV"
      description="Stack multiple CSV files vertically"
      icon={Layers}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} multiple accept=".csv" label="Choose 2 or more CSV files" />
      <SubmitButton loading={loading} onClick={run} label="Merge CSV" loadingLabel="Merging…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}