"use client"

import { useState } from "react"
import { EditorTabsProps } from "@/types/code-editor"
import { getLanguageByFilename } from "@/lib/file-utils"
import { DynamicIcon, X, Plus, MoreHorizontal } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function EditorTabs({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabMove,
  maxTabs = 10,
  className
}: EditorTabsProps) {
  const [draggedTab, setDraggedTab] = useState<string | null>(null)

  const handleTabClick = (tabId: string) => {
    onTabSelect?.(tabId)
  }

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation()
    onTabClose?.(tabId)
  }

  const handleDragStart = (e: React.DragEvent, tabId: string) => {
    setDraggedTab(tabId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetTabId: string) => {
    e.preventDefault()
    
    if (draggedTab && draggedTab !== targetTabId) {
      const fromIndex = tabs.findIndex(tab => tab.id === draggedTab)
      const toIndex = tabs.findIndex(tab => tab.id === targetTabId)
      
      if (fromIndex !== -1 && toIndex !== -1) {
        onTabMove?.(fromIndex, toIndex)
      }
    }
    
    setDraggedTab(null)
  }

  const handleDragEnd = () => {
    setDraggedTab(null)
  }

  if (tabs.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center h-10 bg-surface border-b border-panel-border",
        className
      )}>
        <span className="text-sm text-muted-foreground">No files open</span>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex items-center bg-surface border-b border-panel-border overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border",
      className
    )}>
      {tabs.map((tab) => {
        const language = getLanguageByFilename(tab.title)
        const isActive = tab.id === activeTabId
        const isDragging = draggedTab === tab.id
        
        return (
          <div
            key={tab.id}
            className={cn(
              "flex items-center min-w-0 max-w-52 h-10 px-3 relative cursor-pointer smooth-transition group",
              isActive 
                ? "bg-editor-tab-active text-foreground" 
                : "bg-editor-tab-inactive hover:bg-editor-tab-hover text-muted-foreground",
              isDragging && "opacity-50",
              "select-none"
            )}
            draggable
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tab.id)}
            onDragEnd={handleDragEnd}
            onClick={() => handleTabClick(tab.id)}
            title={tab.filePath}
          >
            {/* File Icon */}
            <div className="w-4 h-4 flex items-center justify-center mr-2 flex-shrink-0">
              <DynamicIcon name={language.icon} size={14} className="text-muted-foreground" />
            </div>

            {/* File Name */}
            <div className="flex-1 min-w-0">
              <span className={cn(
                "text-sm truncate block",
                tab.isDirty && "italic"
              )}>
                {tab.title}
                {tab.isDirty && "*"}
              </span>
            </div>

            {/* Close Button */}
            {tab.canClose !== false && (
              <button
                onClick={(e) => handleTabClose(e, tab.id)}
                className={cn(
                  "w-4 h-4 flex items-center justify-center ml-2 rounded flex-shrink-0 transition-colors duration-fast",
                  "opacity-0 group-hover:opacity-100",
                  isActive && "opacity-100",
                  "hover:bg-surface-hover hover:text-foreground"
                )}
                title="Close"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )
      })}

      {/* New Tab Button */}
      {tabs.length < maxTabs && (
        <button
          onClick={() => onTabSelect?.('new')}
          className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors duration-fast border-l border-panel-border"
          title="New Tab"
        >
          <Plus size={14} />
        </button>
      )}

      {/* Overflow Indicator */}
      {tabs.length >= maxTabs && (
        <div className="w-10 h-10 flex items-center justify-center text-muted-foreground border-l border-panel-border">
          <MoreHorizontal size={12} />
        </div>
      )}
    </div>
  )
}