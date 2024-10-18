import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { z } from 'zod';
import { rateLimit } from '../../lib/db/rate-limit';

// Initialize Solana connection (replace with your RPC URL)
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

// Set up rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Validation schema for transactions
const getTransactionsSchema = z.object({
  address: z.string().nonempty(),
  limit: z.number().int().positive().default(10),
});

export async function GET(request: Request) {
  await limiter.check(request); // Ensure this matches your rate-limit library usage

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'getBalance':
      return getBalance(searchParams);
    case 'getTokenBalances':
      return getTokenBalances(searchParams);
    case 'getTransactions':
      return getTransactions(searchParams);
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

// Type guard to check if instruction is of type ParsedInstruction
function isParsedInstruction(instruction: any): instruction is ParsedInstruction {
  return instruction && 'parsed' in instruction;
}

// Function to get transactions for a given address
async function getTransactions(searchParams: URLSearchParams) {
  try {
    const params = Object.fromEntries(searchParams) as { [key: string]: string };
    const { address, limit } = getTransactionsSchema.parse(params);
    const publicKey = new PublicKey(address);
    
    const transactions = await connection.getSignaturesForAddress(publicKey, { limit });
    
    const transactionDetails = await Promise.all(
      transactions.map(async (tx) => {
        const transactionDetail = await connection.getParsedTransaction(tx.signature);

        const instructions = transactionDetail?.transaction.message.instructions || [];

        return {
          signature: tx.signature,
          blockTime: tx.blockTime,
          slot: tx.slot,
          err: tx.err,
          memos: instructions
            .filter(isParsedInstruction)
            .map(instruction => instruction.parsed.info.memo ?? null)
            .filter(memo => memo), // Filter out null memos
          amounts: instructions
            .filter(isParsedInstruction)
            .map(instruction => instruction.parsed.info.amount ?? null)
            .filter(amount => amount !== null), // Filter out null amounts
        };
      })
    );

    return NextResponse.json({ transactions: transactionDetails });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Function to get balance for a given address
async function getBalance(searchParams: URLSearchParams) {
  try {
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    
    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Function to get token balances for a given address
async function getTokenBalances(searchParams: URLSearchParams) {
  try {
    const address = searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const publicKey = new PublicKey(address);
    
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey);
    const tokenBalances = tokenAccounts.value.map((account) => ({
      mint: account.account.data.parsed.info.mint,
      amount: account.account.data.parsed.info.tokenAmount.uiAmount,
      decimals: account.account.data.parsed.info.tokenAmount.decimals,
    }));

    return NextResponse.json({ tokenBalances });
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
