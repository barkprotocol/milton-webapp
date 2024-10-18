import { NextResponse } from 'next/server'
import { z } from 'zod'

const giftSchema = z.object({
  senderAddress: z.string(),
  recipientAddress: z.string(),
  amount: z.number().positive(),
  tokenMint: z.string(),
  message: z.string().max(500).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const gift = giftSchema.parse(body)

    // TODO: Process the gift transaction on Solana
    console.log('Processing gift:', gift)

    return NextResponse.json({ message: 'Gift sent successfully', gift }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error processing gift:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'address is required' }, { status: 400 })
    }

    // TODO: Fetch gifts for the given address from Solana
    const gifts = [
      { id: '1', senderAddress: '0x123...', recipientAddress: address, amount: 10, tokenMint: 'SOL', message: 'Happy birthday!' },
      { id: '2', senderAddress: address, recipientAddress: '0x456...', amount: 5, tokenMint: 'USDC', message: 'Thank you!' },
    ]

    return NextResponse.json({ gifts })
  } catch (error) {
    console.error('Error fetching gifts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}