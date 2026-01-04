import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const deliverable = await prisma.deliverablesDocument.findUnique({
      where: { id_deliverables_document: id },
      include: {
        documents: {
          select: {
            id_document: true,
            file_name: true,
            document_url: true,
            size: true,
            mine_type: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!deliverable) {
      return NextResponse.json(
        { error: 'Deliverable not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id_deliverables_document: deliverable.id_deliverables_document,
        customer_name: deliverable.customer_name,
        client_email: deliverable.client_email,
        file_description: deliverable.file_description,
        created_at: deliverable.createdAt.toISOString(),
        updated_at: deliverable.updatedAt.toISOString(),
        Documents: deliverable.documents.map(doc => ({
          id_document: doc.id_document,
          file_name: doc.file_name,
          document_url: doc.document_url,
          size: typeof doc.size === 'string' ? doc.size : String(doc.size),
          mine_type: doc.mine_type,
          created_at: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
          updated_at: doc.updatedAt ? doc.updatedAt.toISOString() : new Date().toISOString(),
        })),
        User: null, // Not used in current schema
      },
    });
  } catch (error) {
    console.error('Error fetching deliverable:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliverable' },
      { status: 500 }
    );
  }
}

