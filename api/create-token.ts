import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId } = req.body

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    )

    res.status(200).json({ token })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}