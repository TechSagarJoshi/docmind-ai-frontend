"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) return setMessage("❌ Select a CSV or Excel file first.");
    setLoading(true);
    setMessage("");
    try {
      const ext = files[0].name.toLowerCase().endsWith(".xlsx") ? "xlsx" : "csv";
      const blob = await callConvertApi(
        "/api/convert/remove-empty-rows",
        [files[0]],
        "file"
      );
      downloadBlob(blob, `cleaned.${ext}`);
      setMessage(`✅ Downloaded cleaned.${ext}`);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Remove Empty Rows"
      description="Delete blank rows from a CSV or Excel file"
      icon={Filter}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} accept=".csv,.xlsx,.xls" label="Choose CSV or Excel" />
      <SubmitButton loading={loading} onClick={run} label="Clean Rows" loadingLabel="Processing…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}