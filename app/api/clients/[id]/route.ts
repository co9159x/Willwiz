import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { clientUpdateSchema } from '@/lib/validate';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
      include: {
        wills: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            wills: true,
            notes: true,
            documents: true,
            tasks: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = clientUpdateSchema.parse(body);

    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        lastUpdatedBy: session.user.id,
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'UPDATE_CLIENT',
      entityType: 'Client',
      entityId: params.id,
      meta: { updatedFields: Object.keys(validatedData) },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
