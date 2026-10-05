import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { blobEnabled, saveFile, safeFileName } from '@/lib/storage';
import { requireAdmin } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_BYTES = 30 * 1024 * 1024;

/** Tells the admin UI which upload path to use. */
export async function GET() {
  return NextResponse.json({ mode: blobEnabled() ? 'blob' : 'local' });
}

/**
 * - JSON body: Vercel Blob client-upload handshake. Files go straight from the
 *   browser to Blob storage, bypassing Vercel's 4.5 MB request-body limit.
 * - multipart body: local development fallback (no Blob token configured).
 */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const contentType = req.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    try {
      const body = (await req.json()) as HandleUploadBody;
      const result = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        }),
      });
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
  }

  if (blobEnabled() || (process.env.VERCEL && process.env.NODE_ENV === 'production')) {
    return NextResponse.json({ error: 'Direct uploads must use Blob client uploads' }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Unsupported file type or file too large' }, { status: 400 });
  }
  const url = await saveFile(safeFileName(file.name), await file.arrayBuffer(), file.type);
  return NextResponse.json({ url });
}
