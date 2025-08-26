import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check if we're in production and add a simple auth check
    const authHeader = request.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.NEXTAUTH_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting database seeding...');

    // Check if demo accounts already exist
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@platform.co.uk' }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Demo accounts already exist' });
    }

    // Create tenants
    const alderTenant = await prisma.tenant.create({
      data: {
        name: 'Alder Advisors',
      },
    });

    const birchTenant = await prisma.tenant.create({
      data: {
        name: 'Birch Planning',
      },
    });

    // Create platform admin
    await prisma.user.create({
      data: {
        email: 'admin@platform.co.uk',
        hashedPassword: await bcrypt.hash('admin123', 12),
        role: 'platform_admin',
      },
    });

    // Create broker users
    const alderBroker = await prisma.user.create({
      data: {
        email: 'broker@alder.co.uk',
        hashedPassword: await bcrypt.hash('test1234', 12),
        role: 'broker',
        tenantId: alderTenant.id,
      },
    });

    const birchBroker = await prisma.user.create({
      data: {
        email: 'broker@birch.co.uk',
        hashedPassword: await bcrypt.hash('test1234', 12),
        role: 'broker',
        tenantId: birchTenant.id,
      },
    });

    // Create pricing for tenants
    await prisma.pricing.createMany({
      data: [
        {
          tenantId: alderTenant.id,
          singleWillPrice: 20000,
          mirrorWillPrice: 35000,
          trustWillPrice: 75000,
          revenueSplitBroker: 90,
          revenueSplitPlatform: 10,
        },
        {
          tenantId: birchTenant.id,
          singleWillPrice: 22000,
          mirrorWillPrice: 38000,
          trustWillPrice: 80000,
          revenueSplitBroker: 85,
          revenueSplitPlatform: 15,
        },
      ],
    });

    console.log('Demo accounts created successfully!');
    
    return NextResponse.json({ 
      message: 'Demo accounts created successfully',
      accounts: {
        admin: 'admin@platform.co.uk / admin123',
        broker1: 'broker@alder.co.uk / test1234',
        broker2: 'broker@birch.co.uk / test1234'
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
