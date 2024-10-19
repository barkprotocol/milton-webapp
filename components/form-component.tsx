import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type FormData = Record<string, string>

export default function FormComponent() {
  const [formData, setFormData] = useState<FormData>({})

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => {
      const newData = { ...prev }
      if (value !== '') {
        newData[name] = value
      } else {
        delete newData[name]
      }
      return newData
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formData)
    // Handle form submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          name="username"
          placeholder="Enter your username"
          onChange={handleInputChange}
          value={formData.username || ''}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleInputChange}
          value={formData.email || ''}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleInputChange}
          value={formData.password || ''}
        />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}