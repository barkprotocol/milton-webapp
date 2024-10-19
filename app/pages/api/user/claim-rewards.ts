import { NextApiRequest, NextApiResponse } from 'next';

// Simulated reward claiming logic
const claimRewards = async (userId: string): Promise<{ success: boolean; message?: string }> => {
  // Placeholder for actual reward claiming logic
  // Here, you would interact with your database or blockchain to process the claim
  // This is just a simulation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Rewards claimed successfully!' });
    }, 1000);
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    // Basic validation
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
      const result = await claimRewards(userId);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
