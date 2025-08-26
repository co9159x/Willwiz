import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { taskSchema } from '@/lib/validate';
import { writeAudit } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const clientId = searchParams.get('clientId');

    // Build where clause
    const where: any = { tenantId: session.user.tenantId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (clientId) where.clientId = clientId;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          client: {
            select: { id: true, firstName: true, lastName: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    // Verify client belongs to tenant
    const client = await prisma.client.findFirst({
      where: { id: validatedData.clientId, tenantId: session.user.tenantId },
    });

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        tenantId: session.user.tenantId,
        createdBy: session.user.id,
      },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'CREATE_TASK',
      entityType: 'Task',
      entityId: task.id,
      meta: {
        clientId: validatedData.clientId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
