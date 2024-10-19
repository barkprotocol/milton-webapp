import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const GiftSchema = z.object({
  senderId: z.string().min(44, "Sender ID must be at least 44 characters"),
  recipientId: z.string().min(44, "Recipient ID must be at least 44 characters"),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount cannot exceed 1,000,000"),
  currency: z.enum(['USDC', 'SOL', 'MILTON']),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
  scheduleDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

type Gift = z.infer<typeof GiftSchema> & {
  id: string;
  timestamp: string;
  status: 'pending' | 'sent' | 'failed';
};

// API Response Types
type PostResponseData = { gift: Gift };
type GetResponseData = { gifts: Gift[] };
type ErrorResponseData = { error: string; details?: unknown };

let gifts: Gift[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = GiftSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
      }
      const { senderId, recipientId, amount, currency, message, scheduleDate } = result.data;

      const newGift: Gift = {
        id: uuidv4(),
        senderId,
        recipientId,
        amount,
        currency,
        message,
        scheduleDate,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      gifts.push(newGift);
      
      // Simulate gift processing
      processGift(newGift);

      return res.status(201).json({ gift: newGift });
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        userId: z.string().min(44, "User ID must be at least 44 characters").optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
      });

      const queryResult = querySchema.safeParse(req.query);
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues });
      }

      const { userId, page, limit } = queryResult.data;

      let filteredGifts = gifts;
      if (userId) {
        filteredGifts = gifts.filter(
          gift => gift.senderId === userId || gift.recipientId === userId
        );
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedGifts = filteredGifts.slice(startIndex, endIndex);

      return res.status(200).json({ gifts: paginatedGifts });
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Gift API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Simulate gift processing
async function processGift(gift: Gift) {
  // Here you would typically call your gift processing service
  setTimeout(() => {
    const index = gifts.findIndex(g => g.id === gift.id);
    if (index !== -1) {
      gifts[index].status = Math.random() > 0.1 ? 'sent' : 'failed'; // Simulating a random outcome
    }
  }, 2000);
}
