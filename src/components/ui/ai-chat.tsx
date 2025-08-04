"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ChatMessage, AIChatProps } from "@/types/chat"
import { Message } from "./chat/message"
import { TypingIndicator } from "./chat/typing-indicator"
import { ChatInput } from "./chat/chat-input"
import { ChatHeader } from "./chat/chat-header"
import { EmptyState } from "./chat/empty-state"
import { AIClient } from "@/lib/ai-client"

// Mock AI responses for demo
const mockResponses = [
  "I can help you generate amazing content for the main panel. What would you like me to create?",
  "Great idea! I can generate components, write code, create designs, or help with any creative content you need.",
  "I'm designed to work seamlessly with the main panel. Just tell me what you want to create and I'll generate it for you.",
  "Perfect! The main panel is ready to display whatever content we create together. What's your vision?",
  "I can create React components, write documentation, generate designs, or help with any development tasks.",
  "The integration between this chat and the main panel will be seamless. What would you like to build?",
  "I'm here to turn your ideas into reality. Whether it's code, content, or creative designs - just let me know!",
]

export function AIChat({ 
  className,
  placeholder = "Type your message...",
  disabled = false,
  onSendMessage,
  messages: externalMessages,
  isTyping = false,
  maxHeight = "calc(100vh - 2rem)",
  showTimestamp = false,
  autoScroll = true,
  ...props 
}: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(externalMessages || [])
  const [isLocalTyping, setIsLocalTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiClient = useRef(new AIClient())

  // Check if any message is currently streaming
  const hasStreamingMessage = messages.some(msg => msg.isStreaming)

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, isLocalTyping, hasStreamingMessage])

  useEffect(() => {
    if (externalMessages) {
      setMessages(externalMessages)
    }
  }, [externalMessages])

  const handleSendMessage = async (messageContent: string) => {
    if (disabled) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLocalTyping(true)

    try {
      if (onSendMessage) {
        onSendMessage(messageContent)
        // Still show typing indicator even with custom handler
        setTimeout(() => {
          setIsLocalTyping(false)
        }, 1200)
      } else if (aiClient.current.isConfigured()) {
        // Use real AI API with streaming
        const updatedMessages = [...messages, userMessage]
        
        // Show typing indicator for a moment before streaming starts
        setTimeout(async () => {
          // Create initial streaming message
          const streamingMessageId = `ai-${Date.now()}`
          const streamingMessage: ChatMessage = {
            id: streamingMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
            isStreaming: true,
          }
          
          setMessages(prev => [...prev, streamingMessage])
          setIsLocalTyping(false)
          
          // Stream the response
          let fullContent = ""
          try {
            for await (const chunk of aiClient.current.sendMessageStream(updatedMessages)) {
              fullContent += chunk
              setMessages(prev => prev.map(msg => 
                msg.id === streamingMessageId 
                  ? { ...msg, content: fullContent }
                  : msg
              ))
            }
            
            // Mark streaming as complete
            setMessages(prev => prev.map(msg => 
              msg.id === streamingMessageId 
                ? { ...msg, isStreaming: false }
                : msg
            ))
          } catch (error) {
            console.error("Streaming error:", error)
            // Fallback to regular API call
            try {
              const aiResponseContent = await aiClient.current.sendMessage(updatedMessages)
              setMessages(prev => prev.map(msg => 
                msg.id === streamingMessageId 
                  ? { ...msg, content: aiResponseContent, isStreaming: false }
                  : msg
              ))
            } catch (fallbackError) {
              setMessages(prev => prev.map(msg => 
                msg.id === streamingMessageId 
                  ? { ...msg, content: "Sorry, I'm having trouble responding. Please try again.", isStreaming: false }
                  : msg
              ))
            }
          }
        }, 800) // Show typing animation for 800ms before streaming starts
      } else {
        // Fallback to mock responses if not configured
        setTimeout(() => {
          const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
          const aiResponse: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "assistant", 
            content: randomResponse,
            timestamp: new Date(),
          }
          setMessages(prev => [...prev, aiResponse])
          setIsLocalTyping(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Fallback to error message
      const errorResponse: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the AI service. Please check if LM Studio is running and try again.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorResponse])
      setIsLocalTyping(false)
    }
  }

  return (
    <div 
      className={cn("flex flex-col h-full", className)}
      style={{ maxHeight }}
      {...props}
    >
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-panel-border scrollbar-track-transparent relative">
        {messages.length === 0 && !(isTyping || isLocalTyping || hasStreamingMessage) && <EmptyState />}
        
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <Message 
              key={message.id} 
              message={message} 
              showTimestamp={showTimestamp} 
            />
          ))}

          {/* Typing Indicator - only show when waiting for response, not when streaming */}
          {(isTyping || isLocalTyping) && !hasStreamingMessage && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput 
        placeholder={placeholder}
        disabled={disabled}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}