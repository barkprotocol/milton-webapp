import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const SwapSchema = z.object({
  fromToken: z.string(),
  toToken: z.string(),
  amount: z.number().positive(),
  slippage: z.number().min(0).max(100),
  walletAddress: z.string().min(44, "Wallet address must be at least 44 characters"),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { fromToken, toToken, amount, slippage, walletAddress } = SwapSchema.parse(req.body)

      // Simulated Swap operation (replace with actual swap logic)
      const mockSwapResult = {
        transactionId: `MILTON_TX_${Date.now()}`,
        fromToken,
        toToken,
        amountIn: amount,
        amountOut: amount * (1 - slippage / 100), // Adjusting amount out based on slippage
        fee: amount * 0.003, // Simulating a 0.3% fee
        timestamp: new Date().toISOString(),
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      res.status(200).json(mockSwapResult)
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid input', details: error.issues })
      } else {
        console.error('Milton Swap API Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  } else if (req.method === 'GET') {
    // Swap Rates
    const SwapRates = {
      'SOL/USDC': 20.5,
      'USDC/SOL': 0.0488,
      'SOL/MILTON': 100,
      'MILTON/SOL': 0.000001,
      'USDC/MILTON': 4.88,
      'MILTON/USDC': 0.205,
    }

    res.status(200).json(SwapRates)
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
