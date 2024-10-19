import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// Define the Blink schema
const BlinkSchema = z.object({
  text: z.string().min(1, "Blink text is required").max(280, "Blink text must be 280 characters or less"),
  userId: z.string().min(1, "User ID is required"),
  tags: z.array(z.string()).optional(),
})

// Define the Blink type
type Blink = z.infer<typeof BlinkSchema> & {
  id: string
  timestamp: string
}

// In-memory storage for blinks (replace with database in production)
let blinks: Blink[] = []

// Define query parameters schema
const QuerySchema = z.object({
  userId: z.string().optional(),
  tag: z.string().optional(),
  limit: z.string().transform(Number).pipe(z.number().positive()).optional(),
})

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
    console.error('Milton Blinks API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const result = BlinkSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
  }
  const { text, userId, tags } = result.data

  const newBlink: Blink = {
    id: Date.now().toString(),
    text,
    userId,
    tags: tags || [],
    timestamp: new Date().toISOString(),
  }
  blinks.push(newBlink)

  return res.status(201).json(newBlink)
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const query = QuerySchema.safeParse(req.query)
  if (!query.success) {
    return res.status(400).json({ error: 'Invalid query parameters', details: query.error.issues })
  }

  let filteredBlinks = blinks

  if (query.data.userId) {
    filteredBlinks = filteredBlinks.filter(blink => blink.userId === query.data.userId)
  }

  if (query.data.tag) {
    filteredBlinks = filteredBlinks.filter(blink => blink.tags?.includes(query.data.tag!))
  }

  // Sort blinks by timestamp in descending order (newest first)
  filteredBlinks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (query.data.limit) {
    filteredBlinks = filteredBlinks.slice(0, query.data.limit)
  }

  return res.status(200).json(filteredBlinks)
}