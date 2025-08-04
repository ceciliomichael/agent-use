"use client"

import { useState, useCallback, useEffect } from "react"
import { CodeEditorProps, EditorTab } from "@/types/code-editor"
import { EditorTabs } from "./editor-tabs"
import { EditorContent } from "./editor-content"
import { getLanguageByFilename, getDefaultFileContent } from "@/lib/file-utils"
import { FileText } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function CodeEditor({
  tabs = [],
  activeTabId,
  onTabChange,
  onTabClose,
  onContentChange,
  onSave,
  onNewTab,
  defaultContent = '',
  className,
  height = 'h-full'
}: CodeEditorProps) {
  const [editorTabs, setEditorTabs] = useState<EditorTab[]>(tabs)
  const [currentTabId, setCurrentTabId] = useState<string>(
    activeTabId || (tabs.length > 0 ? tabs[0].id : '')
  )

  // Update tabs when props change
  useEffect(() => {
    setEditorTabs(tabs)
  }, [tabs])

  // Update active tab when props change
  useEffect(() => {
    if (activeTabId) {
      setCurrentTabId(activeTabId)
    }
  }, [activeTabId])

  const currentTab = editorTabs.find(tab => tab.id === currentTabId)

  const handleTabSelect = useCallback((tabId: string) => {
    if (tabId === 'new') {
      onNewTab?.()
      return
    }
    
    setCurrentTabId(tabId)
    onTabChange?.(tabId)
  }, [onTabChange, onNewTab])

  const handleTabClose = useCallback((tabId: string) => {
    const tabToClose = editorTabs.find(tab => tab.id === tabId)
    
    if (tabToClose?.isDirty) {
      const shouldClose = confirm(`"${tabToClose.title}" has unsaved changes. Close without saving?`)
      if (!shouldClose) return
    }
    
    setEditorTabs(prev => prev.filter(tab => tab.id !== tabId))
    
    // Switch to another tab if the closed tab was active
    if (tabId === currentTabId) {
      const remainingTabs = editorTabs.filter(tab => tab.id !== tabId)
      const newActiveTab = remainingTabs.length > 0 ? remainingTabs[0] : null
      setCurrentTabId(newActiveTab?.id || '')
      if (newActiveTab) {
        onTabChange?.(newActiveTab.id)
      }
    }
    
    onTabClose?.(tabId)
  }, [editorTabs, currentTabId, onTabChange, onTabClose])

  const handleTabMove = useCallback((fromIndex: number, toIndex: number) => {
    setEditorTabs(prev => {
      const newTabs = [...prev]
      const [movedTab] = newTabs.splice(fromIndex, 1)
      newTabs.splice(toIndex, 0, movedTab)
      return newTabs
    })
  }, [])

  const handleContentChange = useCallback((content: string) => {
    if (!currentTab) return
    
    setEditorTabs(prev => prev.map(tab => 
      tab.id === currentTabId 
        ? { ...tab, content, isDirty: content !== tab.content }
        : tab
    ))
    
    onContentChange?.(currentTabId, content)
  }, [currentTab, currentTabId, onContentChange])

  const handleSave = useCallback(() => {
    if (!currentTab) return
    
    setEditorTabs(prev => prev.map(tab => 
      tab.id === currentTabId 
        ? { ...tab, isDirty: false }
        : tab
    ))
    
    onSave?.(currentTabId, currentTab.content)
  }, [currentTab, currentTabId, onSave])

  if (editorTabs.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center bg-gradient-panel border border-panel-border text-center p-8 relative overflow-hidden rounded-r-lg",
        height,
        className
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-glow" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-surface border border-panel-border-soft flex items-center justify-center mb-6 shadow-lg">
            <FileText size={36} className="text-accent" />
          </div>
          <div className="text-xl font-semibold text-foreground mb-3">
            No Files Open
          </div>
          <div className="text-sm text-muted-foreground mb-6 max-w-md">
            Open a file from the explorer or create a new one to start coding with our enhanced editor
          </div>
          <button
            onClick={() => onNewTab?.()}
            className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg hover:shadow-glow-soft transition-all duration-fast font-medium"
          >
            Create New File
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col bg-gradient-panel border border-panel-border-soft overflow-hidden shadow-md rounded-r-lg",
      height,
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-panel-border bg-surface/30">
        <div className="flex items-center space-x-2">
          <FileText size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Code Editor</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {editorTabs.length} file{editorTabs.length !== 1 ? 's' : ''} open
        </div>
      </div>

      {/* Tabs */}
      <EditorTabs
        tabs={editorTabs}
        activeTabId={currentTabId}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onTabMove={handleTabMove}
      />

      {/* Editor Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {currentTab ? (
          <EditorContent
            content={currentTab.content}
            language={currentTab.language || getLanguageByFilename(currentTab.title).monacoLanguage}
            onChange={handleContentChange}
            onSave={handleSave}
            showLineNumbers={true}
            fontSize={14}
            tabSize={2}
            className="flex-1"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a tab to view content
          </div>
        )}
      </div>
    </div>
  )
}