import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { writeAudit } from '@/lib/audit';
import * as bcrypt from 'bcryptjs';

const createBrokerSchema = z.object({
  tenantName: z.string().min(1, 'Tenant name is required'),
  brokerEmail: z.string().email('Invalid email address'),
  brokerPassword: z.string().min(6, 'Password must be at least 6 characters'),
  brokerFirstName: z.string().min(1, 'First name is required'),
  brokerLastName: z.string().min(1, 'Last name is required'),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({
        include: {
          users: {
            where: { role: { in: ['broker', 'broker_admin'] } },
            select: { id: true, email: true, role: true, lastLoginAt: true }
          },
          _count: {
            select: { clients: true, wills: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.tenant.count(),
    ]);

    return NextResponse.json({
      tenants,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get brokers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createBrokerSchema.parse(body);

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: validatedData.tenantName,
      },
    });

    // Create broker user
    const hashedPassword = await bcrypt.hash(validatedData.brokerPassword, 12);
    const broker = await prisma.user.create({
      data: {
        email: validatedData.brokerEmail,
        hashedPassword,
        role: 'broker',
        tenantId: tenant.id,
      },
    });

    // Create default pricing for the tenant
    await prisma.pricing.create({
      data: {
        tenantId: tenant.id,
        singleWillPrice: 20000,
        mirrorWillPrice: 35000,
        trustWillPrice: 75000,
        revenueSplitBroker: 90,
        revenueSplitPlatform: 10,
      },
    });

    // Log audit event
    await writeAudit({
      tenantId: 'platform',
      userId: session.user.id,
      event: 'CREATE_BROKER',
      entityType: 'Tenant',
      entityId: tenant.id,
      meta: {
        tenantName: validatedData.tenantName,
        brokerEmail: validatedData.brokerEmail,
      },
    });

    return NextResponse.json({
      tenant,
      broker: {
        id: broker.id,
        email: broker.email,
        role: broker.role,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create broker error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
