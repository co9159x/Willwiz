'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)}>
      <Link
        href="/dashboard"
        className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}