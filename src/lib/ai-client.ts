import { ChatMessage } from "@/types/chat"
import { getDefaultSystemPrompt } from "@/prompts/prompts"

export interface AIResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class AIClient {
  private baseUrl: string
  private apiKey: string
  private model: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || ""
    this.apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || ""
    this.model = process.env.NEXT_PUBLIC_AI_MODEL || ""
  }

  private prepareMessages(messages: ChatMessage[]): any[] {
    const systemPrompt = getDefaultSystemPrompt()
    const systemMessage = {
      role: "system",
      content: systemPrompt.prompt
    }

    const userMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    return [systemMessage, ...userMessages]
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.prepareMessages(messages),
          temperature: 0.7,
          max_tokens: 16000,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const data: AIResponse = await response.json()
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content || "Sorry, I couldn't generate a response."
      }
      
      throw new Error("No response from AI")
    } catch (error) {
      console.error("AI Client Error:", error)
      throw error
    }
  }

  async *sendMessageStream(messages: ChatMessage[]): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.prepareMessages(messages),
          temperature: 0.7,
          max_tokens: 16000,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const decoder = new TextDecoder()
      let buffer = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                return
              }

              try {
                const parsed = JSON.parse(data)
                const content = parsed.choices?.[0]?.delta?.content
                if (content) {
                  yield content
                }
              } catch (e) {
                // Skip invalid JSON lines
                continue
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      console.error("AI Client Streaming Error:", error)
      throw error
    }
  }

  isConfigured(): boolean {
    return !!(this.baseUrl && this.apiKey && this.model)
  }
}