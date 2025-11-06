import { NextRequest, NextResponse } from 'next/server';
import { clearDocumentText } from '@/lib/documentStore';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    clearDocumentText(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Document cleared successfully',
    });
  } catch (error) {
    console.error('Clear document error:', error);
    return NextResponse.json(
      { error: 'Failed to clear document' },
      { status: 500 }
    );
  }
}

