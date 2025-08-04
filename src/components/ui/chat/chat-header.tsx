"use client"

import { Bot } from "lucide-react"

export function ChatHeader() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-panel-border">
      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center glow-effect">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div>
        <h3 className="font-semibold text-panel-foreground">AI Assistant</h3>
        <p className="text-xs text-muted-foreground">Ready to generate content</p>
      </div>
      <div className="ml-auto">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}