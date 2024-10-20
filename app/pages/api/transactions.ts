import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Enhanced Transaction Schema
const TransactionSchema = z.object({
  fromAddress: z.string().length(42, "From address must be exactly 42 characters"),
  toAddress: z.string().length(42, "To address must be exactly 42 characters"),
  amount: z.number().positive("Amount must be positive").max(500000000, "Amount cannot exceed 500,000,000"),
  currency: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  memo: z.string().max(200, "Memo cannot exceed 200 characters").optional(),
});

// Enhanced Transaction Type
type Transaction = z.infer<typeof TransactionSchema> & {
  id: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
};

// API Response Types
type PostResponseData = { transaction: Transaction };
type GetResponseData = {
  transactions: Transaction[];
  page: number;
  limit: number;
  totalTransactions: number;
  totalPages: number;
};
type ErrorResponseData = { error: string; details?: unknown };

// In-memory storage (replace with a database in production)
let transactions: Transaction[] = [];

// Helper function to simulate transaction processing
const processTransaction = async (transaction: Transaction): Promise<Transaction> => {
  transaction.status = 'processing';
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
  
  const randomOutcome = Math.random();
  if (randomOutcome > 0.9) {
    return { ...transaction, status: 'failed', errorMessage: 'Insufficient funds' };
  } else if (randomOutcome > 0.8) {
    return { ...transaction, status: 'failed', errorMessage: 'Network error' };
  }
  
  return { ...transaction, status: 'completed' };
};

// Pagination helper
const paginateResults = (results: Transaction[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return results.slice(startIndex, endIndex);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    if (req.method === 'POST') {
      const result = TransactionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid input', details: result.error.issues });
      }

      const { fromAddress, toAddress, amount, currency, memo } = result.data;

      const newTransaction: Transaction = {
        id: uuidv4(), // Generate a UUID for the transaction ID
        fromAddress,
        toAddress,
        amount,
        currency,
        memo,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      transactions.push(newTransaction);

      // Process transaction asynchronously
      processTransaction(newTransaction).then(processedTransaction => {
        const index = transactions.findIndex(tx => tx.id === newTransaction.id);
        if (index !== -1) {
          transactions[index] = processedTransaction;
        }
      }).catch(error => {
        console.error('Transaction processing error:', error);
      });

      return res.status(201).json({ transaction: newTransaction });
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        address: z.string().length(42, "Address must be exactly 42 characters").optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
        status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
      });

      const queryResult = querySchema.safeParse(req.query);
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues });
      }

      const { address, page, limit, status } = queryResult.data;

      const filteredTransactions = transactions.filter(tx => {
        const matchesAddress = address ? (tx.fromAddress === address || tx.toAddress === address) : true;
        const matchesStatus = status ? tx.status === status : true;
        return matchesAddress && matchesStatus;
      });

      const paginatedTransactions = paginateResults(filteredTransactions, page, limit);
      const totalTransactions = filteredTransactions.length;
      const totalPages = Math.ceil(totalTransactions / limit);

      return res.status(200).json({
        transactions: paginatedTransactions,
        page,
        limit,
        totalTransactions,
        totalPages,
      });
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Transactions API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
