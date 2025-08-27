import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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
  await prisma.user.upsert({
    where: { email: 'admin@platform.co.uk' },
    update: {},
    create: {
      email: 'admin@platform.co.uk',
      hashedPassword: await bcrypt.hash('admin123', 12),
      role: 'platform_admin',
    },
  });

  // Create broker users
  const alderBroker = await prisma.user.upsert({
    where: { email: 'broker@alder.co.uk' },
    update: {},
    create: {
      email: 'broker@alder.co.uk',
      hashedPassword: await bcrypt.hash('test1234', 12),
      role: 'broker',
      tenantId: alderTenant.id,
    },
  });

  const birchBroker = await prisma.user.upsert({
    where: { email: 'broker@birch.co.uk' },
    update: {},
    create: {
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

  // Create sample clients for Alder
  const alderClient1 = await prisma.client.create({
    data: {
      tenantId: alderTenant.id,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '+44 20 7123 4567',
      addressLine1: '123 High Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      dob: new Date('1975-06-15'),
      lastUpdatedBy: alderBroker.id,
    },
  });

  const alderClient2 = await prisma.client.create({
    data: {
      tenantId: alderTenant.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+44 161 123 4567',
      addressLine1: '456 Oak Avenue',
      city: 'Manchester',
      postcode: 'M1 1AA',
      dob: new Date('1982-03-22'),
      lastUpdatedBy: alderBroker.id,
    },
  });

  // Create sample clients for Birch
  const birchClient = await prisma.client.create({
    data: {
      tenantId: birchTenant.id,
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@example.com',
      phone: '+44 121 123 4567',
      addressLine1: '789 Elm Road',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      dob: new Date('1970-09-10'),
      lastUpdatedBy: birchBroker.id,
    },
  });

  // Create a signed will for John Smith
  const willPayload = {
    personalInfo: {
      fullName: 'John Smith',
      address: '123 High Street, London, SW1A 1AA',
      dob: '15th June 1975',
    },
    executors: [
      {
        name: 'Sarah Smith',
        address: '123 High Street, London, SW1A 1AA',
        relationship: 'Wife',
      },
    ],
    beneficiaries: [
      {
        name: 'Sarah Smith',
        share: 100,
        relationship: 'Wife',
      },
    ],
    guardianship: {
      hasMinorChildren: false,
    },
    residue: {
      distribution: 'To surviving spouse',
      specificBequests: [],
    },
  };

  const signedWill = await prisma.will.create({
    data: {
      tenantId: alderTenant.id,
      clientId: alderClient1.id,
      status: 'signed',
      jsonPayload: JSON.stringify(willPayload),
      draftMarkdown: 'Last Will and Testament of John Smith...',
      signedPdfUrl: 'fake-signed-url-12345',
      checksumSha256: 'abc123def456789',
      lockAt: new Date(),
    },
  });

  // Create notes and tasks
  await prisma.note.createMany({
    data: [
      {
        tenantId: alderTenant.id,
        clientId: alderClient1.id,
        body: 'Initial consultation completed. Client wishes to leave everything to spouse.',
        authorId: alderBroker.id,
      },
      {
        tenantId: alderTenant.id,
        clientId: alderClient2.id,
        body: 'Client requires mirror will for both spouses. Complex estate planning needed.',
        authorId: alderBroker.id,
      },
    ],
  });

  await prisma.task.createMany({
    data: [
      {
        tenantId: alderTenant.id,
        clientId: alderClient1.id,
        title: 'Collect witness signatures',
        completed: true,
        completedAt: new Date(),
        createdBy: alderBroker.id,
      },
      {
        tenantId: alderTenant.id,
        clientId: alderClient2.id,
        title: 'Schedule consultation for spouse',
        completed: false,
        createdBy: alderBroker.id,
      },
    ],
  });

  // Create audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        tenantId: alderTenant.id,
        userId: alderBroker.id,
        event: 'CREATE_CLIENT',
        entityType: 'client',
        entityId: alderClient1.id,
        meta: JSON.stringify({ clientName: 'John Smith' }),
      },
      {
        tenantId: alderTenant.id,
        userId: alderBroker.id,
        event: 'ATTEST_LOCKED',
        entityType: 'will',
        entityId: signedWill.id,
        meta: JSON.stringify({ clientName: 'John Smith', willId: signedWill.id }),
      },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('Login credentials:');
  console.log('Platform Admin: admin@platform.co.uk / admin123');
  console.log('Alder Broker: broker@alder.co.uk / test1234');
  console.log('Birch Broker: broker@birch.co.uk / test1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });