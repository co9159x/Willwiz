import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const will = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    if (will.status !== 'draft') {
      return NextResponse.json(
        { error: 'Will must be in draft status to send for approval' },
        { status: 400 }
      );
    }

    const updatedWill = await prisma.will.update({
      where: { id: params.id },
      data: {
        status: 'sent_for_approval',
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'SEND_FOR_APPROVAL',
      entityType: 'Will',
      entityId: params.id,
      meta: { previousStatus: will.status },
    });

    return NextResponse.json(updatedWill);
  } catch (error) {
    console.error('Error sending for approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
