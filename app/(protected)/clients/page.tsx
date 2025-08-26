import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreHorizontal } from 'lucide-react';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';

async function getClients(tenantId: string) {
  return prisma.client.findMany({
    where: { tenantId },
    orderBy: { lastName: 'asc' },
    include: {
      _count: {
        select: { wills: true, notes: true, documents: true },
      },
    },
  });
}

export default async function ClientsPage() {
  const { tenantId } = await getTenantFromSession();
  const clients = await getClients(tenantId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <Breadcrumbs items={[{ label: 'Clients' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Clients
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your client relationships and records
            </p>
          </div>
          <Button className="button-base bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="card-glass mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search clients..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="button-base">
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients table */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>All Clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Wills
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Last Updated
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {client.firstName} {client.lastName}
                        </p>
                        {client.phone && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {client.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {client.email || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {client.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {client._count.wills}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {client.updatedAt.toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}