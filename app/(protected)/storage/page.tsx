import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Eye, Filter } from 'lucide-react';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';

async function getDocuments(tenantId: string) {
  return prisma.document.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

function getKindColor(kind: string) {
  switch (kind) {
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'signed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'upload':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
  }
}

export default async function StoragePage() {
  const { tenantId } = await getTenantFromSession();
  const documents = await getDocuments(tenantId);

  return (
    <div className="p-8">
      <div className="mb-8">
        <Breadcrumbs items={[{ label: 'Document Storage' }]} />
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Document Storage
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage drafts, signed wills, and client uploads
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="card-glass mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search documents or client name..."
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="upload">Uploads</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="button-base">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents table */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Document
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Type
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
                {documents.map((document) => (
                  <tr
                    key={document.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {document.title}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {document.client.firstName} {document.client.lastName}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getKindColor(document.kind)}>
                        {document.kind}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {document.createdAt.toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}