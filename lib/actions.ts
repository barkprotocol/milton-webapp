'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = createClient(cookies())

  const walletAddress = formData.get('walletAddress') as string
  const signedMessage = formData.get('signedMessage') as string
  const message = formData.get('message') as string

  if (!walletAddress || !signedMessage || !message) {
    return { error: 'Missing required fields' }
  }

  try {
    // Verify the signed message on the server
    const isValidSignature = await verifySignature(walletAddress, signedMessage, message)
    if (!isValidSignature) {
      return { error: 'Invalid signature' }
    }

    // Sign in or create user with wallet address
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'solana',
      options: {
        redirectTo: '/',
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, url: data.url }
  } catch (error) {
    console.error('Error during Solana sign-in:', error)
    return { error: 'An unexpected error occurred during sign-in' }
  }
}

async function verifySignature(walletAddress: string, signedMessage: string, message: string): Promise<boolean> {
  // Implement signature verification logic here
  // This is a placeholder implementation
  console.log('Verifying signature for wallet:', walletAddress)
  console.log('Signed message:', signedMessage)
  console.log('Original message:', message)

  // In a real implementation, you would use a library like @solana/web3.js to verify the signature
  // For example:
  // import { PublicKey, verify } from '@solana/web3.js'
  // const publicKey = new PublicKey(walletAddress)
  // const messageUint8 = new TextEncoder().encode(message)
  // const signatureUint8 = new Uint8Array(Buffer.from(signedMessage, 'base64'))
  // return verify(publicKey, messageUint8, signatureUint8)

  return true // Placeholder: always return true for demonstration purposes
}