import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { SOLANA_CONFIG, MILTON_TOKEN_CONFIG } from '@/config/tokens'

const MintSchema = z.object({
  toAddress: z.string().min(44, "To address must be at least 44 characters"),
  amount: z.number().positive("Amount must be positive").max(1000000000, "Amount cannot exceed 1,000,000,000"),
  name: z.string().min(1, "Token name is required").max(32, "Token name cannot exceed 32 characters"),
  symbol: z.string().min(1, "Token symbol is required").max(10, "Token symbol cannot exceed 10 characters"),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
  image: z.string().url("Invalid image URL").optional(),
})

type Mint = z.infer<typeof MintSchema> & {
  id: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
  tokenAddress: string
}

// API Response Types
type PostResponseData = {
  mint: Mint
}

type GetResponseData = {
  mints: Mint[]
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

let mints: Mint[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = MintSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
      }

      const { toAddress, amount, name, symbol, description, image } = result.data

      // Simulate token address generation
      const tokenAddress = `${MILTON_TOKEN_CONFIG.mintAddress.slice(0, 8)}${Date.now().toString(16).padStart(24, '0')}`

      const newMint: Mint = {
        id: uuidv4(),
        toAddress,
        amount,
        name,
        symbol,
        description,
        image,
        tokenAddress,
        timestamp: new Date().toISOString(),
        status: 'pending',
      }

      mints.push(newMint)

      // Simulate minting process
      setTimeout(() => {
        const index = mints.findIndex(mint => mint.id === newMint.id)
        if (index !== -1) {
          mints[index].status = Math.random() > 0.1 ? 'completed' : 'failed'
        }
      }, 2000)

      return res.status(201).json({ mint: newMint })
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        address: z.string().min(44, "Address must be at least 44 characters"),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
      })

      const queryResult = querySchema.safeParse(req.query)
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues })
      }

      const { address, page, limit } = queryResult.data

      const userMints = mints.filter(mint => mint.toAddress === address)

      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedMints = userMints.slice(startIndex, endIndex)

      return res.status(200).json({ mints: paginatedMints })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Mint API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}