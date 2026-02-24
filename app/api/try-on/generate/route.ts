

import { NextResponse } from 'next/server';
import { createTryOn } from '@/lib/fashn';

export async function POST(req: Request) {
    try {
        const { model_image, garment_image, category } = await req.json();

        if (!model_image || !garment_image) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Map category to FASHN expectation
        // 'tops', 'bottoms', 'one-pieces'
        let fashnCategory: 'tops' | 'bottoms' | 'one-pieces' = 'tops';
        if (category === 'bottoms') fashnCategory = 'bottoms';
        if (category === 'one-pieces' || category === 'dresses') fashnCategory = 'one-pieces';

        console.log('Starting Fashn AI generation with:', { model_image, garment_image, category: fashnCategory });

        const result = await createTryOn({
            model_image: model_image,
            garment_image: garment_image,
            category: fashnCategory
        });

        // Fashn returns an object with 'id' and 'status'
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Error starting Fashn try-on:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
