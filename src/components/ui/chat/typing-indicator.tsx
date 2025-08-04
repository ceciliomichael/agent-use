"use client"

import { useState, useEffect } from "react"

export function TypingIndicator() {
  const [dots, setDots] = useState("...")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return ".."
        if (prev === "..") return "."
        return "..."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="text-muted-foreground mr-8 w-full">
        <p className="text-sm">{dots}</p>
      </div>
    </div>
  )
}