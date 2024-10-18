import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  getRealm,
  getGovernance,
  getTokenOwnerRecordForRealm,
  createProposal, // Assuming a function exists for creating proposals
  Governance, // Assuming Governance type is needed
  Proposal, // Assuming Proposal type is needed
} from '@solana/spl-governance';

// Initialize Solana connection (replace with your RPC URL)
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Define schema for proposal validation
const proposalSchema = z.object({
  realmPubkey: z.string(),
  governancePubkey: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000),
  proposerPubkey: z.string(),
});

// Handle POST requests to create a proposal
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const proposal = proposalSchema.parse(body);

    // Fetch Realm and Governance data
    const realm = await getRealm(connection, new PublicKey(proposal.realmPubkey));
    const governance = await getGovernance(connection, new PublicKey(proposal.governancePubkey));

    // Check if the proposer has enough governance power
    const tokenOwnerRecord = await getTokenOwnerRecordForRealm(
      connection,
      realm.pubkey,
      new PublicKey(proposal.proposerPubkey)
    );

    if (!tokenOwnerRecord || tokenOwnerRecord.governingTokenDepositAmount.isZero()) {
      return NextResponse.json(
        { error: 'Insufficient governance power to create proposal' },
        { status: 403 }
      );
    }

    // Create the proposal on-chain using Solana Realms SDK
    const proposalData: Proposal = {
      title: proposal.title,
      description: proposal.description,
      governance: governance.pubkey,
      realm: realm.pubkey,
      // Include other necessary proposal fields here
    };

    // Call the function to create the proposal (this function should be defined in your SDK)
    const createdProposal = await createProposal(connection, proposalData, tokenOwnerRecord);

    return NextResponse.json(
      { message: 'Proposal created successfully', proposal: createdProposal },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle GET requests to fetch proposals for a given realm
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const realmPubkey = searchParams.get('realmPubkey');

    if (!realmPubkey) {
      return NextResponse.json({ error: 'realmPubkey is required' }, { status: 400 });
    }

    // Fetch Realm data
    const realm = await getRealm(connection, new PublicKey(realmPubkey));

    // Fetch proposals for the given realm from Solana (implement this logic)
    const proposals = await fetchProposalsForRealm(realm.pubkey); // Create this function

    return NextResponse.json({ realm: realm.pubkey.toBase58(), proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Example function to fetch proposals for a given realm (implementation needed)
async function fetchProposalsForRealm(realmPubkey: PublicKey) {
  // TODO: Implement logic to fetch proposals from the governance program
  // This can include querying the proposals associated with the realmPubkey

  // Placeholder: Replace with actual fetching logic
  return [
    { id: '1', title: 'Proposal 1', description: 'Description 1', status: 'Active' },
    { id: '2', title: 'Proposal 2', description: 'Description 2', status: 'Executed' },
  ];
}
