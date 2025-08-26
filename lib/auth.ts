import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials);
        if (!result.success) return null;

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { tenant: true },
        });

        if (!user || !await bcrypt.compare(password, user.hashedPassword)) {
          return null;
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant?.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.sub!;
      session.user.role = token.role as string;
      session.user.tenantId = token.tenantId as string;
      session.user.tenantName = token.tenantName as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
};

export default NextAuth(authOptions);

export const { auth, signIn, signOut } = NextAuth(authOptions);