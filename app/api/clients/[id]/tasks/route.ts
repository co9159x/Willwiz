import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { taskSchema } from '@/lib/validate';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify client belongs to tenant
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        clientId: params.id,
        tenantId: session.user.tenantId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify client belongs to tenant
    const client = await prisma.client.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        clientId: params.id,
        tenantId: session.user.tenantId,
        createdBy: session.user.id,
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'CREATE_TASK',
      entityType: 'Task',
      entityId: task.id,
      meta: { clientId: params.id },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
