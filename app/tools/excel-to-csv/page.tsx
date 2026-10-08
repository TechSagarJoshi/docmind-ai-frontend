"use client";

import { useState } from "react";
import { Table } from "lucide-react";
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
      setMessage("❌ Select an Excel file first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/excel-to-csv", [files[0]], "file");
      downloadBlob(blob, "converted.csv");
      setMessage("✅ Downloaded converted.csv");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Excel → CSV"
      description="Convert spreadsheet to CSV"
      icon={Table}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} accept=".xlsx,.xls" label="Choose an Excel file" />
      <SubmitButton loading={loading} onClick={run} label="Convert to CSV" loadingLabel="Converting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}