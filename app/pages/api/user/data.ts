import { NextApiRequest, NextApiResponse } from 'next';

// Simulated user data retrieval
const getUserData = async (userId: string) => {
  // Placeholder for actual user data retrieval logic
  // In a real implementation, you would fetch user data from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        rewardsClaimed: 5,
      });
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
      const userData = await getUserData(userId);
      return res.status(200).json({ success: true, data: userData });
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
