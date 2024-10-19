import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const PaymentSchema = z.object({
  userId: z.string().min(44, "User ID must be at least 44 characters"),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount cannot exceed 1,000,000"),
  currency: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
})

type Payment = z.infer<typeof PaymentSchema> & {
  id: string
  timestamp: string
  status: 'pending' | 'completed' | 'failed'
}

// API Response Types
type PostResponseData = {
  payment: Payment
}

type GetResponseData = {
  payments: Payment[]
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

let payments: Payment[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = PaymentSchema.safeParse(req.body)
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
      }
      const { userId, amount, currency, description } = result.data

      const newPayment: Payment = {
        id: uuidv4(),
        userId,
        amount,
        currency,
        description,
        timestamp: new Date().toISOString(),
        status: 'pending',
      }
      payments.push(newPayment)
      
      // Simulate payment processing
      setTimeout(() => {
        const index = payments.findIndex(payment => payment.id === newPayment.id)
        if (index !== -1) {
          payments[index].status = Math.random() > 0.1 ? 'completed' : 'failed'
        }
      }, 2000)

      return res.status(201).json({ payment: newPayment })
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

      let filteredPayments = payments
      if (userId) {
        filteredPayments = payments.filter(payment => payment.userId === userId)
      }

      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedPayments = filteredPayments.slice(startIndex, endIndex)

      return res.status(200).json({ payments: paginatedPayments })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Payments API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}