import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { WillWizard } from '@/components/wizard/WillWizard';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface WillWizardPageProps {
  params: {
    id: string;
  };
}

export default async function WillWizardPage({ params }: WillWizardPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Get the will data
  const will = await prisma.will.findUnique({
    where: { id: params.id },
    include: {
      client: true,
    },
  });

  if (!will) {
    redirect('/clients');
  }

  // Check if user has access to this will (tenant isolation)
  if (will.tenantId !== session.user.tenantId && session.user.role !== 'platform_admin') {
    redirect('/clients');
  }

  // Parse existing will data if available
  let initialData = {};
  if (will.jsonPayload) {
    try {
      initialData = will.jsonPayload as any;
    } catch (error) {
      console.error('Error parsing will data:', error);
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: will.client.firstName + ' ' + will.client.lastName, href: `/clients/${will.clientId}` },
          { label: 'Will Wizard', href: '#' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Will Wizard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Creating will for {will.client.firstName} {will.client.lastName}
          </p>
        </div>
      </div>

      <WillWizard
        clientId={will.clientId}
        willId={will.id}
        initialData={initialData}
      />
    </div>
  );
}
