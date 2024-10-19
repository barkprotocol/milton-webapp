import { NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

// Mock data for token prices (in USD)
const tokenPrices = {
  SOL: 20,
  USDC: 1,
  MILTON: 0.5,
}

// Mock swap rates
const swapRates = {
  'SOL/USDC': 20,
  'USDC/SOL': 0.05,
  'SOL/MILTON': 40,
  'MILTON/SOL': 0.025,
  'USDC/MILTON': 2,
  'MILTON/USDC': 0.5,
}

const SwapSchema = z.object({
  fromToken: z.enum(['SOL', 'USDC', 'MILTON']),
  toToken: z.enum(['SOL', 'USDC', 'MILTON']),
  amount: z.number().positive(),
  slippage: z.number().min(0).max(100),
  walletAddress: z.string().min(32).max(44),
})

export async function GET() {
  return NextResponse.json({
    rates: swapRates,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 500, // Max 500 users per minute
    })
    const result = await limiter.check(request)

    if (!result.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await request.json()
    const { fromToken, toToken, amount, slippage, walletAddress } = SwapSchema.parse(body)

    // Calculate the swap
    const rate = swapRates[`${fromToken}/${toToken}`]
    if (!rate) {
      return NextResponse.json({ error: `Invalid token pair: ${fromToken}/${toToken}` }, { status: 400 })
    }

    const baseOutput = amount * rate
    const slippageAmount = baseOutput * (slippage / 100)
    const minOutput = baseOutput - slippageAmount
    const actualOutput = baseOutput - (Math.random() * slippageAmount) // Simulate some price movement

    // Calculate fees
    const miltonFee = amount * 0.005 // 0.5% Milton fee
    const jupiterFee = amount * 0.0005 // 0.05% Jupiter fee
    const solanaFee = 0.000005 * tokenPrices['SOL'] // 0.000005 SOL network fee

    const totalFee = miltonFee + jupiterFee + solanaFee

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const mockSwapResult = {
      transactionId: `MOCK_TX_${Date.now()}`,
      fromToken,
      toToken,
      amountIn: amount,
      amountOut: actualOutput,
      minAmountOut: minOutput,
      fee: totalFee,
      timestamp: new Date().toISOString(),
    }

    // Log the successful swap
    console.log(`Swap executed: ${amount} ${fromToken} to ${actualOutput} ${toToken}`)

    return NextResponse.json(mockSwapResult, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }
    console.error('Swap API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 })
  }
}