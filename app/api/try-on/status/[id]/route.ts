

import { NextResponse } from 'next/server';
import { getTryOnStatus } from '@/lib/fashn';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: 'Missing generation ID' },
            { status: 400 }
        );
    }

    try {
        const response = await getTryOnStatus(id);

        console.log(`Fashn status for ${id}:`, response.status);

        // Fashn response already has id, status, output, etc.
        // Match the frontend expectation: 'completed'
        // Fashn returns: 'starting', 'processing', 'completed', 'failed', 'cancelled'

        return NextResponse.json(response);

    } catch (error: any) {
        console.error('Error fetching Fashn try-on status:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
