import { NextRequest, NextResponse } from 'next/server'
import { createContactSubmission, getContactSubmissions } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const submission = createContactSubmission({
      name,
      email,
      subject,
      message,
    })

    return NextResponse.json({
      success: true,
      data: submission,
      message: 'Your message has been received. We will get back to you soon.',
    })
  } catch (error) {
    console.error('[API] Contact POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, this would require authentication
    // For demo purposes, we'll return all submissions
    const submissions = getContactSubmissions()

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions.length,
    })
  } catch (error) {
    console.error('[API] Contact GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
