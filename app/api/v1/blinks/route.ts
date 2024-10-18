import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for validating blink data
const blinkSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['crowdfunding', 'token_swap', 'donation', 'nft_sale']),
  goal: z.number().positive().optional(),
  deadline: z.string().datetime().optional(),
});

// POST handler for creating a new blink
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blink = blinkSchema.parse(body);

    // TODO: Save blink to database
    console.log('Creating new blink:', blink);

    // Simulating a database save
    // const savedBlink = await saveBlinkToDatabase(blink);

    return NextResponse.json({ message: 'Blink created successfully', blink }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating blink:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET handler for fetching blinks
export async function GET(request: Request) {
  try {
    // TODO: Fetch blinks from database
    const blinks = [
      { id: '1', title: 'Sample Blink', type: 'crowdfunding', goal: 1000 },
      { id: '2', title: 'Another Blink', type: 'donation' },
    ];

    return NextResponse.json({ blinks });
  } catch (error) {
    console.error('Error fetching blinks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
