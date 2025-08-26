import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { willCreateSchema } from '@/lib/validate';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = willCreateSchema.parse(body);

    // Verify client belongs to tenant
    const client = await prisma.client.findFirst({
      where: {
        id: validatedData.clientId,
        tenantId: session.user.tenantId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const will = await prisma.will.create({
      data: {
        clientId: validatedData.clientId,
        jsonPayload: validatedData.jsonPayload ? JSON.stringify(validatedData.jsonPayload) : '{}',
        draftMarkdown: validatedData.draftMarkdown || '',
        tenantId: session.user.tenantId,
        status: 'draft',
        version: 1,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'CREATE_WILL',
      entityType: 'Will',
      entityId: will.id,
      meta: { clientId: validatedData.clientId },
    });

    return NextResponse.json(will, { status: 201 });
  } catch (error) {
    console.error('Error creating will:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
