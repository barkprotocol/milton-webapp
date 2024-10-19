import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// Fee Schema for validation
const FeeSchema = z.object({
  operation: z.enum(['transfer', 'swap', 'stake', 'unstake']),
  feePercentage: z.number().positive().max(100, "Fee percentage cannot exceed 100"),
})

// Fee Type
type Fee = z.infer<typeof FeeSchema>

// API Response Types
type PostResponseData = {
  fee: Fee
}

type GetResponseData = {
  fees: Fee[]
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

// In-memory storage for fees (replace with a database in production)
let fees: Fee[] = [
  { operation: 'transfer', feePercentage: 0.3 },
  { operation: 'swap', feePercentage: 0.5 },
  { operation: 'stake', feePercentage: 1.0 },
  { operation: 'unstake', feePercentage: 1.0 },
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = FeeSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
      }
      const { operation, feePercentage } = result.data

      // Check if the fee for the operation already exists
      const existingFeeIndex = fees.findIndex(fee => fee.operation === operation)
      if (existingFeeIndex !== -1) {
        fees[existingFeeIndex].feePercentage = feePercentage // Update existing fee
      } else {
        const newFee: Fee = { operation, feePercentage }
        fees.push(newFee) // Add new fee
      }

      return res.status(201).json({ fee: { operation, feePercentage } })
    } else if (req.method === 'GET') {
      return res.status(200).json({ fees })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Fees API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}
