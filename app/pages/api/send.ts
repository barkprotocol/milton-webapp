import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const SendSchema = z.object({
  fromAddress: z.string().min(1, "From address is required"),
  toAddress: z.string().min(1, "To address is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  tokenAddress: z.string().optional(),
  memo: z.string().max(200, "Memo cannot exceed 200 characters").optional(),
})

type Send = z.infer<typeof SendSchema> & {
  id: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

// API Response Types
type PostResponseData = {
  send: Send
}

type GetResponseData = {
  sends: Send[]
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

let sends: Send[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = SendSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
      }
      const { fromAddress, toAddress, amount, currency, tokenAddress, memo } = result.data
      
      if (currency === 'BARK' && !tokenAddress) {
        return res.status(400).json({ error: 'Token address is required for BARK tokens' })
      }

      const newSend: Send = {
        id: uuidv4(),
        fromAddress,
        toAddress,
        amount,
        currency,
        tokenAddress,
        memo,
        timestamp: new Date().toISOString(),
        status: 'pending',
      }
      sends.push(newSend)
      
      // Simulate transaction processing
      setTimeout(() => {
        const index = sends.findIndex(send => send.id === newSend.id)
        if (index !== -1) {
          sends[index].status = Math.random() > 0.1 ? 'completed' : 'failed'
        }
      }, 2000)

      return res.status(201).json({ send: newSend })
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        address: z.string().min(1, "Address is required"),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
      })

      const queryResult = querySchema.safeParse(req.query)
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues })
      }

      const { address, page, limit } = queryResult.data

      const userSends = sends.filter(
        send => send.fromAddress === address || send.toAddress === address
      )

      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedSends = userSends.slice(startIndex, endIndex)

      return res.status(200).json({ sends: paginatedSends })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Send API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}