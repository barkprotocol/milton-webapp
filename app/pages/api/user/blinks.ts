import { PrismaClient } from '@prisma/client';
import { Blink } from './types'; // Assuming you have a types file for shared types
import { BlinkSchema, QuerySchema } from './schemas'; // Import your Zod schemas here

const prisma = new PrismaClient();

// Function to create a new Blink
export async function createBlink(blinkData: Blink) {
  const result = BlinkSchema.safeParse(blinkData);
  if (!result.success) {
    throw new Error('Invalid input');
  }

  const { text, userId, tags } = result.data;

  const newBlink = await prisma.blink.create({
    data: {
      text,
      userId,
      tags: {
        set: tags || [],
      },
    },
  });

  return newBlink;
}

// Function to fetch blinks based on query parameters
export async function getBlinks(query: any) {
  const parsedQuery = QuerySchema.safeParse(query);
  if (!parsedQuery.success) {
    throw new Error('Invalid query parameters');
  }

  const { userId, tag, limit } = parsedQuery.data;

  const blinks = await prisma.blink.findMany({
    where: {
      ...(userId && { userId }),
      ...(tag && { tags: { has: tag } }),
    },
    orderBy: {
      timestamp: 'desc',
    },
    take: limit || undefined,
  });

  return blinks;
}

// Optionally, you can add more functions like updateBlink, deleteBlink, etc.
