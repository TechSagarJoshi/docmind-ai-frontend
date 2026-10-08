"use client";

import { Upload } from "lucide-react";

/* ---------- File Input ---------- */

type FileInputProps = {
  onChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  files?: File[];
  label?: string;
};

export function FileInput({
  onChange,
  multiple = false,
  accept,
  files = [],
  label = "Choose files",
}: FileInputProps) {
  return (
    <div>
      <label className="block cursor-pointer">
        <div className="border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-2xl p-8 text-center transition-all duration-200 group">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-100 items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <div className="font-medium text-slate-900 mb-1">{label}</div>
          <div className="text-sm text-slate-500">
            Click to select or drag and drop
          </div>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => onChange(Array.from(e.target.files || []))}
            className="hidden"
          />
        </div>
      </label>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              {f.name}
              <span className="ml-auto text-xs text-slate-400">
                {(f.size / 1024).toFixed(1)} KB
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Submit Button ---------- */

type SubmitButtonProps = {
  loading: boolean;
  onClick: () => void;
  label: string;
  loadingLabel?: string;
};

export function SubmitButton({
  loading,
  onClick,
  label,
  loadingLabel = "Processing…",
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 btn-primary transition-all"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

/* ---------- Message ---------- */

export function FormMessage({ message }: { message: string }) {
  if (!message) return null;
  const isSuccess = message.startsWith("✅");
  const isError = message.startsWith("❌");

  return (
    <div
      className={`text-sm text-center py-3 px-4 rounded-xl border ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-800"
          : isError
          ? "bg-red-50 border-red-200 text-red-800"
          : "bg-slate-50 border-slate-200 text-slate-700"
      }`}
    >
      {message}
    </div>
  );
}

/* ---------- Select ---------- */

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
};

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------- Text Input ---------- */

type TextInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
    </label>
  );
}

/* ---------- Range Slider ---------- */

type RangeProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
};

export function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "",
  hint,
}: RangeProps) {
  return (
    <label className="block">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-slate-900"
      />
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </label>
  );
}