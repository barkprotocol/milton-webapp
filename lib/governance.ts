import { Connection, PublicKey } from '@solana/web3.js'
import { Realm, Proposal } from '@solana/spl-governance'

const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
const connection = new Connection(SOLANA_RPC_ENDPOINT)

// Replace with your governance realm and program IDs
const GOVERNANCE_REALM_ID = new PublicKey('YOUR_REALM_ID')
const GOVERNANCE_PROGRAM_ID = new PublicKey('YOUR_GOVERNANCE_PROGRAM_ID')

export async function fetchProposals(): Promise<Proposal[]> {
  try {
    const realm = await Realm.fetch(connection, GOVERNANCE_REALM_ID)
    const proposals = await realm.getProposals() // Fetch all proposals from the realm
    return proposals
  } catch (error) {
    console.error('Error fetching proposals:', error)
    throw new Error('Failed to fetch proposals')
  }
}

export async function voteOnProposal(proposalId: string, voterPublicKey: string, vote: boolean) {
  try {
    const proposal = new PublicKey(proposalId)
    const voter = new PublicKey(voterPublicKey)

    // Create and send the vote transaction
    const transaction = await Proposal.createVoteTransaction(
      connection,
      GOVERNANCE_PROGRAM_ID,
      proposal,
      voter,
      vote
    )
    
    const txid = await connection.sendTransaction(transaction, [voter])
    await connection.confirmTransaction(txid)

    console.log('Vote submitted successfully:', txid)
    return txid
  } catch (error) {
    console.error('Error submitting vote:', error)
    throw new Error('Failed to submit vote')
  }
}
