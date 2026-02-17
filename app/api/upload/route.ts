import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { verifyToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    /* Temporarily disabled
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token) as any

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access only' },
        { status: 403 }
      )
    }
    */

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('[Upload] No file found in form data')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`[Upload] Received file: ${file.name}, Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB, Type: ${file.type}`)

    // Validate file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: 'File must be an image or video' },
        { status: 400 }
      )
    }

    // Validate file size (500MB limit for videos, 10MB for images)
    const maxSize = isVideo ? 500 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `File size must be less than ${isVideo ? '500MB' : '10MB'}` },
        { status: 400 }
      )
    }

    let bytes = await file.arrayBuffer()
    let buffer: any = Buffer.from(bytes)
    let finalFilename = file.name.replace(/\s+/g, '-')
    let finalContentType = file.type

    // If it's a video, compress it
    if (isVideo) {
      const { compressVideo } = await import('@/lib/videoCompression')
      try {
        console.log(`[Upload] Starting video compression for: ${finalFilename}`)
        const compressed = await compressVideo(buffer, finalFilename)
        buffer = compressed.buffer
        finalFilename = compressed.filename
        finalContentType = 'video/mp4'

        // Upload using large file method since it's on disk
        const { uploadLargeToCloudinary } = await import('@/lib/cloudinary')
        const url = await uploadLargeToCloudinary(compressed.outputPath, `${Date.now()}-${finalFilename}`) as string

        // Cleanup temp file
        const fs = await import('fs')
        if (fs.existsSync(compressed.outputPath)) {
          fs.unlinkSync(compressed.outputPath)
        }

        return NextResponse.json({
          success: true,
          url,
          filename: finalFilename
        })
      } catch (err) {
        console.error('[Upload] Video compression failed, uploading original:', err)

        // If it's a large video, use large upload even for the original
        if (buffer.length > 10 * 1024 * 1024) {
          const fs = await import('fs')
          const os = await import('os')
          const path = await import('path')
          const tempPath = path.join(os.tmpdir(), `original-${Date.now()}-${finalFilename}`)
          await fs.promises.writeFile(tempPath, buffer)

          try {
            const { uploadLargeToCloudinary } = await import('@/lib/cloudinary')
            const url = await uploadLargeToCloudinary(tempPath, `${Date.now()}-${finalFilename}`) as string
            await fs.promises.unlink(tempPath).catch(() => { })
            return NextResponse.json({ success: true, url, filename: finalFilename })
          } catch (uploadErr) {
            await fs.promises.unlink(tempPath).catch(() => { })
            throw uploadErr
          }
        }
      }
    }

    // Create unique filename with timestamp
    const timestamp = Date.now()
    const filename = `${timestamp}-${finalFilename}`

    // Upload to Cloudinary (Standard method for images or fallback)
    const url = await uploadToCloudinary(buffer, filename, finalContentType)

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
