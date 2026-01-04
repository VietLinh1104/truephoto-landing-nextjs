import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.emailSubmission.delete({
      where: { id_email_submission: id },
    });

    return NextResponse.json({
      message: 'Email submission deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting email submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete email submission' },
      { status: 500 }
    );
  }
}

