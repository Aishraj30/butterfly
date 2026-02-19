
import { NextResponse } from 'next/server';
import { createSegmindTryOn } from '@/lib/segmind';

// Segmind IDM-VTON API Endpoint: https://api.segmind.com/v1/idm-vton

export async function POST(req: Request) {
    try {
        const { model_image, garment_image, category } = await req.json();

        if (!model_image || !garment_image) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Map category to Segmind expectation
        // 'upper_body', 'lower_body', 'dresses'
        let segmindCategory: 'upper_body' | 'lower_body' | 'dresses' = 'upper_body';
        if (category === 'bottoms') segmindCategory = 'lower_body';
        if (category === 'one-pieces') segmindCategory = 'dresses';

        console.log('Starting Segmind generation with:', { model_image, garment_image, category: segmindCategory });

        // Segmind API is synchronous (returns image directly usually, but check for rate limits/queue)
        // Lib returns base64 string
        const resultImage = await createSegmindTryOn({
            model_image: model_image,
            garment_image: garment_image,
            category: segmindCategory,
            seed: 42,
            steps: 30
        });

        // Since it's synchronous, we return 'completed' immediately
        // The id is mock since we don't have a job ID for synchronous return, 
        // but we'll use timestamp.
        // HOWEVER, the frontend expects a status polling flow.
        // If we return 'completed' right away with output, the polling loop in frontend 
        // will catch it on the first check if we store it or if we change frontend logic.

        // Actually, the frontend polling loop calls /api/try-on/status/[id]
        // If we want to support the existing frontend without changes, 
        // we need to store this result somewhere temporarily?
        // OR we can change the frontend to handle immediate result.

        // Given "zero fail" instruction, let's keep frontend as is but hack the status API
        // to return the result if we pass the data... wait, we can't pass data through ID.

        // BETTER APPROACH:
        // Update frontend to handle immediate completion response from generate API.

        return NextResponse.json({
            id: Date.now().toString(),
            status: 'completed',
            output: [resultImage]
        });

    } catch (error: any) {
        console.error('Error starting Segmind try-on:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
