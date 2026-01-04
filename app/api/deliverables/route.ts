import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      customer_name,
      client_email,
      file_description,
    } = body;

    if (!customer_name || !client_email || !file_description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new deliverable
    const deliverable = await prisma.deliverablesDocument.create({
      data: {
        customer_name,
        client_email,
        file_description,
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json({
      data: deliverable,
      message: 'Deliverable created successfully',
    });
  } catch (error) {
    console.error('Error creating deliverable:', error);
    return NextResponse.json(
      { error: 'Failed to create deliverable' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const deliverables = await prisma.deliverablesDocument.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        documents: {
          select: {
            id_document: true,
            file_name: true,
            document_url: true,
            size: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: deliverables,
    });
  } catch (error) {
    console.error('Error fetching deliverables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliverables' },
      { status: 500 }
    );
  }
}

