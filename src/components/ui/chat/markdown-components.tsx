"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const languageLabel = language || "code"
  
  // Split code into lines and add line numbers
  const lines = children.split('\n')
  const maxLineNumber = lines.length
  const lineNumberWidth = String(maxLineNumber).length

  return (
    <div className="relative group my-4">
      {/* Language Label & Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 bg-code-bg border border-code-border rounded-t-lg">
        <span className="text-xs font-medium text-accent uppercase tracking-wider">
          {languageLabel}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-muted-foreground hover:text-accent transition-colors px-2 py-1 rounded hover:bg-surface-hover"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      {/* Code Content with Line Numbers */}
      <div className="bg-code-bg border-x border-b border-code-border rounded-b-lg overflow-x-auto">
        <pre className="flex text-sm leading-relaxed">
          {/* Line Numbers */}
          <div className="flex-shrink-0 px-3 py-4 bg-code-bg border-r border-code-border text-muted-foreground select-none">
            {lines.map((_, index) => (
              <div key={index} className="text-right" style={{ minWidth: `${lineNumberWidth}ch` }}>
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Code Content */}
          <div className="flex-1 px-4 py-4">
            <code className={cn("text-code-text block", className)}>
              {lines.map((line, index) => (
                <div key={index} className="min-h-[1.25rem]">
                  {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                </div>
              ))}
            </code>
          </div>
        </pre>
      </div>
    </div>
  )
}

interface InlineCodeProps {
  children: string
}

export function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="bg-inline-code-bg text-inline-code-text px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  )
}

interface BlockquoteProps {
  children: React.ReactNode
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="border-l-4 border-blockquote-border bg-blockquote-bg pl-4 pr-4 py-3 my-4 rounded-r-lg">
      <div className="text-muted-foreground italic">
        {children}
      </div>
    </blockquote>
  )
}

interface LinkProps {
  href: string
  children: React.ReactNode
}

export function Link({ href, children }: LinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('https')
  
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="text-link-color hover:text-link-hover font-medium transition-all duration-fast border-b border-transparent hover:border-link-hover"
    >
      {children}
      {isExternal && (
        <span className="ml-1 text-xs opacity-60">↗</span>
      )}
    </a>
  )
}

interface TableProps {
  children: React.ReactNode
}

export function Table({ children }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse bg-surface border border-table-border rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-table-header-bg">
      {children}
    </thead>
  )
}

interface TableRowProps {
  children: React.ReactNode
}

export function TableRow({ children }: TableRowProps) {
  return (
    <tr className="hover:bg-surface-hover transition-colors">
      {children}
    </tr>
  )
}

interface TableCellProps {
  children: React.ReactNode
  isHeader?: boolean
}

export function TableCell({ children, isHeader = false }: TableCellProps) {
  const Component = isHeader ? 'th' : 'td'
  
  return (
    <Component className={cn(
      "px-4 py-3 text-left border-b border-table-border",
      isHeader && "font-semibold text-accent border-b-2 border-accent"
    )}>
      {children}
    </Component>
  )
}

interface ListProps {
  children: React.ReactNode
  ordered?: boolean
}

export function List({ children, ordered = false }: ListProps) {
  const Component = ordered ? 'ol' : 'ul'
  
  return (
    <Component className={cn(
      "my-4 pl-6 space-y-2",
      ordered ? "list-decimal" : "list-disc"
    )}>
      {children}
    </Component>
  )
}

interface ListItemProps {
  children: React.ReactNode
}

export function ListItem({ children }: ListItemProps) {
  return (
    <li className="text-foreground leading-relaxed">
      {children}
    </li>
  )
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
}

export function Heading({ level, children }: HeadingProps) {
  const styles = {
    1: "text-2xl font-bold gradient-text mb-4 mt-6",
    2: "text-xl font-semibold text-accent mb-3 mt-5", 
    3: "text-lg font-semibold text-accent mb-3 mt-4",
    4: "text-base font-semibold text-foreground mb-2 mt-4",
    5: "text-sm font-semibold text-foreground mb-2 mt-3",
    6: "text-xs font-semibold text-muted-foreground mb-2 mt-3 uppercase tracking-wider"
  }
  
  switch (level) {
    case 1:
      return <h1 className={styles[1]}>{children}</h1>
    case 2:
      return <h2 className={styles[2]}>{children}</h2>
    case 3:
      return <h3 className={styles[3]}>{children}</h3>
    case 4:
      return <h4 className={styles[4]}>{children}</h4>
    case 5:
      return <h5 className={styles[5]}>{children}</h5>
    case 6:
      return <h6 className={styles[6]}>{children}</h6>
    default:
      return <h1 className={styles[1]}>{children}</h1>
  }
}

interface HorizontalRuleProps {}

export function HorizontalRule({}: HorizontalRuleProps) {
  return (
    <hr className="my-8 border-none h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  )
}