"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { callPdfApiSingle } from "@/app/lib/api";
import { downloadBlob } from "@/app/lib/download";
import ToolPage from "@/components/ToolPage";
import { FileInput, SubmitButton, FormMessage, Select } from "@/components/ToolForm";

const ANGLES = [
  { value: "90", label: "90° clockwise" },
  { value: "180", label: "180° (upside down)" },
  { value: "270", label: "270° (90° counter-clockwise)" },
];

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [angle, setAngle] = useState("90");
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
      const blob = await callPdfApiSingle("/api/pdf/rotate", files[0], { angle });
      downloadBlob(blob, "rotated.pdf");
      setMessage("✅ Downloaded rotated.pdf");
    } catch (e: any) {
      setMessage("❌ " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPage
      title="Rotate PDF"
      description="Rotate all pages by 90°, 180°, or 270°"
      icon={RotateCw}
      color="blue"
    >
      <FileInput files={files} onChange={setFiles} accept="application/pdf" label="Choose a PDF" />
      <Select label="Rotation angle" value={angle} onChange={setAngle} options={ANGLES} />
      <SubmitButton loading={loading} onClick={run} label="Rotate PDF" loadingLabel="Rotating…" />
      <FormMessage message={message} />
    </ToolPage>
  );
}