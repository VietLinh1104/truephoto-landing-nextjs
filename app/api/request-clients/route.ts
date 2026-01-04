import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullname, 
      email, 
      phone_number, 
      address, 
      processing_request_details,
      request_status = 'pending',
      id_user = null,
    } = body;

    if (!fullname || !email || !phone_number || !address || !processing_request_details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new request client
    const requestClient = await prisma.requestClient.create({
      data: {
        fullname,
        email,
        phone_number,
        address,
        processing_request_details,
        request_status,
        id_user: id_user || null,
      },
    });

    return NextResponse.json({
      data: requestClient,
      id_request_client: requestClient.id_request_client, // For backward compatibility
      message: 'Request client created successfully',
    });
  } catch (error) {
    console.error('Error creating request client:', error);
    return NextResponse.json(
      { error: 'Failed to create request client' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requestClients = await prisma.requestClient.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: requestClients,
    });
  } catch (error) {
    console.error('Error fetching request clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch request clients' },
      { status: 500 }
    );
  }
}

