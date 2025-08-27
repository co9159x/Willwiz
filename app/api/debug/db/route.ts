import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        tenant: true,
      },
    });

    // Get all tenants
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            clients: true,
            wills: true,
          },
        },
      },
    });

    // Get all clients
    const clients = await prisma.client.findMany({
      include: {
        tenant: true,
        _count: {
          select: {
            wills: true,
          },
        },
      },
      take: 10, // Limit to first 10
    });

    // Get all wills
    const wills = await prisma.will.findMany({
      include: {
        tenant: true,
        client: true,
      },
      take: 10, // Limit to first 10
    });

    return NextResponse.json({
      success: true,
      data: {
        users: {
          count: users.length,
          data: users,
        },
        tenants: {
          count: tenants.length,
          data: tenants,
        },
        clients: {
          count: clients.length,
          data: clients,
        },
        wills: {
          count: wills.length,
          data: wills,
        },
      },
    });
  } catch (error) {
    console.error('Database debug error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
