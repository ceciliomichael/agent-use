"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { EditorContentProps } from "@/types/code-editor"
import { getLanguageByFilename } from "@/lib/file-utils"
import { cn } from "@/lib/utils"

// Enhanced syntax highlighting patterns
const syntaxPatterns = {
  // TypeScript/JavaScript keywords
  keyword: /\b(function|const|let|var|if|else|for|while|return|import|export|class|interface|type|enum|async|await|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|readonly)\b/g,
  
  // Strings with proper escaping
  string: /(["'`])((?:\\.|(?!\1)[^\\\r\n])*?)\1/g,
  templateString: /`[^`]*`/g,
  
  // Comments
  comment: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
  
  // Numbers (integers, floats, hex, binary)
  number: /\b(?:0x[a-fA-F0-9]+|0b[01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
  
  // Boolean and null values
  boolean: /\b(true|false|null|undefined)\b/g,
  
  // Functions and method calls
  function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g,
  
  // Types (capitalized words)
  type: /\b[A-Z][a-zA-Z0-9_]*\b/g,
  
  // Operators
  operator: /[+\-*/%=<>!&|^~?:]+|\b(?:and|or|not|in|of|instanceof|typeof)\b/g,
  
  // Brackets and punctuation
  bracket: /[{}[\]()]/g,
  punctuation: /[;,.:]/g
}

export function EditorContent({
  content,
  language = 'plaintext',
  onChange,
  onSave,
  readOnly = false,
  theme = 'dark',
  showLineNumbers = true,
  showMinimap = false,
  fontSize = 14,
  tabSize = 2,
  className
}: EditorContentProps) {
  const [localContent, setLocalContent] = useState(content)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const lines = localContent.split('\n')
  const lineCount = lines.length

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    onChange?.(newContent)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSave?.()
    }
    
    // Handle tab insertion
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const spaces = ' '.repeat(tabSize)
      
      const newContent = localContent.substring(0, start) + spaces + localContent.substring(end)
      setLocalContent(newContent)
      onChange?.(newContent)
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + tabSize
      }, 0)
    }
  }, [localContent, onChange, onSave, tabSize])

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  const updateCursorPosition = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const cursorPos = textarea.selectionStart
      const beforeCursor = localContent.substring(0, cursorPos)
      const lines = beforeCursor.split('\n')
      const line = lines.length
      const column = lines[lines.length - 1].length + 1
      
      setCursorPosition({ line, column })
    }
  }, [localContent])

  useEffect(() => {
    updateCursorPosition()
  }, [localContent, updateCursorPosition])

  // Enhanced syntax highlighting for display
  const highlightSyntax = (code: string) => {
    if (language === 'plaintext') return code
    
    let highlighted = code
    
    // Apply syntax highlighting patterns in order of precedence
    highlighted = highlighted.replace(syntaxPatterns.comment, '<span class="text-syntax-comment italic font-medium">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.templateString, '<span class="text-syntax-string font-medium">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.string, '<span class="text-syntax-string font-medium">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.keyword, '<span class="text-syntax-keyword font-semibold">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.function, '<span class="text-syntax-function font-medium">$1</span>')
    highlighted = highlighted.replace(syntaxPatterns.type, '<span class="text-syntax-type font-medium">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.number, '<span class="text-syntax-number font-medium">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.boolean, '<span class="text-syntax-variable font-medium">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.operator, '<span class="text-syntax-operator">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.bracket, '<span class="text-syntax-operator font-semibold">$&</span>')
    highlighted = highlighted.replace(syntaxPatterns.punctuation, '<span class="text-syntax-operator">$&</span>')
    
    return highlighted
  }

  return (
    <div className={cn(
      "flex flex-1 relative bg-editor-bg text-editor-text font-mono overflow-hidden shadow-inner",
      className
    )}>
      {/* Line Numbers */}
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 w-14 bg-gradient-surface border-r border-editor-border overflow-hidden text-right pr-3 py-4 text-editor-line-numbers select-none font-medium shadow-inner"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div 
              key={i + 1} 
              className={cn(
                "leading-6 transition-colors duration-ultra-fast hover:text-accent cursor-default",
                cursorPosition.line === i + 1 && "text-accent font-semibold"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 relative">
        {/* Syntax Highlighted Background (read-only display) */}
        <div
          className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: '1.5',
            tabSize: tabSize
          }}
          dangerouslySetInnerHTML={{ 
            __html: readOnly ? highlightSyntax(localContent) : '' 
          }}
        />

        {/* Textarea for editing */}
        <textarea
          ref={textareaRef}
          value={localContent}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          onKeyUp={updateCursorPosition}
          readOnly={readOnly}
          placeholder="Start typing..."
          className={cn(
            "w-full h-full p-4 bg-transparent text-transparent caret-white resize-none font-mono",
            "editor-scrollbar placeholder:text-muted-foreground placeholder:opacity-50",
            readOnly && "cursor-default"
          )}
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: '1.5',
            tabSize: tabSize,
            outline: 'none !important',
            border: 'none !important',
            boxShadow: 'none !important'
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Actual text overlay for non-read-only mode */}
        {!readOnly && (
          <div
            className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
            style={{ 
              fontSize: `${fontSize}px`, 
              lineHeight: '1.5',
              tabSize: tabSize
            }}
            dangerouslySetInnerHTML={{ 
              __html: highlightSyntax(localContent)
            }}
          />
        )}
      </div>

      {/* Minimap */}
      {showMinimap && (
        <div className="w-16 bg-surface border-l border-code-border p-1 overflow-hidden">
          <div 
            className="text-xs leading-tight text-muted-foreground"
            style={{ fontSize: '8px' }}
          >
            {lines.slice(0, 50).map((line, i) => (
              <div key={i} className="truncate">
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-0 right-0 bg-gradient-surface border-t border-l border-editor-border px-3 py-2 text-xs text-muted-foreground font-medium rounded-tl-lg shadow-md">
        <span className="text-accent font-semibold">Ln {cursorPosition.line}</span>
        <span className="mx-1 text-border">•</span>
        <span className="text-accent font-semibold">Col {cursorPosition.column}</span>
        {language !== 'plaintext' && (
          <>
            <span className="mx-2 text-border">•</span>
            <span className="text-foreground">{getLanguageByFilename(`.${language}`).name}</span>
          </>
        )}
      </div>
    </div>
  )
}