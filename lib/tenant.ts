import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getTenantFromSession() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.tenantId) {
    redirect('/login');
  }

  return {
    tenantId: session.user.tenantId,
    userId: session.user.id,
    role: session.user.role,
  };
}

export function assertTenantAccess(recordTenantId: string, sessionTenantId: string) {
  if (recordTenantId !== sessionTenantId) {
    throw new Error('Tenant access denied');
  }
}