import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

import { prisma } from '@/lib/db';
import { writeAudit } from '@/lib/audit';
import { pricingSchema } from '@/lib/validate';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pricing = await prisma.pricing.findUnique({
      where: { tenantId: session.user.tenantId },
    });

    if (!pricing) {
      // Create default pricing if none exists
      const defaultPricing = await prisma.pricing.create({
        data: {
          tenantId: session.user.tenantId,
          singleWillPrice: 20000,
          mirrorWillPrice: 35000,
          trustWillPrice: 75000,
          revenueSplitBroker: 90,
          revenueSplitPlatform: 10,
        },
      });
      return NextResponse.json(defaultPricing);
    }

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = pricingSchema.parse(body);

    const pricing = await prisma.pricing.upsert({
      where: { tenantId: session.user.tenantId },
      update: validatedData,
      create: {
        ...validatedData,
        tenantId: session.user.tenantId,
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'UPDATE_PRICING',
      entityType: 'Pricing',
      entityId: pricing.tenantId,
      meta: { updatedFields: Object.keys(validatedData) },
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error updating pricing:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
