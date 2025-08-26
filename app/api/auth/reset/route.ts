import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { writeAudit } from '@/lib/audit';

const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        message: 'If an account with this email exists, a reset link has been sent.' 
      });
    }

    // Generate a simple reset token (in production, use a proper token library)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store reset token in database (you might want to add a resetToken field to User model)
    // For now, we'll just log it in development
    console.log(`Password reset token for ${validatedData.email}: ${resetToken}`);
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`);

    // Log audit event
    await writeAudit({
      tenantId: user.tenantId || 'platform',
      userId: user.id,
      event: 'PASSWORD_RESET_REQUESTED',
      entityType: 'User',
      entityId: user.id,
      meta: { 
        email: validatedData.email,
      },
    });

    return NextResponse.json({ 
      message: 'If an account with this email exists, a reset link has been sent.' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
