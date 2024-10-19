import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const DonationSchema = z.object({
  donorId: z.string().min(44, "Donor ID must be at least 44 characters"),
  recipientId: z.string().min(44, "Recipient ID must be at least 44 characters"),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount cannot exceed 1,000,000"),
  currency: z.enum(['USDC', 'SOL', 'MILTON']),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
  anonymous: z.boolean().default(false),
})

type Donation = z.infer<typeof DonationSchema> & {
  id: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

// API Response Types
type PostResponseData = {
  donation: Donation
}

type GetResponseData = {
  donations: Donation[]
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

let donations: Donation[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = DonationSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
      }
      const { donorId, recipientId, amount, currency, message, anonymous } = result.data

      const newDonation: Donation = {
        id: uuidv4(),
        donorId,
        recipientId,
        amount,
        currency,
        message,
        anonymous,
        timestamp: new Date().toISOString(),
        status: 'pending',
      }
      donations.push(newDonation)
      
      // Simulate donation processing
      setTimeout(() => {
        const index = donations.findIndex(donation => donation.id === newDonation.id)
        if (index !== -1) {
          donations[index].status = Math.random() > 0.1 ? 'completed' : 'failed'
        }
      }, 2000)

      return res.status(201).json({ donation: newDonation })
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        userId: z.string().min(44, "User ID must be at least 44 characters").optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
      })

      const queryResult = querySchema.safeParse(req.query)
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues })
      }

      const { userId, page, limit } = queryResult.data

      let filteredDonations = donations
      if (userId) {
        filteredDonations = donations.filter(
          donation => donation.donorId === userId || donation.recipientId === userId
        )
      }

      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedDonations = filteredDonations.slice(startIndex, endIndex)

      return res.status(200).json({ donations: paginatedDonations })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Donations API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}