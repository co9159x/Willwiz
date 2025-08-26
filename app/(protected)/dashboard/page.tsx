import { KpiCard } from '@/components/ui/kpi-card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, DollarSign } from 'lucide-react';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';

async function getDashboardData(tenantId: string) {
  const [clientCount, willCount, signedWillCount, pricing] = await Promise.all([
    prisma.client.count({ where: { tenantId, status: 'active' } }),
    prisma.will.count({ where: { tenantId } }),
    prisma.will.count({ where: { tenantId, status: 'signed' } }),
    prisma.pricing.findUnique({ where: { tenantId } }),
  ]);

  // Calculate monthly revenue (simplified)
  const monthlyRevenue = signedWillCount * (pricing?.singleWillPrice || 200) / 100;

  return {
    clientCount,
    willCount,
    signedWillCount,
    monthlyRevenue,
  };
}

async function getRecentActivity(tenantId: string) {
  return prisma.auditLog.findMany({
    where: { tenantId },
    orderBy: { occurredAt: 'desc' },
    take: 10,
  });
}

export default async function DashboardPage() {
  const { tenantId } = await getTenantFromSession();
  const data = await getDashboardData(tenantId);
  const recentActivity = await getRecentActivity(tenantId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's an overview of your practice.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KpiCard
          title="Active Clients"
          value={data.clientCount}
          description="Total active clients"
          icon={Users}
        />
        <KpiCard
          title="Will Drafts"
          value={data.willCount}
          description="All will drafts created"
          icon={FileText}
        />
        <KpiCard
          title="Signed Wills"
          value={data.signedWillCount}
          description="Completed attestations"
          icon={CheckCircle}
        />
        <KpiCard
          title="Monthly Revenue"
          value={`£${data.monthlyRevenue.toLocaleString()}`}
          description="Revenue this month"
          icon={DollarSign}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {activity.event.replace('_', ' ').toLowerCase()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.occurredAt.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/clients?new=true"
              className="button-base bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center font-medium transition-colors"
            >
              Add New Client
            </a>
            <a
              href="/wills/new"
              className="button-base bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center font-medium transition-colors"
            >
              Start New Will
            </a>
            <a
              href="/storage"
              className="button-base border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 inline-flex items-center justify-center font-medium transition-colors"
            >
              View Documents
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}