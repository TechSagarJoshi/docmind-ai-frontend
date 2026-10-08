"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { postFile } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage } from "@/components/ToolForm";

type ExtractionResult = {
  emails: string[];
  phones: string[];
  urls: string[];
  amounts: string[];
  gstins: string[];
  dates: string[];
  pincodes: string[];
  pans: string[];
};

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function run() {
    if (!files[0]) {
      setMessage("❌ Select a PDF first.");
      return;
    }
    setLoading(true);
    setMessage("");
    setResult(null);
    try {
      const data = await postFile("/api/convert/extract-all", files[0], { output: "json" });
      setResult(data);
      const total = Object.values(data).reduce((acc: number, arr: any) => acc + arr.length, 0);
      setMessage(`✅ Extracted ${total} total items across 8 categories`);
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadCsv() {
    if (!files[0]) return;
    try {
      const blob = await postFile("/api/convert/extract-all", files[0], { output: "csv" });
      downloadBlob(blob, "extracted.csv");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    }
  }

  const LABELS: Record<keyof ExtractionResult, string> = {
    emails: "Emails",
    phones: "Phones",
    urls: "URLs",
    amounts: "Amounts",
    gstins: "GSTINs",
    dates: "Dates",
    pincodes: "PIN codes",
    pans: "PANs",
  };

  return (
    <ToolPage
      title="Extract All Data"
      description="Pull every email, phone, URL, amount, and more into a CSV"
      icon={Database}
      color="amber"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <SubmitButton loading={loading} onClick={run} label="Extract All Data" loadingLabel="Extracting…" />
      <FormMessage message={message} />

      {result && (
        <div className="space-y-4">
          <button
            onClick={downloadCsv}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
          >
            📥 Download all as CSV
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.keys(result) as (keyof ExtractionResult)[]).map((key) => {
              const items = result[key];
              return (
                <div key={key} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <div className="text-sm font-semibold text-slate-800">
                      {LABELS[key]}
                    </div>
                    <div className="text-xs text-slate-500">{items.length} found</div>
                  </div>
                  {items.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">None found</div>
                  ) : (
                    <ul className="space-y-0.5 max-h-40 overflow-y-auto">
                      {items.slice(0, 20).map((item, i) => (
                        <li key={i} className="text-xs text-slate-600 font-mono truncate">
                          {item}
                        </li>
                      ))}
                      {items.length > 20 && (
                        <li className="text-xs text-slate-400 italic">
                          +{items.length - 20} more…
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ToolPage>
  );
}