"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { postFile } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) {
      setMessage("❌ Select a PDF first.");
      return;
    }
    setLoading(true);
    setMessage("");
    setResults([]);
    try {
      const data = await postFile("/api/convert/extract-emails", files[0]);
      setResults(data.items || []);
      setMessage(`✅ Found ${data.count} email(s)`);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    const csv = ["email", ...results].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    downloadBlob(blob, "emails.csv");
  }

  return (
    <ToolPage
      title="Extract Emails"
      description="Find all email addresses in a PDF"
      icon={Mail}
      color="amber"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <SubmitButton loading={loading} onClick={run} label="Extract Emails" loadingLabel="Extracting…" />
      <FormMessage message={message} />

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-slate-700">
              Found {results.length} email(s)
            </div>
            <button
              onClick={downloadCsv}
              className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Download CSV
            </button>
          </div>
          <ul className="space-y-1">
            {results.map((e, i) => (
              <li key={i} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg font-mono">
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolPage>
  );
}