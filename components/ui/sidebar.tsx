'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  FileText,
  Archive,
  DollarSign,
  Settings,
  Shield,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Tasks', href: '/tasks', icon: CheckCircle },
  { name: 'Storage', href: '/storage', icon: Archive },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
];

const adminNavigation = [
  { name: 'Admin', href: '/admin', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const isAdmin = (session?.user as any)?.role === 'platform_admin';

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
            My Will
          </span>
        </div>
      </div>

      {/* Tenant info */}
      {(session?.user as any)?.tenantName && (
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {(session?.user as any).tenantName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {session?.user?.email}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4 pt-4">
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Administration
              </p>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Sign out */}
      <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}