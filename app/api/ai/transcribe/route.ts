import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const WHISPER_MODEL = process.env.WHISPER_MODEL || 'whisper-1'

// Check if API key is available
if (!OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY environment variable is not set')
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY || 'dummy-key' // Fallback to prevent crash
})

export async function POST(request: NextRequest) {
    // Check if API key is available
    if (!OPENAI_API_KEY) {
        return NextResponse.json({ 
            success: false, 
            error: 'OpenAI API key is not configured' 
        }, { status: 500 })
    }

    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ success: false, error: 'No audio file provided' }, { status: 400 })
        }

        // Convert file to buffer for OpenAI
        const buffer = Buffer.from(await file.arrayBuffer())

        // Use OpenAI Whisper to transcribe
        const transcription = await openai.audio.transcriptions.create({
            file: await toFile(buffer, 'audio.webm'),
            model: WHISPER_MODEL,
        })

        return NextResponse.json({
            success: true,
            text: transcription.text
        })

    } catch (error: any) {
        console.error('[API Transcribe] Error:', error)
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

// Helper to convert buffer to a file object for OpenAI
async function toFile(buffer: Buffer, filename: string) {
    const fs = await import('fs')
    const path = await import('path')
    const os = await import('os')
    const tempPath = path.join(os.tmpdir(), filename)
    fs.writeFileSync(tempPath, buffer)

    // @ts-ignore
    return fs.createReadStream(tempPath)
}
