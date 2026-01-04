// File: app/api/multipart-upload/[endpoint]/route.ts
import { NextResponse } from 'next/server';
import {
  S3Client,
  UploadPartCommand,
  ListPartsCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Lazy initialization to avoid errors during build
let R2: S3Client | null = null;
let BUCKET: string | null = null;

function getR2Client(): { client: S3Client; bucket: string } {
  if (R2 && BUCKET) {
    return { client: R2, bucket: BUCKET };
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_KEY_ID, R2_BUCKET_NAME } = process.env;
  
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_KEY_ID || !R2_BUCKET_NAME) {
    throw new Error('Missing R2 environment variables');
  }

  R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_KEY_ID,
    },
  });
  BUCKET = R2_BUCKET_NAME;

  return { client: R2, bucket: BUCKET };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await context.params;
  const body = await request.json();

  try {
    const { client: r2Client, bucket: r2Bucket } = getR2Client();

    switch (endpoint) {
      case 'create-multipart-upload': {
        const { file, contentType } = body;
        const filename = file.name;
        const timestamp = Date.now();
        const uniqueKey = `resources/${timestamp}-${filename}`;
        const cmd = new CreateMultipartUploadCommand({
          Bucket: r2Bucket,
          Key: uniqueKey,
          ContentType: contentType,
        });
        const resp = await r2Client.send(cmd);
        return NextResponse.json({ uploadId: resp.UploadId, key: resp.Key });
      }

      case 'prepare-upload-parts': {
        const { partData } = body;
        const { key, uploadId, parts } = partData;
        const presignedUrls: Record<number, string> = {};
        for (const part of parts) {
          const cmd = new UploadPartCommand({ Bucket: r2Bucket, Key: key, PartNumber: part.number, UploadId: uploadId });
          presignedUrls[part.number] = await getSignedUrl(r2Client, cmd, { expiresIn: 3600 });
        }
        return NextResponse.json({ presignedUrls });
      }

      case 'list-parts': {
        const { key, uploadId } = body;
        const cmd = new ListPartsCommand({ Bucket: r2Bucket, Key: key, UploadId: uploadId });
        const resp = await r2Client.send(cmd);
        return NextResponse.json(resp.Parts || []);
      }

      case 'complete-multipart-upload': {
        const { key, uploadId, parts } = body;
        const cmd = new CompleteMultipartUploadCommand({
          Bucket: r2Bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts },
        });
        const resp = await r2Client.send(cmd);
        return NextResponse.json(resp);
      }

      case 'abort-multipart-upload': {
        const { key, uploadId } = body;
        const cmd = new AbortMultipartUploadCommand({ Bucket: r2Bucket, Key: key, UploadId: uploadId });
        const resp = await r2Client.send(cmd);
        return NextResponse.json(resp);
      }

      case 'sign-part': {
        const { key, uploadId, partNumber } = body;
        const cmd = new UploadPartCommand({ Bucket: r2Bucket, Key: key, PartNumber: Number(partNumber), UploadId: uploadId });
        const url = await getSignedUrl(r2Client, cmd, { expiresIn: 3600 });
        return NextResponse.json({ url });
      }

      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
