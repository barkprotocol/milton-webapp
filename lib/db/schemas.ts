import { z } from 'zod'

// Blink schema
export const BlinkSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(280),
  userId: z.string().uuid(),
  tags: z.array(z.string()).max(5).optional(),
  timestamp: z.string().datetime(),
  likes: z.number().nonnegative().default(0),
  reblinks: z.number().nonnegative().default(0),
  replies: z.array(z.string().uuid()).optional(),
})

export type Blink = z.infer<typeof BlinkSchema>

// Transaction schema
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  fromAddress: z.string().min(32).max(44),
  toAddress: z.string().min(32).max(44),
  amount: z.number().positive(),
  currency: z.enum(['USDC', 'SOL', 'MILTON', 'SPL']),
  memo: z.string().max(100).optional(),
  timestamp: z.string().datetime(),
  status: z.enum(['pending', 'completed', 'failed']),
  fee: z.number().nonnegative(),
  blockNumber: z.number().int().positive().optional(),
})

export type Transaction = z.infer<typeof TransactionSchema>

// Payment schema
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(['USDC', 'SOL', 'MILTON']),
  description: z.string().max(200).optional(),
  timestamp: z.string().datetime(),
  status: z.enum(['pending', 'completed', 'failed']),
  paymentMethod: z.enum(['wallet', 'credit_card', 'bank_transfer']),
  transactionId: z.string().uuid().optional(),
})

export type Payment = z.infer<typeof PaymentSchema>

// Donation schema
export const DonationSchema = z.object({
  id: z.string().uuid(),
  donorId: z.string().uuid(),
  recipientId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(['USDC', 'SOL', 'MILTON']),
  message: z.string().max(500).optional(),
  anonymous: z.boolean().default(false),
  timestamp: z.string().datetime(),
  status: z.enum(['pending', 'completed', 'failed']),
  transactionId: z.string().uuid().optional(),
})

export type Donation = z.infer<typeof DonationSchema>

// Governance Proposal schema
export const GovernanceProposalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(2000),
  proposerId: z.string().uuid(),
  options: z.array(z.string().min(1).max(100)).min(2).max(10),
  status: z.enum(['draft', 'active', 'passed', 'rejected', 'executed']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  quorum: z.number().int().positive(),
  votesFor: z.record(z.number().int().nonnegative()),
  totalVotes: z.number().int().nonnegative(),
})

export type GovernanceProposal = z.infer<typeof GovernanceProposalSchema>

// Vote schema
export const VoteSchema = z.object({
  id: z.string().uuid(),
  proposalId: z.string().uuid(),
  voterId: z.string().uuid(),
  optionIndex: z.number().int().nonnegative(),
  voteWeight: z.number().positive(),
  timestamp: z.string().datetime(),
})

export type Vote = z.infer<typeof VoteSchema>

// Gift schema
export const GiftSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string().uuid(),
  recipientId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  message: z.string().max(500).optional(),
  scheduleDate: z.string().datetime().optional(),
  status: z.enum(['pending', 'sent', 'received', 'cancelled']),
  timestamp: z.string().datetime(),
  expirationDate: z.string().datetime().optional(),
  transactionId: z.string().uuid().optional(),
})

export type Gift = z.infer<typeof GiftSchema>

// Swap schema
export const SwapSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fromToken: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  toToken: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  fromAmount: z.number().positive(),
  estimatedToAmount: z.number().positive(),
  actualToAmount: z.number().positive().optional(),
  slippage: z.number().min(0).max(100),
  status: z.enum(['pending', 'completed', 'failed']),
  timestamp: z.string().datetime(),
  transactionId: z.string().uuid().optional(),
  fee: z.number().nonnegative(),
  exchangeRate: z.number().positive(),
})

export type Swap = z.infer<typeof SwapSchema>

// Mint schema
export const MintSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  toAddress: z.string().min(32).max(44),
  amount: z.number().positive(),
  name: z.string().min(1).max(50),
  symbol: z.string().min(1).max(10),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  timestamp: z.string().datetime(),
  status: z.enum(['pending', 'completed', 'failed']),
  transactionId: z.string().uuid().optional(),
  tokenType: z.enum(['fungible', 'non-fungible']),
  totalSupply: z.number().int().positive(),
})

export type Mint = z.infer<typeof MintSchema>

// User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  walletAddress: z.string().min(32).max(44),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  profilePicture: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  isVerified: z.boolean().default(false),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  lastLogin: z.string().datetime().optional(),
})

export type User = z.infer<typeof UserSchema>

// Token Balance schema
export const TokenBalanceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']),
  balance: z.number().nonnegative(),
  lastUpdated: z.string().datetime(),
  pendingTransactions: z.array(z.string().uuid()).optional(),
})

export type TokenBalance = z.infer<typeof TokenBalanceSchema>

// Notification schema
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['transaction', 'mention', 'like', 'reblink', 'gift', 'system']),
  content: z.string().max(500),
  isRead: z.boolean().default(false),
  timestamp: z.string().datetime(),
  relatedId: z.string().uuid().optional(),
  action: z.string().optional(),
})

export type Notification = z.infer<typeof NotificationSchema>

// Referral schema
export const ReferralSchema = z.object({
  id: z.string().uuid(),
  referrerId: z.string().uuid(),
  referredId: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'expired']),
  reward: z.number().nonnegative().optional(),
  rewardCurrency: z.enum(['USDC', 'SOL', 'MILTON', 'BARK']).optional(),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
})

export type Referral = z.infer<typeof ReferralSchema>

// API Key schema
export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  key: z.string().min(32).max(64),
  name: z.string().min(1).max(50),
  permissions: z.array(z.enum(['read', 'write', 'delete'])),
  createdAt: z.string().datetime(),
  lastUsed: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
})

export type ApiKey = z.infer<typeof ApiKeySchema>
