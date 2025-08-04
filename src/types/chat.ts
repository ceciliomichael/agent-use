export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isLoading?: boolean
  isStreaming?: boolean
}

export interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  isConnected: boolean
}

export interface AIChatProps {
  className?: string
  placeholder?: string
  disabled?: boolean
  onSendMessage?: (message: string) => void
  messages?: ChatMessage[]
  isTyping?: boolean
  maxHeight?: string
  showTimestamp?: boolean
  autoScroll?: boolean
}

export type MessageRole = "user" | "assistant" | "system"