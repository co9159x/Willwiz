import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FakePdfRenderer } from '@/lib/pdf';
import { writeAudit } from '@/lib/audit';
import { createHash } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const will = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
    });

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    if (will.status !== 'sent_for_approval') {
      return NextResponse.json(
        { error: 'Will must be sent for approval before attestation' },
        { status: 400 }
      );
    }

    // Generate final signed PDF
    const pdfRenderer = new FakePdfRenderer();
    const signedPdfBuffer = await pdfRenderer.renderSigned(
      will.draftMarkdown || '',
      { clientName: 'Client' },
      []
    );
    const signedPdfUrl = `data:application/pdf;base64,${signedPdfBuffer.toString('base64')}`;
    
    // Generate checksum
    const checksumSha256 = createHash('sha256')
      .update(signedPdfUrl)
      .digest('hex');

    const updatedWill = await prisma.will.update({
      where: { id: params.id },
      data: {
        status: 'signed',
        signedPdfUrl,
        checksumSha256,
        lockAt: new Date(),
      },
    });

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'COMPLETE_ATTESTATION',
      entityType: 'Will',
      entityId: params.id,
      meta: { 
        checksumSha256,
      },
    });

    return NextResponse.json(updatedWill);
  } catch (error) {
    console.error('Error completing attestation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
