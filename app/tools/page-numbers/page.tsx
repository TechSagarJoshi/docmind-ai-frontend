"use client";

import { useState } from "react";
import { Hash } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select, Range } from "@/components/ToolForm";

const POSITIONS = [
  { value: "bottom-center", label: "Bottom center" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-right", label: "Bottom right" },
  { value: "top-center", label: "Top center" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(11);
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
      const blob = await callPdfApiSingle("/api/pdf/page-numbers", files[0], {
        position,
        start_number: String(startNumber),
        font_size: String(fontSize),
      });
      downloadBlob(blob, "numbered.pdf");
      setMessage("✅ Downloaded numbered.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Add Page Numbers"
      description="Number every page in your PDF"
      icon={Hash}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <Select label="Position" value={position} onChange={setPosition} options={POSITIONS} />
      <Range label="Start at" value={startNumber} onChange={setStartNumber} min={1} max={100} />
      <Range label="Font size" value={fontSize} onChange={setFontSize} min={8} max={24} suffix="pt" />
      <SubmitButton loading={loading} onClick={run} label="Add Page Numbers" loadingLabel="Adding…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}