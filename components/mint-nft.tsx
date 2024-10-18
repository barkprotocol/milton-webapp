'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Image, Upload, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function MintNFT() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "NFT Minted",
      description: "Your NFT has been successfully minted!",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="NFT Name"
        required
        className="w-full"
      />
      <Textarea
        placeholder="NFT Description"
        required
        className="w-full"
      />
      <div>
        <label htmlFor="file-upload" className="cursor-pointer bg-secondary text-secondary-foreground px-4 py-2 rounded-md inline-flex items-center">
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {file && <p className="mt-2 text-sm text-muted-foreground">{file.name}</p>}
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Minting NFT...
          </>
        ) : (
          <>
            Mint NFT
            <Image className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}