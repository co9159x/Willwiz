import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { willUpdateSchema } from '@/lib/validate';

export async function GET(
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
      include: {
        client: {
          select: {
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
    const validatedData = willUpdateSchema.parse(body);

    const will = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    // Determine if this is a material change that should bump version
    const isMaterialChange = 
      JSON.stringify(validatedData.jsonPayload) !== JSON.stringify(will.jsonPayload) ||
      validatedData.draftMarkdown !== will.draftMarkdown;

    const updatedWill = await prisma.will.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        version: isMaterialChange ? will.version + 1 : will.version,
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
      event: 'UPDATE_WILL',
      entityType: 'Will',
      entityId: params.id,
      meta: { 
        version: updatedWill.version,
        isMaterialChange,
        updatedFields: Object.keys(validatedData),
      },
    });

    return NextResponse.json(updatedWill);
  } catch (error) {
    console.error('Error updating will:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
