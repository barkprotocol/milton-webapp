import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// Define the Payment schema
const PaymentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  currency: z.string().min(1, "Currency is required"),
})

// Define the Payment type
type Payment = z.infer<typeof PaymentSchema> & {
  id: string
  timestamp: string
}

// In-memory storage for payments (replace with a database in production)
let payments: Payment[] = []

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      return handlePost(req, res)
    } else if (req.method === 'GET') {
      return handleGet(req, res)
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Payment API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const result = PaymentSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
  }

  const { userId, amount, paymentMethod, currency } = result.data

  const newPayment: Payment = {
    id: Date.now().toString(),
    userId,
    amount,
    paymentMethod,
    currency,
    timestamp: new Date().toISOString(),
  }

  payments.push(newPayment)

  return res.status(201).json(newPayment)
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  const userPayments = payments.filter(payment => payment.userId === userId)

  return res.status(200).json(userPayments)
}
