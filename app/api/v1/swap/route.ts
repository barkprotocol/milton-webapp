import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, RouteInfo } from '@jup-ag/api';

// Solana connection (use your RPC URL from environment variable)
const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

// Define type for the expected request body
interface SwapRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippage: number; // in percentage
  walletAddress: string;
}

// Load Jupiter with the connection and cluster
async function initializeJupiter() {
  return await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body (expected to be in JSON format)
    const body: SwapRequest = await request.json();
    const { inputMint, outputMint, amount, slippage, walletAddress } = body;

    // Validate inputs
    if (!inputMint || !outputMint || !amount || !slippage || !walletAddress) {
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    if (slippage < 0 || slippage > 100) {
      return NextResponse.json({ error: 'Slippage must be between 0 and 100' }, { status: 400 });
    }

    // Convert walletAddress to PublicKey
    const userPublicKey = new PublicKey(walletAddress);

    // Initialize Jupiter instance
    const jupiter = await initializeJupiter();

    // Fetch the routes for swapping
    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(inputMint),
      outputMint: new PublicKey(outputMint),
      amount, // amount is in the smallest unit of the token (like Lamports for SOL)
      slippageBps: slippage * 100, // Convert slippage from percentage to BPS
      userPublicKey,
    });

    if (!routes || routes.routesInfos.length === 0) {
      return NextResponse.json({ error: 'No routes found for the provided tokens.' }, { status: 404 });
    }

    // Use the defined interface to type the routeInfo and find the best route
    const bestRoute: RouteInfo = routes.routesInfos.reduce<RouteInfo>((prev, current) => {
      return (prev.expectedOutputAmount > current.expectedOutputAmount) ? prev : current;
    });

    // Execute the swap transaction
    const swapResult = await jupiter.exchange({
      routeInfo: bestRoute,
      userPublicKey,
    });

    // Handle the swap result
    if ('error' in swapResult) {
      return NextResponse.json({ error: swapResult.error }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Swap completed successfully',
      txid: swapResult.txid,
    });
  } catch (error) {
    console.error('Error executing swap:', error);

    // Handle any errors gracefully
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
