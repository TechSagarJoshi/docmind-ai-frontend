"use client";

import { useState } from "react";
import { SplitSquareHorizontal } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) return setMessage("❌ Select an Excel file first.");
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi("/api/convert/split-excel", [files[0]], "file");
      downloadBlob(blob, "sheets.zip");
      setMessage("✅ Downloaded sheets.zip");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Split Excel"
      description="Break a workbook into one file per sheet"
      icon={SplitSquareHorizontal}
      color="green"
    >
      <FileInput files={files} onChange={setFiles} accept=".xlsx,.xls" label="Choose an Excel file" />
      <SubmitButton loading={loading} onClick={run} label="Split into Sheets" loadingLabel="Splitting…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}