import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the will exists and belongs to the user's tenant
    const will = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    // Check if the will is in draft status
    if (will.status !== 'draft') {
      return NextResponse.json({ 
        error: 'Will must be in draft status to send for approval' 
      }, { status: 400 });
    }

    // Check if the will has the minimum required data
    if (!will.jsonPayload || !will.draftMarkdown) {
      return NextResponse.json({ 
        error: 'Will must have complete data before sending for approval' 
      }, { status: 400 });
    }

    // Update the will status to sent_for_approval
    const updatedWill = await prisma.will.update({
      where: { id: params.id },
      data: {
        status: 'sent_for_approval',
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Will sent for approval successfully',
      will: updatedWill,
    });
  } catch (error) {
    console.error('Error sending will for approval:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
