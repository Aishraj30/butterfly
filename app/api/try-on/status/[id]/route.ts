
import { NextResponse } from 'next/server';
import { getTryOnPredictionStatus } from '@/lib/replicate';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json(
            { error: 'Missing generation ID' },
            { status: 400 }
        );
    }

    try {
        const prediction = await getTryOnPredictionStatus(id);

        console.log(`Replicate status for ${id}:`, prediction.status);

        // Map Replicate status to Frontend expectation
        // Frontend expects: 'completed'
        // Replicate returns: 'succeeded'

        let status = prediction.status;
        if (status === 'succeeded') status = 'completed';

        // Replicate output is usually an array of URLs [url]
        // Check if output is string or array. For IDM-VTON it's typically an array.

        return NextResponse.json({
            id: prediction.id,
            status: status,
            output: prediction.output ? (Array.isArray(prediction.output) ? prediction.output : [prediction.output]) : null,
            error: prediction.error
        });

    } catch (error: any) {
        console.error('Error fetching try-on status:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
