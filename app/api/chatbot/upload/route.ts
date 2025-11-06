import { NextRequest, NextResponse } from 'next/server';
import { setDocumentText } from '@/lib/documentStore';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sessionId = formData.get('sessionId') as string || 'default';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|pdf|doc|docx|md)$/i)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload TXT, PDF, DOC, DOCX, or MD files.' },
        { status: 400 }
      );
    }

    // Read file content
    let textContent = '';
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      // Text file - read directly
      textContent = await file.text();
    } else {
      // For PDF/DOC files, we'll need to extract text
      // For demo purposes, we'll read as text (actual PDF/DOC parsing would need libraries)
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Simple text extraction (for demo - in production use pdf-parse or mammoth for better extraction)
      try {
        textContent = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, '').substring(0, 10000);
      } catch {
        return NextResponse.json(
          { error: 'Failed to extract text from file. Please try a TXT file or ensure the file is not corrupted.' },
          { status: 400 }
        );
      }
    }

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'File appears to be empty or could not be read' },
        { status: 400 }
      );
    }

    // Limit content size
    const maxLength = 10000;
    if (textContent.length > maxLength) {
      textContent = textContent.substring(0, maxLength) + '...[truncated]';
    }

    // Store document text for this session
    setDocumentText(sessionId, `${file.name}:\n${textContent}`);

    return NextResponse.json({
      success: true,
      textContent,
      fileName: file.name,
      fileSize: file.size,
      sessionId,
      message: `Document "${file.name}" uploaded successfully! I can now answer questions about it.`,
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

