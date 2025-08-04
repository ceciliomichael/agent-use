"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  placeholder?: string
  disabled?: boolean
  onSendMessage?: (message: string) => void
}

export function ChatInput({ 
  placeholder = "Type your message...",
  disabled = false,
  onSendMessage
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || disabled) return

    if (onSendMessage) {
      onSendMessage(inputValue.trim())
    }
    
    setInputValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px' // Reset to single line height
      const scrollHeight = textareaRef.current.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, 24), 120)
      textareaRef.current.style.height = `${newHeight}px`
      
      // Hide scrollbar if content fits in one line
      if (scrollHeight <= 24) {
        textareaRef.current.style.overflowY = 'hidden'
      } else {
        textareaRef.current.style.overflowY = 'auto'
      }
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px'
      const scrollHeight = textareaRef.current.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, 24), 120)
      textareaRef.current.style.height = `${newHeight}px`
      
      // Hide scrollbar if content fits in one line
      if (scrollHeight <= 24) {
        textareaRef.current.style.overflowY = 'hidden'
      } else {
        textareaRef.current.style.overflowY = 'auto'
      }
    }
  }, [inputValue])

  return (
    <div className="px-4 py-3 border-t border-panel-border">
      <div className="relative bg-surface rounded-lg p-3">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full bg-transparent resize-none",
            "px-0 py-0 text-surface-foreground placeholder:text-muted-foreground",
            "leading-normal min-h-[24px] max-h-[120px] mb-2",
            "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ 
            border: 'none', 
            outline: 'none', 
            boxShadow: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none'
          }}
        />
        
        <div className="flex justify-end">
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || disabled}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-full",
              "bg-gradient-primary text-primary-foreground",
              "hover:shadow-lg hover:shadow-primary/25 hover:scale-105",
              "active:scale-95 transition-all duration-200",
              "disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none",
              "focus:outline-none focus:ring-2 focus:ring-accent"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-xs text-muted-foreground">
          Press <span className="font-medium">Enter</span> to send, <span className="font-medium">Shift+Enter</span> for new line
        </p>
      </div>
    </div>
  )
}