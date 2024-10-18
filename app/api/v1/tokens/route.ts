import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, TokenInfo } from '@jup-ag/core';

// Initialize Solana connection (replace with your RPC URL)
const connection = new Connection('https://api.mainnet-beta.solana.com');

export async function GET(request: NextRequest) {
  try {
    // Initialize Jupiter
    const jupiter = await Jupiter.load({
      connection,
      cluster: 'mainnet-beta',
      userPublicKey: null, // No user public key needed for fetching tokens
    });

    // Fetch all tokens supported by Jupiter
    const tokens: Record<string, TokenInfo> = jupiter.getTokens();

    // Transform tokens into an array of details
    const tokenList = Object.entries(tokens).map(([address, token]) => ({
      address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.logoURI,
    }));

    return NextResponse.json({ tokens: tokenList });
  } catch (error) {
    console.error('Error fetching tokens from Jupiter:', error);

    // Handle error and return appropriate response
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch tokens', message: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}

// Force Next.js to treat this as a dynamic route
export const dynamic = 'force-dynamic';
