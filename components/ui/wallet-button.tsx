'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet } from 'lucide-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

const DynamicWalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
)

export function WalletButton() {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnectOrSelect = useCallback(async () => {
    if (connecting) return

    if (wallet) {
      setIsConnecting(true)
      try {
        await connect()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      setVisible(true)
    }
  }, [wallet, connect, connecting, setVisible])

  const handleDisconnect = useCallback(async () => {
    if (disconnect) {
      await disconnect()
    }
  }, [disconnect])

  const buttonClasses = cn(
    "bg-primary text-primary-foreground hover:bg-primary/90",
    "font-medium px-4 py-2 rounded-md transition-all duration-200 ease-in-out",
    "transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
  )

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className={buttonClasses}
        disabled
      >
        <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
        <span>Connect Wallet</span>
      </Button>
    )
  }

  if (connected && publicKey) {
    return (
      <Button
        variant="outline"
        className={buttonClasses}
        onClick={handleDisconnect}
      >
        <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Disconnect wallet</span>
        <span aria-hidden="true">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={buttonClasses}
      onClick={handleConnectOrSelect}
      disabled={isConnecting || connecting}
    >
      {isConnecting || connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Connect Wallet</span>
        </>
      )}
    </Button>
  )
}