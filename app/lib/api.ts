import { supabase } from "./supabase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not authenticated");
  return { Authorization: `Bearer ${token}` };
}

export async function callPdfApi(
  endpoint: string,
  files: File[]
): Promise<Blob> {
  const headers = await authHeaders();
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.blob();
}

export async function callPdfApiSingle(
  endpoint: string,
  file: File,
  extraFields?: Record<string, string>
): Promise<Blob> {
  const headers = await authHeaders();
  const form = new FormData();
  form.append("file", file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
  }
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.blob();
}

export async function listFiles() {
  const headers = await authHeaders();
  const res = await fetch(`${API}/api/files`, { headers });
  if (!res.ok) throw new Error("Failed to load files");
  return res.json();
}

export async function uploadFile(file: File) {
  const headers = await authHeaders();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/api/files/upload`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function getDownloadUrl(fileId: string) {
  const headers = await authHeaders();
  const res = await fetch(`${API}/api/files/${fileId}/download`, { headers });
  if (!res.ok) throw new Error("Download failed");
  return res.json();
}

export async function deleteFile(fileId: string) {
  const headers = await authHeaders();
  const res = await fetch(`${API}/api/files/${fileId}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}
export async function callConvertApi(
  endpoint: string,
  files: File[],
  fieldName: string = "files",
  extraFields?: Record<string, string>
): Promise<Blob> {
  const headers = await authHeaders();
  const form = new FormData();
  files.forEach((f) => form.append(fieldName, f));
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
  }
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  return res.blob();
}
export async function postFile(
  endpoint: string,
  file: File,
  extraFields?: Record<string, string>
): Promise<any> {
  const headers = await authHeaders();
  const form = new FormData();
  form.append("file", file);
  if (extraFields) {
    Object.entries(extraFields).forEach(([k, v]) => form.append(k, v));
  }
  const res = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Request failed");
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.blob();
}