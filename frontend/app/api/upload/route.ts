import { NextRequest, NextResponse } from 'next/server';

/**
 * File Upload API Route
 * Allows users to upload log files for AI analysis
 */
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Read file content
        const text = await file.text();

        // Get API URL from environment
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Send to backend API for analysis
        const response = await fetch(`${apiUrl}/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logs: text })
        });

        if (!response.ok) {
            throw new Error('Backend API request failed');
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
