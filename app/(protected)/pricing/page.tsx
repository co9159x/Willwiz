import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTenantFromSession } from '@/lib/tenant';
import { prisma } from '@/lib/db';

async function getPricing(tenantId: string) {
  return prisma.pricing.findUnique({
    where: { tenantId },
  });
}

export default async function PricingPage() {
  const { tenantId } = await getTenantFromSession();
  const pricing = await getPricing(tenantId);

  if (!pricing) {
    return (
      <div className="p-8">
        <p>Pricing configuration not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Breadcrumbs items={[{ label: 'Pricing' }]} />
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Pricing Configuration
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your will pricing and revenue splits
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Will Pricing */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Will Pricing (£)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="singleWill">Single Will</Label>
              <Input
                id="singleWill"
                type="number"
                defaultValue={pricing.singleWillPrice / 100}
                step="0.01"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mirrorWill">Mirror Will (Couple)</Label>
              <Input
                id="mirrorWill"
                type="number"
                defaultValue={pricing.mirrorWillPrice / 100}
                step="0.01"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="trustWill">Trust Will</Label>
              <Input
                id="trustWill"
                type="number"
                defaultValue={pricing.trustWillPrice / 100}
                step="0.01"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Split */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Revenue Split (%)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brokerSplit">Broker Share</Label>
              <Input
                id="brokerSplit"
                type="number"
                defaultValue={pricing.revenueSplitBroker}
                min="0"
                max="100"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="platformSplit">Platform Share</Label>
              <Input
                id="platformSplit"
                type="number"
                defaultValue={pricing.revenueSplitPlatform}
                min="0"
                max="100"
                className="mt-1"
              />
            </div>

            <Separator />
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                Revenue Example
              </h4>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <p>Single Will: £{(pricing.singleWillPrice / 100).toFixed(2)}</p>
                <p>Broker receives: £{((pricing.singleWillPrice * pricing.revenueSplitBroker) / 10000).toFixed(2)}</p>
                <p>Platform receives: £{((pricing.singleWillPrice * pricing.revenueSplitPlatform) / 10000).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="button-base bg-primary text-primary-foreground hover:bg-primary/90">
          Save Pricing
        </Button>
      </div>
    </div>
  );
}