import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const document = await prisma.document.findUnique({
      where: { id_document: id },
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

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        ...document,
        size: typeof document.size === 'string' ? parseInt(document.size) : Number(document.size),
      },
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.document.delete({
      where: { id_document: id },
    });

    return NextResponse.json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}

