import { NextResponse } from 'next/server';
import { z } from 'zod';

// Example database client (replace with your actual database client)
import { db } from '../../lib/db'; // Adjust the import according to your project structure

// Define the schema for transaction validation
const transactionSchema = z.object({
  blinkId: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  txHash: z.string(),
});

// Handle POST requests to record a transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transaction = transactionSchema.parse(body);

    // Verify the transaction (placeholder for actual verification logic)
    const isValidTransaction = await verifyTransaction(transaction.txHash);
    if (!isValidTransaction) {
      return NextResponse.json({ error: 'Invalid transaction hash' }, { status: 400 });
    }

    // Save the transaction to the database
    const savedTransaction = await db.transactions.create({
      data: transaction,
    });

    return NextResponse.json(
      { message: 'Transaction recorded successfully', transaction: savedTransaction },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors separately
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error('Error recording transaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle GET requests to fetch transactions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blinkId = searchParams.get('blinkId');

    // Check for required query parameter
    if (!blinkId) {
      return NextResponse.json({ error: 'blinkId is required' }, { status: 400 });
    }

    // Fetch transactions for the given blinkId from the database
    const transactions = await db.transactions.findMany({
      where: { blinkId },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Placeholder function to verify the transaction hash
async function verifyTransaction(txHash: string): Promise<boolean> {
  // Implement actual logic to verify the transaction on the blockchain
  // For example, you might check if the transaction exists in a blockchain explorer API
  return true; // Replace with real verification logic
}
