import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const SendSchema = z.object({
  fromAddress: z.string().length(42, "From address must be exactly 42 characters"),
  toAddress: z.string().length(42, "To address must be exactly 42 characters"),
  amount: z.number().positive("Amount must be positive").max(1000000, "Amount cannot exceed 1,000,000"), // Example max limit
  currency: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  tokenAddress: z.string().optional(),
  memo: z.string().max(200, "Memo cannot exceed 200 characters").optional(),
});

type Send = z.infer<typeof SendSchema> & {
  id: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
};

// API Response Types
type PostResponseData = { send: Send };
type GetResponseData = {
  sends: Send[];
  totalCount: number;
  totalPages: number;
};

type ErrorResponseData = {
  error: string;
  details?: unknown;
};

let sends: Send[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = SendSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
      }
      
      const { fromAddress, toAddress, amount, currency, tokenAddress, memo } = result.data;
      
      if (currency === 'BARK' && !tokenAddress) {
        return res.status(400).json({ error: 'Token address is required for BARK tokens' });
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
      };
      
      sends.push(newSend);
      
      // Simulate transaction processing with a Promise
      processTransaction(newSend).catch(error => {
        console.error('Transaction processing error:', error);
      });

      return res.status(201).json({ send: newSend });
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        address: z.string().length(42, "Address must be exactly 42 characters"),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
      });

      const queryResult = querySchema.safeParse(req.query);
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues });
      }

      const { address, page, limit } = queryResult.data;

      const userSends = sends.filter(
        send => send.fromAddress === address || send.toAddress === address
      );

      const totalCount = userSends.length;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedSends = userSends.slice(startIndex, endIndex);
      const totalPages = Math.ceil(totalCount / limit);

      return res.status(200).json({ sends: paginatedSends, totalCount, totalPages });
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Send API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Helper function to simulate transaction processing
async function processTransaction(send: Send): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = sends.findIndex(s => s.id === send.id);
      if (index !== -1) {
        sends[index].status = Math.random() > 0.1 ? 'completed' : 'failed';
        // Optionally, you could add an error message if it failed
        if (sends[index].status === 'failed') {
          sends[index].status = 'failed'; // You could also add an error message
        }
      }
      resolve();
    }, 2000);
  });
}
