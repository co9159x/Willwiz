import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Plus, User } from 'lucide-react';
import Link from 'next/link';

export default async function NewWillPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Get all active clients for the user's tenant
  const clients = await prisma.client.findMany({
    where: {
      tenantId: session.user.tenantId,
      status: 'active',
    },
    orderBy: {
      firstName: 'asc',
    },
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Clients', href: '/clients' },
          { label: 'New Will', href: '#' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Will</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select a client to start creating their will
          </p>
        </div>
      </div>

      {clients.length === 0 ? (
        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Clients Found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                You need to create a client before you can create a will.
              </p>
              <Link href="/clients">
                <Button className="button-base">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Client
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="card-glass hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {client.firstName} {client.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p><strong>Email:</strong> {client.email || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {client.phone || 'Not provided'}</p>
                  {client.dob && (
                    <p><strong>Date of Birth:</strong> {new Date(client.dob).toLocaleDateString('en-GB')}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link href={`/wills/new?clientId=${client.id}`} className="flex-1">
                    <Button className="w-full button-base">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Will
                    </Button>
                  </Link>
                  <Link href={`/clients/${client.id}`}>
                    <Button variant="outline" size="sm">
                      View Client
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
