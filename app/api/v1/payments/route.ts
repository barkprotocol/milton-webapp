import { NextResponse } from 'next/server'
import { z } from 'zod'

const paymentSchema = z.object({
  blinkId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  paymentMethod: z.enum(['credit_card', 'crypto', 'bank_transfer']),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payment = paymentSchema.parse(body)

    // TODO: Process payment and save to database
    console.log('Processing payment:', payment)

    return NextResponse.json({ message: 'Payment processed successfully', payment }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error processing payment:', error)
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

    // TODO: Fetch payments for the given blinkId from database
    const payments = [
      { id: '1', blinkId, amount: 100, currency: 'USD', paymentMethod: 'credit_card' },
      { id: '2', blinkId, amount: 50, currency: 'USD', paymentMethod: 'crypto' },
    ]

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}