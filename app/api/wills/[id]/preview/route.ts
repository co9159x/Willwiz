import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const previewSchema = z.object({
  jsonPayload: z.record(z.any()),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jsonPayload } = previewSchema.parse(body);

    // Verify the will exists and belongs to the user's tenant
    const will = await prisma.will.findFirst({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
      include: {
        client: true,
      },
    });

    if (!will) {
      return NextResponse.json({ error: 'Will not found' }, { status: 404 });
    }

    // Generate draft markdown from the JSON payload
    const draftMarkdown = generateDraftMarkdown(jsonPayload, will.client);

    // Update the will with the generated markdown
    await prisma.will.update({
      where: { id: params.id },
      data: {
        draftMarkdown,
        jsonPayload,
        updatedAt: new Date(),
      },
    });

    // For now, return a placeholder PDF URL
    // In a real implementation, this would generate an actual PDF
    const previewPdfUrl = `/api/wills/${params.id}/preview-pdf?t=${Date.now()}`;

    return NextResponse.json({
      previewPdfUrl,
      draftMarkdown,
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateDraftMarkdown(jsonPayload: any, client: any): string {
  let markdown = `# DRAFT WILL\n\n`;
  markdown += `**This is a draft will for ${client.firstName} ${client.lastName}**\n\n`;
  markdown += `*Generated on ${new Date().toLocaleDateString('en-GB')}*\n\n`;
  markdown += `---\n\n`;

  // Personal Information
  if (jsonPayload.personalInfo) {
    markdown += `## 1. PERSONAL INFORMATION\n\n`;
    markdown += `**Full Name:** ${jsonPayload.personalInfo.fullName || 'Not specified'}\n\n`;
    markdown += `**Date of Birth:** ${jsonPayload.personalInfo.dateOfBirth ? new Date(jsonPayload.personalInfo.dateOfBirth).toLocaleDateString('en-GB') : 'Not specified'}\n\n`;
    markdown += `**Marital Status:** ${jsonPayload.personalInfo.maritalStatus || 'Not specified'}\n\n`;
    markdown += `**Nationality:** ${jsonPayload.personalInfo.nationality || 'Not specified'}\n\n`;
    
    if (jsonPayload.personalInfo.address) {
      markdown += `**Address:**\n`;
      markdown += `${jsonPayload.personalInfo.address.line1 || ''}\n`;
      if (jsonPayload.personalInfo.address.line2) {
        markdown += `${jsonPayload.personalInfo.address.line2}\n`;
      }
      markdown += `${jsonPayload.personalInfo.address.city || ''}, ${jsonPayload.personalInfo.address.postcode || ''}\n`;
      markdown += `${jsonPayload.personalInfo.address.country || 'UK'}\n\n`;
    }
  }

  // Executors
  if (jsonPayload.executors && jsonPayload.executors.length > 0) {
    markdown += `## 2. EXECUTORS\n\n`;
    jsonPayload.executors.forEach((executor: any, index: number) => {
      markdown += `**${executor.isReserve ? 'Reserve ' : ''}Executor ${index + 1}:** ${executor.fullName}\n\n`;
      markdown += `**Relationship:** ${executor.relationship || 'Not specified'}\n\n`;
      markdown += `**Address:** ${executor.address || 'Not specified'}\n\n`;
    });
  }

  // Beneficiaries
  if (jsonPayload.beneficiaries && jsonPayload.beneficiaries.length > 0) {
    markdown += `## 3. BENEFICIARIES\n\n`;
    jsonPayload.beneficiaries.forEach((beneficiary: any, index: number) => {
      markdown += `**Beneficiary ${index + 1}:** ${beneficiary.name}\n\n`;
      markdown += `**Type:** ${beneficiary.isCharity ? 'Charity' : 'Individual'}\n\n`;
      markdown += `**Relationship:** ${beneficiary.relationship || 'Not specified'}\n\n`;
      markdown += `**Share:** ${beneficiary.share}%\n\n`;
    });
  }

  // Guardianship
  if (jsonPayload.guardianship?.hasMinorChildren && jsonPayload.guardianship.guardians?.length > 0) {
    markdown += `## 4. GUARDIANSHIP\n\n`;
    markdown += `**Guardians for Minor Children:**\n\n`;
    jsonPayload.guardianship.guardians.forEach((guardian: any, index: number) => {
      markdown += `**Guardian ${index + 1}:** ${guardian.fullName}\n\n`;
      markdown += `**Relationship:** ${guardian.relationship || 'Not specified'}\n\n`;
      markdown += `**Address:** ${guardian.address || 'Not specified'}\n\n`;
    });
    
    if (jsonPayload.guardianship.specialInstructions) {
      markdown += `**Special Instructions:** ${jsonPayload.guardianship.specialInstructions}\n\n`;
    }
  }

  // Residue and Specific Gifts
  if (jsonPayload.residue) {
    markdown += `## 5. RESIDUE AND SPECIFIC GIFTS\n\n`;
    markdown += `**Distribution Type:** ${jsonPayload.residue.distributionType || 'Not specified'}\n\n`;
    
    if (jsonPayload.residue.specificGifts && jsonPayload.residue.specificGifts.length > 0) {
      markdown += `**Specific Gifts:**\n\n`;
      jsonPayload.residue.specificGifts.forEach((gift: any, index: number) => {
        markdown += `**Gift ${index + 1}:**\n`;
        markdown += `- **To:** ${gift.beneficiary}\n`;
        markdown += `- **Item/Amount:** ${gift.itemOrAmount}\n`;
        if (gift.notes) {
          markdown += `- **Notes:** ${gift.notes}\n`;
        }
        markdown += `\n`;
      });
    }
    
    if (jsonPayload.residue.funeralWishes) {
      markdown += `**Funeral Wishes:** ${jsonPayload.residue.funeralWishes}\n\n`;
    }
    
    if (jsonPayload.residue.specialClauses) {
      markdown += `**Special Clauses:** ${jsonPayload.residue.specialClauses}\n\n`;
    }
  }

  markdown += `---\n\n`;
  markdown += `*This is a draft will and should not be considered legally binding until properly executed with witnesses.*\n\n`;
  markdown += `*Generated by My Will Platform*`;

  return markdown;
}
