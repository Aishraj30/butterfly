
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Increase Next.js route timeout
export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Check file size - cap at 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Image too large. Please use an image under 5MB.' },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64String}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'butterfly-couture/try-on',
            // Resize on upload to keep it fast and within Cloudinary limits
            transformation: [
                { width: 1024, height: 1024, crop: 'limit', quality: 'auto:good' }
            ],
            timeout: 300000, // 5 minutes
        });

        return NextResponse.json({
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id,
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return NextResponse.json(
            { error: 'Failed to upload image. Please try a smaller image.' },
            { status: 500 }
        );
    }
}
