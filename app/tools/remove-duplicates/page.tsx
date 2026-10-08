"use client";

import { useState } from "react";
import { CopyX } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, TextInput } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [column, setColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) return setMessage("❌ Select a CSV or Excel file first.");
    setLoading(true);
    setMessage("");
    try {
      const ext = files[0].name.toLowerCase().endsWith(".xlsx") ? "xlsx" : "csv";
      const blob = await callConvertApi(
        "/api/convert/remove-duplicates",
        [files[0]],
        "file",
        { column }
      );
      downloadBlob(blob, `deduped.${ext}`);
      setMessage(`✅ Downloaded deduped.${ext}`);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Remove Duplicates"
      description="Remove repeated rows from a CSV or Excel file"
      icon={CopyX}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} accept=".csv,.xlsx,.xls" label="Choose CSV or Excel" />
      <TextInput
        label="Dedupe by column (optional)"
        value={column}
        onChange={setColumn}
        placeholder="e.g. email — leave blank for full-row dedupe"
      />
      <SubmitButton loading={loading} onClick={run} label="Remove Duplicates" loadingLabel="Processing…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}