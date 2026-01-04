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
            created_at: true,
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
        ...deliverable,
        Documents: deliverable.documents.map(doc => ({
          ...doc,
          size: typeof doc.size === 'string' ? parseInt(doc.size) : Number(doc.size),
        })),
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

