"use client"

import { cn } from "@/lib/utils"
import { ChatMessage } from "@/types/chat"
import ReactMarkdown from "react-markdown"
import { 
  CodeBlock, 
  InlineCode, 
  Blockquote, 
  Link, 
  Table, 
  TableHeader, 
  TableRow, 
  TableCell, 
  List, 
  ListItem, 
  Heading, 
  HorizontalRule 
} from "./markdown-components"

interface MessageProps {
  message: ChatMessage
  showTimestamp?: boolean
}

export function Message({ message, showTimestamp = false }: MessageProps) {
  const getUserMessageStyles = () => {
    return "bg-primary text-primary-foreground rounded-lg p-3 panel-transition hover:scale-[1.02]"
  }

  const getAIMessageStyles = () => {
    return "text-panel-foreground"
  }

  const getSystemMessageStyles = () => {
    return "bg-accent/20 text-accent-foreground text-center rounded-lg p-3"
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className={cn("w-full break-words", getUserMessageStyles())}>
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : undefined
                  const isInline = !className || !match
                  
                  return isInline ? (
                    <InlineCode>{String(children).replace(/\n$/, '')}</InlineCode>
                  ) : (
                    <CodeBlock language={language} className={className}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  )
                },
                blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
                a: ({ href, children }) => <Link href={href || ''}>{children}</Link>,
                table: ({ children }) => <Table>{children}</Table>,
                thead: ({ children }) => <TableHeader>{children}</TableHeader>,
                tr: ({ children }) => <TableRow>{children}</TableRow>,
                th: ({ children }) => <TableCell isHeader>{children}</TableCell>,
                td: ({ children }) => <TableCell>{children}</TableCell>,
                ul: ({ children }) => <List>{children}</List>,
                ol: ({ children }) => <List ordered>{children}</List>,
                li: ({ children }) => <ListItem>{children}</ListItem>,
                h1: ({ children }) => <Heading level={1}>{children}</Heading>,
                h2: ({ children }) => <Heading level={2}>{children}</Heading>,
                h3: ({ children }) => <Heading level={3}>{children}</Heading>,
                h4: ({ children }) => <Heading level={4}>{children}</Heading>,
                h5: ({ children }) => <Heading level={5}>{children}</Heading>,
                h6: ({ children }) => <Heading level={6}>{children}</Heading>,
                hr: () => <HorizontalRule />,
                p: ({ children }) => <p className="text-sm leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-primary-foreground">{children}</strong>,
                em: ({ children }) => <em className="italic text-accent">{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          {showTimestamp && (
            <p className="text-xs opacity-60 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    )
  }

  if (message.role === "system") {
    return (
      <div className="flex justify-center animate-fade-in">
        <div className={cn("w-full break-words", getSystemMessageStyles())}>
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : undefined
                  const isInline = !className || !match
                  
                  return isInline ? (
                    <InlineCode>{String(children).replace(/\n$/, '')}</InlineCode>
                  ) : (
                    <CodeBlock language={language} className={className}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  )
                },
                blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
                a: ({ href, children }) => <Link href={href || ''}>{children}</Link>,
                p: ({ children }) => <p className="my-2 text-sm leading-relaxed text-center">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic text-accent">{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          {showTimestamp && (
            <p className="text-xs opacity-60 mt-2 text-center">
              {message.timestamp.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    )
  }

  // AI Assistant message - enhanced markdown with sophisticated styling
  return (
    <div className="flex justify-start animate-fade-in">
      <div className={cn("w-full break-words", getAIMessageStyles())}>
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              code: ({ node, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '')
                const language = match ? match[1] : undefined
                const isInline = !className || !match
                
                return isInline ? (
                  <InlineCode>{String(children).replace(/\n$/, '')}</InlineCode>
                ) : (
                  <CodeBlock language={language} className={className}>
                    {String(children).replace(/\n$/, '')}
                  </CodeBlock>
                )
              },
              blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
              a: ({ href, children }) => <Link href={href || ''}>{children}</Link>,
              table: ({ children }) => <Table>{children}</Table>,
              thead: ({ children }) => <TableHeader>{children}</TableHeader>,
              tr: ({ children }) => <TableRow>{children}</TableRow>,
              th: ({ children }) => <TableCell isHeader>{children}</TableCell>,
              td: ({ children }) => <TableCell>{children}</TableCell>,
              ul: ({ children }) => <List>{children}</List>,
              ol: ({ children }) => <List ordered>{children}</List>,
              li: ({ children }) => <ListItem>{children}</ListItem>,
              h1: ({ children }) => <Heading level={1}>{children}</Heading>,
              h2: ({ children }) => <Heading level={2}>{children}</Heading>,
              h3: ({ children }) => <Heading level={3}>{children}</Heading>,
              h4: ({ children }) => <Heading level={4}>{children}</Heading>,
              h5: ({ children }) => <Heading level={5}>{children}</Heading>,
              h6: ({ children }) => <Heading level={6}>{children}</Heading>,
              hr: () => <HorizontalRule />,
              p: ({ children }) => <p className="my-2 text-sm leading-relaxed text-panel-foreground">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              em: ({ children }) => <em className="italic text-accent">{children}</em>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {showTimestamp && (
          <p className="text-xs opacity-60 mt-2 text-muted-foreground">
            {message.timestamp.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  )
}