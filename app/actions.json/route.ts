import { NextResponse } from 'next/server'

// Define the structure of an action
interface Action {
  id: string
  type: string
  name: string
  description: string
  parameters: {
    [key: string]: {
      type: string
      description: string
      required: boolean
    }
  }
}

// Sample actions (replace with your actual actions)
const actions: Action[] = [
  {
    id: 'create_blink',
    type: 'blink',
    name: 'Create Blink',
    description: 'Create a new Blink for crowdfunding, token swap, donation, or NFT sale',
    parameters: {
      title: {
        type: 'string',
        description: 'Title of the Blink',
        required: true
      },
      description: {
        type: 'string',
        description: 'Description of the Blink',
        required: false
      },
      type: {
        type: 'string',
        description: 'Type of the Blink (crowdfunding, token_swap, donation, nft_sale)',
        required: true
      },
      goal: {
        type: 'number',
        description: 'Funding goal (if applicable)',
        required: false
      }
    }
  },
  {
    id: 'send_gift',
    type: 'gift',
    name: 'Send Gift',
    description: 'Send a gift of tokens to another user',
    parameters: {
      recipientAddress: {
        type: 'string',
        description: 'Recipient\'s wallet address',
        required: true
      },
      amount: {
        type: 'number',
        description: 'Amount of tokens to send',
        required: true
      },
      tokenMint: {
        type: 'string',
        description: 'Token mint address',
        required: true
      },
      message: {
        type: 'string',
        description: 'Optional message to accompany the gift',
        required: false
      }
    }
  }
]

export async function GET() {
  return NextResponse.json(actions)
}