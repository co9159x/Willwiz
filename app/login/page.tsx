'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md card-glass">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">My Will</CardTitle>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to your broker account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full button-base"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Demo accounts:
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              broker@alder.co.uk / test1234
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              admin@platform.co.uk / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}