import { NextResponse } from 'next/server';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const { tenantId } = await getTenantFromSession();

    const [clientCount, willCount, signedWillCount, pricing] = await Promise.all([
      prisma.client.count({ where: { tenantId, status: 'active' } }),
      prisma.will.count({ where: { tenantId } }),
      prisma.will.count({ where: { tenantId, status: 'signed' } }),
      prisma.pricing.findUnique({ where: { tenantId } }),
    ]);

    const monthlyRevenue = signedWillCount * ((pricing?.singleWillPrice || 200) / 100);

    return NextResponse.json({
      clientCount,
      willCount,
      signedWillCount,
      monthlyRevenue,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    );
  }
}
