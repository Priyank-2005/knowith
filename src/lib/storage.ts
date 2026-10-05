import fs from 'fs/promises';
import path from 'path';
import { put, del } from '@vercel/blob';

// ────────────────────────────────────────────────────────────────
// File storage for uploads (insight PDFs, cover images, figures).
//
// Production (Vercel): Vercel Blob — the deployment filesystem is read-only,
// so files written to public/ at runtime are lost. Requires a Blob store
// connected to the project (sets BLOB_READ_WRITE_TOKEN).
// Local dev without a token: falls back to public/uploads.
// ────────────────────────────────────────────────────────────────

export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const LOCAL_DIR = path.join(process.cwd(), 'public', 'uploads');

export function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(-120);
}

export async function saveFile(pathname: string, data: Buffer | ArrayBuffer, contentType: string): Promise<string> {
  const body = Buffer.isBuffer(data) ? data : Buffer.from(data);

  if (blobEnabled()) {
    const blob = await put(pathname, body, { access: 'public', contentType, addRandomSuffix: true });
    return blob.url;
  }
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    throw new Error('File storage is not configured. Connect a Vercel Blob store to this project (BLOB_READ_WRITE_TOKEN).');
  }

  const fileName = `${Date.now()}-${safeFileName(pathname.replace(/\//g, '-'))}`;
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(path.join(LOCAL_DIR, fileName), body);
  return `/uploads/${fileName}`;
}

/** True only for files held in our own storage (guards server-side fetches). */
export function isStoredFileUrl(url: string): boolean {
  if (/^\/uploads\/[^/]+$/.test(url)) return true;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

/** Reads a stored file back (Vercel Blob URL or local /uploads path). */
export async function readFile(url: string): Promise<Buffer> {
  if (!isStoredFileUrl(url)) throw new Error('File is not in this site\'s storage');
  if (url.startsWith('/uploads/')) {
    return fs.readFile(path.join(LOCAL_DIR, path.basename(url)));
  }
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Could not download ${url} (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

/** Best-effort delete; never throws. */
export async function deleteFiles(urls: (string | null | undefined)[]): Promise<void> {
  for (const url of urls) {
    if (!url) continue;
    try {
      if (url.startsWith('/uploads/')) {
        await fs.unlink(path.join(LOCAL_DIR, path.basename(url)));
      } else if (blobEnabled() && url.includes('.blob.vercel-storage.com')) {
        await del(url);
      }
    } catch {
      // already gone
    }
  }
}
