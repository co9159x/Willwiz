import { prisma } from '@/lib/db';

export default async function TestPage() {
  try {
    // Simple connection test
    await prisma.$connect();
    
    // Simple query
    const userCount = await prisma.user.count();
    
    await prisma.$disconnect();

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-green-600">Database Connection Successful!</h1>
        <p className="mt-4 text-lg">Total users in database: {userCount}</p>
        <p className="mt-2 text-gray-600">Database connection is working properly.</p>
      </div>
    );
  } catch (error) {
    console.error('Test page error:', error);
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Database Connection Failed</h1>
        <pre className="mt-4 p-4 bg-red-50 border rounded overflow-auto">
          {error instanceof Error ? error.message : 'Unknown error'}
          {'\n\nStack trace:\n'}
          {error instanceof Error ? error.stack : 'No stack trace available'}
        </pre>
      </div>
    );
  }
}
