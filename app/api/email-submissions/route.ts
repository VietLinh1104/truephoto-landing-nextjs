import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_email } = body;

    if (!client_email || !client_email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.emailSubmission.findFirst({
      where: { client_email },
    });

    if (existing) {
      return NextResponse.json(
        { 
          data: existing,
          message: 'Email already subscribed',
        },
        { status: 200 }
      );
    }

    // Create new email submission
    const emailSubmission = await prisma.emailSubmission.create({
      data: {
        client_email,
      },
    });

    return NextResponse.json({
      data: emailSubmission,
      message: 'Email submitted successfully',
    });
  } catch (error) {
    console.error('Error creating email submission:', error);
    return NextResponse.json(
      { error: 'Failed to create email submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const emailSubmissions = await prisma.emailSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: emailSubmissions,
    });
  } catch (error) {
    console.error('Error fetching email submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email submissions' },
      { status: 500 }
    );
  }
}

