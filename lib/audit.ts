import { prisma } from './db';

export async function writeAudit({
  tenantId,
  userId,
  event,
  entityType,
  entityId,
  meta,
}: {
  tenantId: string;
  userId?: string;
  event: string;
  entityType: string;
  entityId?: string;
  meta?: any;
}) {
  await prisma.auditLog.create({
    data: {
      tenantId,
      userId,
      event,
      entityType,
      entityId,
      meta,
    },
  });
}