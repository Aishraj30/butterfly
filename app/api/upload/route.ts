import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, uploadLargeToCloudinary } from '@/lib/cloudinary'
import { uploadToS3 } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const storageStrategy = process.env.IMAGE_STORAGE || 'cloudinary'

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('[Upload] No file found in form data')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`[Upload] Received file: ${file.name}, Strategy: ${storageStrategy}`)

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'File must be an image or video' },
        { status: 400 }
      )
    }

    let bytes = await file.arrayBuffer()
    let buffer: any = Buffer.from(bytes)
    let finalFilename = file.name.replace(/\s+/g, '-')
    let finalContentType = file.type

    // Create unique filename with timestamp
    const timestamp = Date.now()
    const filename = `${timestamp}-${finalFilename}`

    let url: string = ''

    if (storageStrategy === 's3') {
      // S3 Logic
      url = await uploadToS3(buffer, filename, finalContentType)
    } else {
      // Cloudinary Logic
      if (isVideo) {
        const { compressVideo } = await import('@/lib/videoCompression')
        try {
          const compressed = await compressVideo(buffer, finalFilename)
          const outPath = compressed.outputPath
          // Assume uploadLargeToCloudinary returns string or cast it
          const uploadedUrl = await uploadLargeToCloudinary(outPath, filename)
          url = typeof uploadedUrl === 'string' ? uploadedUrl : (uploadedUrl as any).secure_url || ''
          
          // Cleanup temp file
          const fs = await import('fs')
          if (fs.existsSync(outPath)) {
            fs.unlinkSync(outPath)
          }
        } catch (err) {
          console.error('[Upload] Video processing failed:', err)
          const uploadedUrl = await uploadToCloudinary(buffer, filename, finalContentType)
          url = typeof uploadedUrl === 'string' ? uploadedUrl : (uploadedUrl as any).secure_url || ''
        }
      } else {
        const uploadedUrl = await uploadToCloudinary(buffer, filename, finalContentType)
        url = typeof uploadedUrl === 'string' ? uploadedUrl : (uploadedUrl as any).secure_url || ''
      }
    }

    return NextResponse.json({
      success: true,
      url,
      filename
    })

  } catch (error: any) {
    console.error('[API] Upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}
