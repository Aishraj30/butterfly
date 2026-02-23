import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { image, type } = body

        if (!image) {
            return NextResponse.json(
                { success: false, error: 'Image URL is required' },
                { status: 400 }
            )
        }

        console.log(`[AI PRO] Mode: ${type}`)

        // ---------------------------------------------------------
        // THREE SPECIFIC PROFESSIONAL MODES
        // ---------------------------------------------------------
        let transformations = ''

        if (type === 'contrast') {
            // Mode 1: High Contrast & Depth
            transformations = 'e_improve,e_contrast:100,e_vibrance:30,q_auto,f_auto'
        } else if (type === 'lighting') {
            // Mode 2: High Light & Exposure
            transformations = 'e_improve,e_brightness:50,e_gamma:50,q_auto,f_auto'
        } else if (type === 'sharpen') {
            // Mode 3: Max Sharpness & Detail
            transformations = 'e_improve,e_unsharp_mask:300,e_sharpen:100,q_auto,f_auto'
        } else {
            transformations = 'e_improve,q_auto,f_auto'
        }

        let refinedUrl = image

        if (image.includes('cloudinary.com')) {
            const [base, rest] = image.split('/upload/')
            if (rest) {
                const segments = rest.split('/')
                const versionIndex = segments.findIndex((s: string) => /^v\d+$/.test(s))

                if (versionIndex !== -1) {
                    const assetPath = segments.slice(versionIndex).join('/')
                    refinedUrl = `${base}/upload/${transformations}/${assetPath}`
                } else {
                    refinedUrl = `${base}/upload/${transformations}/${rest}`
                }
                refinedUrl += refinedUrl.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`
            }
        } else {
            // Fallback for non-cloudinary
            const { uploadToCloudinary } = await import('@/lib/cloudinary')
            const res = await fetch(image)
            const buffer = Buffer.from(await res.arrayBuffer())
            const newUrl = await uploadToCloudinary(buffer, `pro-edit-${Date.now()}`, 'image/jpeg') as string
            const [base, rest] = newUrl.split('/upload/')
            if (rest) {
                refinedUrl = `${base}/upload/${transformations}/${rest}?t=${Date.now()}`
            }
        }

        return NextResponse.json({
            success: true,
            variant: {
                id: `pro-edit-${Date.now()}`,
                url: refinedUrl,
                type: type,
                description: `Professional AI ${type} Adjustment`
            }
        })

    } catch (error: any) {
        console.error('[API AI PRO] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
