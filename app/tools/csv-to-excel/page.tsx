"use client";

import { useState } from "react";
import { Grid3x3 } from "lucide-react";
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
      setMessage("❌ Select a CSV file first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/csv-to-excel", [files[0]], "file");
      downloadBlob(blob, "converted.xlsx");
      setMessage("✅ Downloaded converted.xlsx");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="CSV → Excel"
      description="Convert CSV to spreadsheet"
      icon={Grid3x3}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} accept=".csv" label="Choose a CSV file" />
      <SubmitButton loading={loading} onClick={run} label="Convert to Excel" loadingLabel="Converting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}