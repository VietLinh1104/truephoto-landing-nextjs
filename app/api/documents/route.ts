import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      file_name,
      key,
      bucket_name,
      document_url,
      size,
      mine_type,
      status_upload = 'pending',
      id_request_client = null,
      id_deliverables_document = null,
    } = body;

    if (!file_name || !key || !bucket_name || !document_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new document
    const document = await prisma.document.create({
      data: {
        file_name,
        key,
        bucket_name,
        document_url,
        size: size.toString(), // Convert to string for SQLite compatibility
        mine_type,
        status_upload,
        id_request_client: id_request_client || null,
        id_deliverables_document: id_deliverables_document || null,
      },
    });

    return NextResponse.json({
      data: {
        ...document,
        size: typeof document.size === 'string' ? parseInt(document.size) : Number(document.size),
      },
      message: 'Document created successfully',
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        requestClient: {
          select: {
            fullname: true,
            email: true,
          },
        },
        deliverablesDocument: {
          select: {
            customer_name: true,
            client_email: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: documents.map(doc => ({
        ...doc,
        size: typeof doc.size === 'string' ? parseInt(doc.size) : Number(doc.size),
      })),
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

