import { NextRequest, NextResponse } from 'next/server';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';
import { clientSchema } from '@/lib/validate';
import { writeAudit } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { tenantId } = await getTenantFromSession();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const sortBy = searchParams.get('sortBy') || 'lastName';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const where = {
      tenantId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { wills: true, notes: true, documents: true },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      clients,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId, userId } = await getTenantFromSession();
    const body = await request.json();

    const validation = clientSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const clientData = {
      ...validation.data,
      tenantId,
      lastUpdatedBy: userId,
      dob: validation.data.dob ? new Date(validation.data.dob) : null,
    };

    const client = await prisma.client.create({
      data: clientData,
    });

    await writeAudit({
      tenantId,
      userId,
      event: 'CREATE_CLIENT',
      entityType: 'client',
      entityId: client.id,
      meta: { clientName: `${client.firstName} ${client.lastName}` },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
