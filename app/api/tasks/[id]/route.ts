import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { writeAudit } from '@/lib/audit';

const taskUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  completed: z.boolean().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if task exists and belongs to tenant
    const existingTask = await prisma.task.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
    });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = taskUpdateSchema.parse(body);

    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        client: {
          select: { id: true, firstName: true, lastName: true }
        }
      }
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'UPDATE_TASK',
      entityType: 'Task',
      entityId: params.id,
      meta: {
        updatedFields: Object.keys(validatedData),
        previousCompleted: existingTask.completed,
        newCompleted: validatedData.completed,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if task exists and belongs to tenant
    const task = await prisma.task.findFirst({
      where: { id: params.id, tenantId: session.user.tenantId },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'DELETE_TASK',
      entityType: 'Task',
      entityId: params.id,
      meta: {
        taskTitle: task.title,
      },
    });

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
