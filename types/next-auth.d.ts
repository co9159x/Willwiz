declare module 'next-auth' {
  interface User {
    role: string;
    tenantId: string;
    tenantName: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    tenantId: string;
    tenantName: string;
  }
}