import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KpiCard({ title, value, description, icon: Icon, trend }: KpiCardProps) {
  return (
    <Card className="card-glass">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        )}
        {trend && (
          <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}