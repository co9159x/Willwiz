import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DebugPage() {
  try {
    // Test database connection first
    await prisma.$connect();
    
    const users = await prisma.user.findMany({
      include: { tenant: true },
    });

    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: { users: true, clients: true, wills: true },
        },
      },
    });

    await prisma.$disconnect();

    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">Database Debug View</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="p-3 border rounded">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Tenant:</strong> {user.tenant?.name || 'No tenant'}</p>
                  <p><strong>Created:</strong> {user.createdAt.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenants ({tenants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="p-3 border rounded">
                  <p><strong>Name:</strong> {tenant.name}</p>
                  <p><strong>Users:</strong> {tenant._count.users}</p>
                  <p><strong>Clients:</strong> {tenant._count.clients}</p>
                  <p><strong>Wills:</strong> {tenant._count.wills}</p>
                  <p><strong>Created:</strong> {tenant.createdAt.toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error('Debug page error:', error);
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Database Error</h1>
        <pre className="mt-4 p-4 bg-red-50 border rounded overflow-auto">
          {error instanceof Error ? error.message : 'Unknown error'}
          {'\n\nStack trace:\n'}
          {error instanceof Error ? error.stack : 'No stack trace available'}
        </pre>
      </div>
    );
  }
}
