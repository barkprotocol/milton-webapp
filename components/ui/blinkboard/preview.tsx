'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type PreviewProps = {
  title: string
  description: string
  imageUrl: string
  onActionClick: () => void
}

export default function Preview({ title, description, imageUrl, onActionClick }: PreviewProps) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Simulate image loading time
    const timer = setTimeout(() => setLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-lg max-w-md">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>

        {loaded ? (
          <Image
            src={imageUrl}
            alt={title}
            width={300}
            height={300}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="h-48 w-48 bg-gray-200 animate-pulse rounded-md" />
        )}

        <p className="text-gray-600 text-center">{description}</p>

        <Button onClick={onActionClick} className="w-full">
          Take Action
        </Button>
      </div>
    </div>
  )
}