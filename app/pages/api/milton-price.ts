import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';

// Initialize cache with a standard TTL (Time to Live)
const priceCache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

// Rate limit settings (can be moved to environment variables)
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '60', 10); // max requests
const TIME_FRAME = parseInt(process.env.TIME_FRAME || '60000', 10); // time frame in milliseconds (1 minute)

const requestCounts = new Map<string, { count: number; firstRequestTime: number }>();

// Fetch prices from a simulated API
const fetchPrices = async (): Promise<{ miltonPrice: number; usdcPrice: number; solPrice: number }> => {
  const miltonPrice = Math.random() * (1 - 0.0000001) + 0.1; // Random price between $0.0000001 and $1
  const usdcPrice = 0.999; // Simulated price for USDC
  const solPrice = 155; // Simulated price for SOL

  return {
    miltonPrice: parseFloat(miltonPrice.toFixed(2)),
    usdcPrice,
    solPrice,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const currentTime = Date.now();
    const requestData = requestCounts.get(ip as string) || { count: 0, firstRequestTime: currentTime };

    // Check if we need to reset the request count
    if (currentTime - requestData.firstRequestTime > TIME_FRAME) {
      requestData.count = 0; // Reset count
      requestData.firstRequestTime = currentTime; // Set new start time
    }

    // Rate limit check
    if (requestData.count >= RATE_LIMIT) {
      const cachedPrices = priceCache.get('prices');
      if (cachedPrices) {
        return res.status(429).json({ error: 'Rate limit exceeded. Returning cached prices.', prices: cachedPrices });
      } else {
        return res.status(429).json({ error: 'Rate limit exceeded. No cached prices available.' });
      }
    }

    // Check cache for existing prices
    const cachedPrices = priceCache.get('prices');
    if (cachedPrices) {
      return res.status(200).json(cachedPrices);
    }

    // Fetch new prices
    let prices;
    try {
      prices = await fetchPrices();
    } catch (fetchError) {
      console.error('Error fetching prices:', fetchError);
      // Fallback response if fetching prices fails
      return res.status(500).json({
        error: 'Failed to fetch new prices. Returning cached data if available.',
        prices: cachedPrices || { miltonPrice: null, usdcPrice: null, solPrice: null },
      });
    }

    // Cache the prices
    priceCache.set('prices', prices);
    requestData.count++; // Increment request count
    requestCounts.set(ip as string, requestData); // Update request count

    return res.status(200).json(prices);
  } catch (error) {
    console.error('Internal API Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      prices: { miltonPrice: null, usdcPrice: null, solPrice: null }, // Return null prices on error
    });
  }
}
