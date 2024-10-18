import { NextResponse } from 'next/server'
import { z } from 'zod'

const donationSchema = z.object({
  blinkId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  donorName: z.string().optional(),
  message: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const donation = donationSchema.parse(body)

    // TODO: Process donation and save to database
    console.log('Processing donation:', donation)

    return NextResponse.json({ message: 'Donation processed successfully', donation }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error processing donation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blinkId = searchParams.get('blinkId')

    if (!blinkId) {
      return NextResponse.json({ error: 'blinkId is required' }, { status: 400 })
    }

    // TODO: Fetch donations for the given blinkId from database
    const donations = [
      { id: '1', blinkId, amount: 100, currency: 'USD', donorName: 'John Doe', message: 'Great project!' },
      { id: '2', blinkId, amount: 50, currency: 'USD', donorName: 'Anonymous', message: null },
    ]

    return NextResponse.json({ donations })
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}