"use client";

import { useState } from "react";
import { ScanText } from "lucide-react";
import { callConvertApi } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select } from "@/components/ToolForm";

const LANGUAGES = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi" },
  { value: "eng+hin", label: "English + Hindi" },
  { value: "fra", label: "French" },
  { value: "deu", label: "German" },
  { value: "spa", label: "Spanish" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState("eng");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) return setMessage("❌ Select a PDF first.");
    setLoading(true);
    setMessage("");
    try {
      const blob = await callConvertApi(
        "/api/convert/ocr-pdf",
        [files[0]],
        "file",
        { language }
      );
      downloadBlob(blob, "ocr.txt");
      setMessage("✅ Downloaded ocr.txt");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="OCR PDF"
      description="Extract text from scanned PDFs (uses Tesseract)"
      icon={ScanText}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a scanned PDF" />
      <Select label="Language" value={language} onChange={setLanguage} options={LANGUAGES} />
      <SubmitButton
        loading={loading}
        onClick={run}
        label="Run OCR"
        loadingLabel="Processing… (can take 30-60s per page)"
      />
      <FormMessage message={message} />
    </ToolPage>
  );
}