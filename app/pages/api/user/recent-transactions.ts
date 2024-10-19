import { NextApiRequest, NextApiResponse } from 'next';

// Simulated transactions data retrieval
const getRecentTransactions = async (userId: string) => {
  // Placeholder for actual transactions data retrieval logic
  // In a real implementation, you would fetch transaction data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'txn_1',
          date: '2024-10-15',
          amount: 100,
          currency: 'USDC',
          type: 'credit',
        },
        {
          id: 'txn_2',
          date: '2024-10-14',
          amount: 50,
          currency: 'SOL',
          type: 'debit',
        },
        {
          id: 'txn_3',
          date: '2024-10-12',
          amount: 200,
          currency: 'MILTON',
          type: 'credit',
        },
      ]);
    }, 1000);
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    // Basic validation
    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({ success: false, message: 'Valid User ID is required' });
    }

    try {
      const transactions = await getRecentTransactions(userId);
      return res.status(200).json({ success: true, data: transactions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
