"use client"

import { useState, useCallback } from "react"
import { TwoPanelLayout } from "@/components/ui/two-panel-layout"
import { AIChat } from "@/components/ui/ai-chat"
import { FileExplorer } from "@/components/ui/file-explorer/file-explorer"
import { CodeEditor } from "@/components/ui/code-editor/code-editor"
import { FileItem } from "@/types/file-explorer"
import { EditorTab } from "@/types/code-editor"
import { fileSystem } from "@/lib/file-system"
import { generateFileId } from "@/lib/file-utils"

export default function HomePage() {
  const [editorTabs, setEditorTabs] = useState<EditorTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [fileExplorerFiles, setFileExplorerFiles] = useState<FileItem[]>([])

  const handleFileOpen = useCallback(async (file: FileItem) => {
    if (file.type !== 'file') return
    
    // Check if file is already open
    const existingTab = editorTabs.find(tab => tab.filePath === file.path)
    if (existingTab) {
      setActiveTabId(existingTab.id)
      return
    }
    
    try {
      // Convert file to editor tab
      const newTab = await fileSystem.fileToEditorTab(file)
      newTab.isActive = true
      
      setEditorTabs(prev => [...prev, newTab])
      setActiveTabId(newTab.id)
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }, [editorTabs])

  const handleTabClose = useCallback((tabId: string) => {
    setEditorTabs(prev => prev.filter(tab => tab.id !== tabId))
    
    if (tabId === activeTabId) {
      const remainingTabs = editorTabs.filter(tab => tab.id !== tabId)
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[0].id : '')
    }
  }, [editorTabs, activeTabId])

  const handleContentChange = useCallback((tabId: string, content: string) => {
    setEditorTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, content, isDirty: true }
        : tab
    ))
  }, [])

  const handleSave = useCallback(async (tabId: string, content: string) => {
    const tab = editorTabs.find(t => t.id === tabId)
    if (!tab) return
    
    try {
      await fileSystem.saveEditorTab({ ...tab, content })
      setEditorTabs(prev => prev.map(t => 
        t.id === tabId 
          ? { ...t, content, isDirty: false }
          : t
      ))
      
      // Add file to explorer if it doesn't exist
      const fileExists = fileExplorerFiles.some(f => f.path === tab.filePath)
      if (!fileExists) {
        const newFileItem: FileItem = {
          id: generateFileId(tab.filePath, 'file'),
          name: tab.title,
          type: 'file',
          path: tab.filePath,
          parentPath: tab.filePath === `/${tab.title}` ? undefined : tab.filePath.substring(0, tab.filePath.lastIndexOf('/')),
          size: new Blob([content]).size,
          lastModified: new Date(),
          isExpanded: false
        }
        setFileExplorerFiles(prev => [...prev, newFileItem])
      }
    } catch (error) {
      console.error('Failed to save file:', error)
    }
  }, [editorTabs, fileExplorerFiles])

  const handleNewTab = useCallback(() => {
    const timestamp = Date.now()
    const newTabId = generateFileId(`/untitled-${timestamp}.txt`, 'file')
    const newTab: EditorTab = {
      id: newTabId,
      title: 'Untitled.txt',
      filePath: `/untitled-${timestamp}.txt`,
      content: '',
      language: 'plaintext',
      isDirty: false,
      isActive: true,
      canClose: true
    }
    
    setEditorTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }, [])

  const leftPanelContent = (
    <div className="h-full flex flex-row">
      {/* File Explorer - Left Side */}
      <div className="w-80 flex-shrink-0">
        <FileExplorer
          onFileOpen={handleFileOpen}
          files={fileExplorerFiles}
          onFilesChange={setFileExplorerFiles}
          className="h-full"
        />
      </div>
      
      {/* Code Editor - Right Side */}
      <div className="flex-1 min-w-0">
        <CodeEditor
          tabs={editorTabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
          onTabClose={handleTabClose}
          onContentChange={handleContentChange}
          onSave={handleSave}
          onNewTab={handleNewTab}
          className="h-full"
        />
      </div>
    </div>
  )

  const rightPanelContent = (
    <AIChat 
      placeholder="Ask me about your code or files..."
      showTimestamp={false}
    />
  )

  return (
    <TwoPanelLayout
      leftPanel={leftPanelContent}
      rightPanel={rightPanelContent}
      gap="none"
      animate={true}
      responsive={true}
    />
  )
}