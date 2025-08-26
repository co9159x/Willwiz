import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { noteSchema } from '@/lib/validate';

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

    const notes = await prisma.note.findMany({
      where: {
        clientId: params.id,
        tenantId: session.user.tenantId,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
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
    const validatedData = noteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        body: validatedData.content,
        clientId: params.id,
        tenantId: session.user.tenantId,
        authorId: session.user.id,
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'CREATE_NOTE',
      entityType: 'Note',
      entityId: note.id,
      meta: { clientId: params.id },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
