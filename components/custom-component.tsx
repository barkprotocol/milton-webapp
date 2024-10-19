import React from 'react'
import { cn } from "@/lib/utils"

interface CustomComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add any additional props specific to your component here
}

const CustomComponent: React.FC<CustomComponentProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("custom-component", className)} {...props}>
      {children}
    </div>
  )
}

export default CustomComponent