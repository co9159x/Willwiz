import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'platform_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const event = searchParams.get('event');
    const tenantId = searchParams.get('tenantId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const where: any = {};
    
    if (event) {
      where.event = event;
    }
    
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    if (startDate || endDate) {
      where.occurredAt = {};
      if (startDate) {
        where.occurredAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.occurredAt.lte = new Date(endDate);
      }
    }

    const [auditLogs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          tenant: {
            select: { name: true }
          }
        },
        orderBy: { occurredAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Get unique events for filtering
    const events = await prisma.auditLog.findMany({
      select: { event: true },
      distinct: ['event'],
      orderBy: { event: 'asc' },
    });

    // Get unique tenants for filtering
    const tenants = await prisma.tenant.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      auditLogs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      filters: {
        events: events.map(e => e.event),
        tenants,
      },
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
