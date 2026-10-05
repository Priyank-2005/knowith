'use client';

import { upload } from '@vercel/blob/client';

let modePromise: Promise<'blob' | 'local'> | null = null;

/**
 * Uploads a file from the browser and returns its public URL.
 * Uses Vercel Blob client uploads in production (no 4.5 MB body limit)
 * and a plain multipart POST in local development.
 */
export async function uploadFile(file: File, folder = 'uploads'): Promise<string> {
  modePromise ??= fetch('/api/v1/uploads').then(r => r.json()).then(d => d.mode);
  const mode = await modePromise;

  if (mode === 'blob') {
    const name = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blob = await upload(`${folder}/${name}`, file, {
      access: 'public',
      handleUploadUrl: '/api/v1/uploads',
      multipart: file.size > 5 * 1024 * 1024,
    });
    return blob.url;
  }

  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/v1/uploads', { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json.url;
}
