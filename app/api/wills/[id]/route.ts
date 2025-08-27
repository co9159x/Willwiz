import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateWillSchema = z.object({
  jsonPayload: z.record(z.any()).optional(),
  draftMarkdown: z.string().optional(),
  version: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const will = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
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

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    return NextResponse.json(will);
  } catch (error) {
    console.error('Error fetching will:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData = updateWillSchema.parse(body);

    // Verify the will exists and belongs to the user's tenant
    const existingWill = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!existingWill) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    // Update the will
    const updatedWill = await prisma.will.update({
      where: {
        id: params.id,
      },
      data: {
        ...updateData,
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

    return NextResponse.json(updatedWill);
  } catch (error) {
    console.error('Error updating will:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the will exists and belongs to the user's tenant
    const existingWill = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!existingWill) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    // Only allow deletion of draft wills
    if (existingWill.status !== 'draft') {
      return NextResponse.json({ error: 'Only draft wills can be deleted' }, { status: 400 });
    }

    // Delete the will
    await prisma.will.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Will deleted successfully' });
  } catch (error) {
    console.error('Error deleting will:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
