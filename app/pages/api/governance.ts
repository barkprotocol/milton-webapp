import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const ProposalSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description is required").max(1000, "Description cannot exceed 1000 characters"),
  proposerId: z.string().min(44, "Proposer ID must be at least 44 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty").max(100, "Option cannot exceed 100 characters")).min(2, "At least two options are required").max(10, "Cannot have more than 10 options"),
})

const VoteSchema = z.object({
  proposalId: z.string().uuid("Invalid proposal ID"),
  voterId: z.string().min(44, "Voter ID must be at least 44 characters"),
  optionIndex: z.number().int().nonnegative("Option index must be a non-negative integer"),
})

const ExecuteSchema = z.object({
  proposalId: z.string().uuid("Invalid proposal ID"),
  executorId: z.string().min(44, "Executor ID must be at least 44 characters"),
})

type Proposal = z.infer<typeof ProposalSchema> & {
  id: string
  timestamp: string
  status: 'active' | 'executed' | 'failed'
  votes: { voterId: string; optionIndex: number }[]
}

// API Response Types
type PostResponseData = {
  proposal?: Proposal
  message?: string
}

type GetResponseData = {
  proposals?: Proposal[]
  proposal?: Proposal
}

type ErrorResponseData = {
  error: string
  details?: unknown
}

let proposals: Proposal[] = []

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponseData | GetResponseData | ErrorResponseData>
) {
  try {
    const action = req.query.action as string

    if (req.method === 'POST') {
      if (action === 'propose') {
        const result = ProposalSchema.safeParse(req.body)
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
        }
        const { title, description, proposerId, options } = result.data

        const newProposal: Proposal = {
          id: uuidv4(),
          title,
          description,
          proposerId,
          options,
          timestamp: new Date().toISOString(),
          status: 'active',
          votes: [],
        }
        proposals.push(newProposal)

        return res.status(201).json({ proposal: newProposal })
      } else if (action === 'vote') {
        const result = VoteSchema.safeParse(req.body)
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
        }
        const { proposalId, voterId, optionIndex } = result.data

        const proposal = proposals.find(p => p.id === proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        if (proposal.status !== 'active') {
          return res.status(400).json({ error: 'Proposal is not active' })
        }
        if (optionIndex >= proposal.options.length) {
          return res.status(400).json({ error: 'Invalid option index' })
        }
        if (proposal.votes.some(vote => vote.voterId === voterId)) {
          return res.status(400).json({ error: 'User has already voted' })
        }

        proposal.votes.push({ voterId, optionIndex })
        return res.status(200).json({ message: 'Vote recorded successfully' })
      } else if (action === 'execute') {
        const result = ExecuteSchema.safeParse(req.body)
        if (!result.success) {
          return res.status(400).json({ error: 'Invalid input', details: result.error.issues })
        }
        const { proposalId, executorId } = result.data

        const proposal = proposals.find(p => p.id === proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        if (proposal.status !== 'active') {
          return res.status(400).json({ error: 'Proposal is not active' })
        }

        // Simulate execution logic
        proposal.status = Math.random() > 0.1 ? 'executed' : 'failed'
        return res.status(200).json({ message: `Proposal ${proposal.status}` })
      } else {
        return res.status(400).json({ error: 'Invalid action' })
      }
    } else if (req.method === 'GET') {
      const querySchema = z.object({
        proposalId: z.string().uuid("Invalid proposal ID").optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().max(100).default(10),
      })

      const queryResult = querySchema.safeParse(req.query)
      if (!queryResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.issues })
      }

      const { proposalId, page, limit } = queryResult.data

      if (proposalId) {
        const proposal = proposals.find(p => p.id === proposalId)
        if (!proposal) {
          return res.status(404).json({ error: 'Proposal not found' })
        }
        return res.status(200).json({ proposal })
      }

      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedProposals = proposals.slice(startIndex, endIndex)

      return res.status(200).json({ proposals: paginatedProposals })
    } else {
      res.setHeader('Allow', ['POST', 'GET'])
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('Governance API Error:', error)
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' })
  }
}