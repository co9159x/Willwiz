export interface PdfRenderer {
  renderDraft(content: string, metadata: any): Promise<Buffer>;
  renderSigned(content: string, metadata: any, signatures: any[]): Promise<Buffer>;
}

export class FakePdfRenderer implements PdfRenderer {
  async renderDraft(content: string, metadata: any): Promise<Buffer> {
    // Create a simple PDF placeholder
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 57
>>
stream
BT
/F1 12 Tf
100 700 Td
(DRAFT WILL - ${metadata.clientName || 'Client'}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000208 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
318
%%EOF`;

    return Buffer.from(pdfContent, 'ascii');
  }

  async renderSigned(content: string, metadata: any, signatures: any[]): Promise<Buffer> {
    // Create a simple signed PDF placeholder
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 75
>>
stream
BT
/F1 12 Tf
100 700 Td
(SIGNED WILL - ${metadata.clientName || 'Client'}) Tj
100 680 Td
(Date: ${new Date().toLocaleDateString('en-GB')}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000208 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
336
%%EOF`;

    return Buffer.from(pdfContent, 'ascii');
  }
}

export const pdfRenderer = new FakePdfRenderer();