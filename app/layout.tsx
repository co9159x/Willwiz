import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AuthProvider from '@/components/providers/session-provider';

export const dynamic = 'force-dynamic';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'My Will - UK Broker Platform',
  description: 'Professional will drafting platform for UK brokers and advisers',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    session = null;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}