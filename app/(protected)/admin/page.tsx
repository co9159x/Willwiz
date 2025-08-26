import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MoreHorizontal } from 'lucide-react';
import { requireRole } from '@/lib/rbac';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';
// Role enum is not available in SQLite, using string literals instead

async function getTenants() {
  return prisma.tenant.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { users: true, clients: true, wills: true },
      },
    },
  });
}

async function getAuditLogs() {
  return prisma.auditLog.findMany({
    orderBy: { occurredAt: 'desc' },
    take: 50,
    include: {
      tenant: {
        select: { name: true },
      },
    },
  });
}

export default async function AdminPage() {
  const { role } = await getTenantFromSession();
  requireRole(role as string, 'platform_admin');

  const [tenants, auditLogs] = await Promise.all([
    getTenants(),
    getAuditLogs(),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <Breadcrumbs items={[{ label: 'Administration' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Platform Administration
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage brokers, tenants, and system audit logs
            </p>
          </div>
          <Button className="button-base bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Broker
          </Button>
        </div>
      </div>

      <Tabs defaultValue="brokers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brokers">Brokers</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="brokers">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Broker Tenants ({tenants.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Broker Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Users
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Clients
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Wills
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((tenant) => (
                      <tr
                        key={tenant.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {tenant.name}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {tenant._count.users}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {tenant._count.clients}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {tenant._count.wills}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {tenant.createdAt.toLocaleDateString('en-GB')}
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
        </TabsContent>

        <TabsContent value="audit">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Audit Trail (Last 50 events)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Event
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Tenant
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Entity
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                        Occurred At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {log.event.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {log.tenant.name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {log.entityType}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {log.occurredAt.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}