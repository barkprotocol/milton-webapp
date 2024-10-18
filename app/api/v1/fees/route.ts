import { NextResponse } from 'next/server'
import { z } from 'zod'

// Mock database (replace with actual database operations)
let blinks: any[] = []

const createBlinkSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  type: z.enum(['crowdfunding', 'token_swap', 'donation', 'nft_sale']),
  goal: z.number().positive().optional(),
  deadline: z.string().datetime().optional(),
  creatorAddress: z.string(),
})

const updateBlinkSchema = createBlinkSchema.partial().extend({
  id: z.string(),
})

const getBlinkSchema = z.object({
  id: z.string(),
})

const listBlinksSchema = z.object({
  type: z.enum(['crowdfunding', 'token_swap', 'donation', 'nft_sale']).optional(),
  creatorAddress: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const blink = createBlinkSchema.parse(body)
    
    // TODO: Save blink to database
    const newBlink = { id: Date.now().toString(), ...blink }
    blinks.push(newBlink)

    return NextResponse.json(newBlink, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating blink:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const updatedBlink = updateBlinkSchema.parse(body)
    
    // TODO: Update blink in database
    const index = blinks.findIndex(blink => blink.id === updatedBlink.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 })
    }
    blinks[index] = { ...blinks[index], ...updatedBlink }

    return NextResponse.json(blinks[index])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating blink:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    try {
      const { id: blinkId } = getBlinkSchema.parse({ id })
      // TODO: Fetch blink from database
      const blink = blinks.find(b => b.id === blinkId)
      if (!blink) {
        return NextResponse.json({ error: 'Blink not found' }, { status: 404 })
      }
      return NextResponse.json(blink)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      console.error('Error fetching blink:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  } else {
    try {
      const params = listBlinksSchema.parse(Object.fromEntries(searchParams))
      // TODO: Fetch blinks from database with filtering and pagination
      let filteredBlinks = blinks
      if (params.type) {
        filteredBlinks = filteredBlinks.filter(b => b.type === params.type)
      }
      if (params.creatorAddress) {
        filteredBlinks = filteredBlinks.filter(b => b.creatorAddress === params.creatorAddress)
      }
      const paginatedBlinks = filteredBlinks.slice(params.offset, params.offset + params.limit)
      return NextResponse.json({
        blinks: paginatedBlinks,
        total: filteredBlinks.length,
        limit: params.limit,
        offset: params.offset,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 })
      }
      console.error('Error listing blinks:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  try {
    const { id } = getBlinkSchema.parse(Object.fromEntries(searchParams))
    // TODO: Delete blink from database
    const index = blinks.findIndex(blink => blink.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Blink not found' }, { status: 404 })
    }
    blinks.splice(index, 1)
    return NextResponse.json({ message: 'Blink deleted successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error deleting blink:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}