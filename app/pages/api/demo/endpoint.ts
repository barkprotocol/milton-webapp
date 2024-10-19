import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

// Example schema for validating incoming data
const ExampleSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().positive(),
});

// Mock function to simulate saving data to a database
const saveToDatabase = async (data) => {
  // Simulate database operation (e.g., using Prisma)
  console.log('Data saved:', data);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      res.status(200).json({ message: 'Hello, World!' });
      break;

    case 'POST':
      try {
        const validatedData = ExampleSchema.parse(req.body);
        await saveToDatabase(validatedData); // Save data to the database
        res.status(201).json({ message: 'Data received successfully!', data: validatedData });
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({
            message: 'Invalid data',
            errors: error.errors.map(err => ({ field: err.path[0], message: err.message })),
          });
        } else {
          console.error('Error processing request:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};

export default handler;
