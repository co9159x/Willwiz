import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { FakePdfRenderer } from '@/lib/pdf';
import { writeAudit } from '@/lib/audit';

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
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    if (!will.draftMarkdown) {
      return NextResponse.json(
        { error: 'No draft content to preview' },
        { status: 400 }
      );
    }

    const pdfRenderer = new FakePdfRenderer();
    const previewPdfBuffer = await pdfRenderer.renderDraft(
      will.draftMarkdown || '',
      { clientName: 'Client' }
    );
    const previewPdfUrl = `data:application/pdf;base64,${previewPdfBuffer.toString('base64')}`;

    await writeAudit({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      event: 'GENERATE_PREVIEW',
      entityType: 'Will',
      entityId: params.id,
      meta: { previewGenerated: true },
    });

    return NextResponse.json({ previewPdfUrl });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
