'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from '@/components/ui/use-toast'
import { Proposal, fetchProposals } from '@/lib/governance' // Replace with your actual import path

export default function GovernancePage() {
  const { publicKey } = useWallet()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const fetchedProposals = await fetchProposals() // Fetch proposals from your backend or smart contract
        setProposals(fetchedProposals)
      } catch (err) {
        console.error('Error fetching proposals:', err)
        setError('Failed to load proposals. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProposals()
  }, [])

  const handleVote = async (proposalId: string) => {
    if (!publicKey) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to vote on proposals.',
        variant: 'destructive',
      })
      return
    }

    try {
      // Implement your voting logic here
      // await voteOnProposal(proposalId, publicKey.toBase58())
      toast({
        title: 'Vote submitted',
        description: `Your vote for proposal ${proposalId} has been recorded.`,
      })
    } catch (err) {
      console.error('Error submitting vote:', err)
      toast({
        title: 'Voting Error',
        description: 'Failed to submit your vote. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Governance</h1>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <p>Loading proposals...</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id} className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>{proposal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{proposal.description}</p>
                <p>Status: {proposal.status}</p>
                <p>Votes: {proposal.voteCount}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleVote(proposal.id)}>Vote</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
