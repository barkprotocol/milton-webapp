import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

// Token Schema for validation
const TokenSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Symbol is required"),
  address: z.string().min(42, "Address must be at least 42 characters"),
  decimals: z.number().int().min(0, "Decimals must be a non-negative integer"),
})

// Token Type
type Token = z.infer<typeof TokenSchema> & {
  id: string
}

// API Response Types
type PostResponseData = {
  token: Token
}

type GetResponseData = {
  tokens: Token[]
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

// In-memory storage (replace with a database in production)
let tokens: Token[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = TokenSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
      }
      const { name, symbol, address, decimals } = result.data

      const newToken: Token = {
        id: uuidv4(),
        name,
        symbol,
        address,
        decimals,
      }
      tokens.push(newToken)

      return res.status(201).json({ token: newToken })
    } else if (req.method === 'GET') {
      return res.status(200).json({ tokens })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Tokens API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}
