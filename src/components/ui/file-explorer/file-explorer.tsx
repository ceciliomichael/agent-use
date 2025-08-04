"use client"

import { useState, useCallback, useEffect } from "react"
import { FileExplorerProps, FileItem } from "@/types/file-explorer"
import { Toolbar } from "./toolbar"
import { FileTree } from "./file-tree"
import { CreateDialog, ConflictDialog } from "./create-dialog"
import { createFileItem, generateFileId, updateFileInTree, removeFileFromTree, getFileIcon, findFileByPath } from "@/lib/file-utils"
import { DynamicIcon, Folder } from "@/lib/icons"
import { cn } from "@/lib/utils"

// Start with empty file system
const initialFileSystem: FileItem[] = []

export function FileExplorer({
  rootPath = '/',
  files: externalFiles,
  onFilesChange,
  onFileSelect,
  onFileOpen,
  className,
  height = 'h-full'
}: FileExplorerProps) {
  const [files, setFiles] = useState<FileItem[]>(externalFiles || initialFileSystem)
  
  // Sync with external files
  useEffect(() => {
    if (externalFiles) {
      setFiles(externalFiles)
    }
  }, [externalFiles])
  
  // Notify parent of file changes
  const updateFiles = useCallback((newFiles: FileItem[]) => {
    setFiles(newFiles)
    onFilesChange?.(newFiles)
  }, [onFilesChange])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [createDialog, setCreateDialog] = useState<{
    open: boolean
    type: 'file' | 'folder'
    parentPath: string
  }>({ open: false, type: 'file', parentPath: '/' })
  const [conflictDialog, setConflictDialog] = useState<{
    open: boolean
    name: string
    type: 'file' | 'folder'
    parentPath: string
  }>({ open: false, name: '', type: 'file', parentPath: '/' })

  const handleFileSelect = useCallback((file: FileItem) => {
    setSelectedFile(file)
    onFileSelect?.(file)
    
    // Double-click to open files only
    if (file.type === 'file') {
      onFileOpen?.(file)
    }
  }, [onFileSelect, onFileOpen])

  const handleFolderToggle = useCallback((folder: FileItem) => {
    const newFiles = updateFileInTree(files, folder.path, (file) => ({
      ...file,
      isExpanded: !file.isExpanded
    }))
    updateFiles(newFiles)
  }, [files, updateFiles])

  const handleFileRename = useCallback((file: FileItem, newName: string) => {
    const newPath = file.parentPath ? `${file.parentPath}/${newName}` : `/${newName}`
    
    const newFiles = updateFileInTree(files, file.path, (oldFile) => ({
      ...oldFile,
      name: newName,
      path: newPath,
      id: generateFileId(newPath)
    }))
    updateFiles(newFiles)
  }, [files, updateFiles])

  const handleFileDelete = useCallback((file: FileItem) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      const newFiles = removeFileFromTree(files, file.path)
      updateFiles(newFiles)
      if (selectedFile?.path === file.path) {
        setSelectedFile(null)
      }
    }
  }, [selectedFile, files, updateFiles])

  // Get existing items in the current directory
  const getExistingItems = useCallback((parentPath: string) => {
    if (parentPath === '/') {
      return files.map(f => ({ name: f.name, type: f.type }))
    }
    
    const parentFolder = findFileByPath(files, parentPath)
    return parentFolder?.children?.map(child => ({ name: child.name, type: child.type })) || []
  }, [files])

  // Get the current directory path for creation
  const getCurrentDirectory = useCallback(() => {
    if (!selectedFile) {
      return '/'
    }
    
    // If selected item is a folder, create inside it
    if (selectedFile.type === 'folder') {
      return selectedFile.path
    }
    
    // If selected item is a file, create in its parent directory
    return selectedFile.parentPath || '/'
  }, [selectedFile])

  // Debug function to check current state
  const debugCurrentState = useCallback(() => {
    console.log('Current selectedFile:', selectedFile)
    console.log('Current directory for creation:', getCurrentDirectory())
  }, [selectedFile, getCurrentDirectory])

  const handleNewFile = useCallback(() => {
    const parentPath = getCurrentDirectory()
    debugCurrentState() // Debug log
    console.log('Creating file in:', parentPath)
    setCreateDialog({
      open: true,
      type: 'file',
      parentPath
    })
  }, [getCurrentDirectory, debugCurrentState])

  const handleNewFolder = useCallback(() => {
    const parentPath = getCurrentDirectory()
    debugCurrentState() // Debug log
    console.log('Creating folder in:', parentPath)
    setCreateDialog({
      open: true,
      type: 'folder',
      parentPath
    })
  }, [getCurrentDirectory, debugCurrentState])

  // Handle creation from dialog
  const handleCreateConfirm = useCallback((name: string, type: 'file' | 'folder') => {
    const parentPath = createDialog.parentPath
    const newPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`
    const newItem = createFileItem(name, type, newPath, parentPath === '/' ? undefined : parentPath)
    
    let newFiles: FileItem[]
    if (parentPath === '/') {
      newFiles = [...files, newItem]
    } else {
      newFiles = updateFileInTree(files, parentPath, (folder) => ({
        ...folder,
        children: [...(folder.children || []), newItem],
        isExpanded: true
      }))
    }
    updateFiles(newFiles)
  }, [createDialog.parentPath, files, updateFiles])

  // Handle conflict resolution
  const handleReplaceFile = useCallback(() => {
    const { name, type, parentPath } = conflictDialog
    // In a real implementation, this would replace the existing file
    console.log(`Replacing ${type}: ${name} in ${parentPath}`)
    setConflictDialog({ open: false, name: '', type: 'file', parentPath: '/' })
  }, [conflictDialog])

  const handleKeepBoth = useCallback(() => {
    const { name, type, parentPath } = conflictDialog
    
    // Generate a unique name by adding a number suffix
    const existingItems = getExistingItems(parentPath)
    let counter = 1
    let newName = name
    const nameWithoutExt = name.includes('.') ? name.substring(0, name.lastIndexOf('.')) : name
    const extension = name.includes('.') ? name.substring(name.lastIndexOf('.')) : ''
    
    do {
      newName = `${nameWithoutExt} (${counter})${extension}`
      counter++
    } while (existingItems.some(item => item.name === newName && item.type === type))
    
    const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`
    const newItem = createFileItem(newName, type, newPath, parentPath === '/' ? undefined : parentPath)
    
    let newFiles: FileItem[]
    if (parentPath === '/') {
      newFiles = [...files, newItem]
    } else {
      newFiles = updateFileInTree(files, parentPath, (folder) => ({
        ...folder,
        children: [...(folder.children || []), newItem],
        isExpanded: true
      }))
    }
    updateFiles(newFiles)
    
    setConflictDialog({ open: false, name: '', type: 'file', parentPath: '/' })
  }, [conflictDialog, getExistingItems, files, updateFiles])

  const handleRefresh = useCallback(() => {
    // In a real implementation, this would reload from the file system
    console.log('Refreshing file tree...')
  }, [])

  const handleUpload = useCallback(() => {
    // In a real implementation, this would open a file picker
    console.log('Upload files...')
  }, [])

  return (
    <div className={cn(
      "flex flex-col bg-gradient-panel border border-panel-border-soft overflow-hidden shadow-md rounded-l-lg",
      height,
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-panel-border-soft bg-gradient-surface shadow-inner">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-explorer-folder-icon/20 flex items-center justify-center">
            <Folder size={18} className="text-explorer-folder-icon" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Explorer</h3>
        </div>
        <div className="text-xs text-muted-foreground font-medium bg-surface px-2 py-1 rounded-md border border-border-subtle">
          {files.length} items
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onRefresh={handleRefresh}
        onUpload={handleUpload}
        selectedFile={selectedFile}
      />

      {/* File Tree */}
      <div className="flex-1 overflow-auto editor-scrollbar bg-explorer-bg">
        <FileTree
          files={files}
          onFileSelect={handleFileSelect}
          onFolderToggle={handleFolderToggle}
          onFileRename={handleFileRename}
          onFileDelete={handleFileDelete}
          selectedFileId={selectedFile?.id}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t border-panel-border-soft bg-gradient-surface shadow-inner">
        <span className="font-mono text-explorer-file-icon">{rootPath}</span>
        {selectedFile && (
          <div className="flex items-center space-x-2 bg-surface px-2 py-1 rounded-md border border-border-subtle">
            <DynamicIcon 
              name={getFileIcon(selectedFile)} 
              size={14} 
              className="text-accent" 
            />
            <span className="font-medium text-foreground">{selectedFile.name}</span>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateDialog
        open={createDialog.open}
        onClose={() => setCreateDialog({ open: false, type: 'file', parentPath: '/' })}
        onConfirm={handleCreateConfirm}
        type={createDialog.type}
        parentPath={createDialog.parentPath}
        existingItems={getExistingItems(createDialog.parentPath)}
      />

      <ConflictDialog
        open={conflictDialog.open}
        onClose={() => setConflictDialog({ open: false, name: '', type: 'file', parentPath: '/' })}
        onReplace={handleReplaceFile}
        onKeepBoth={handleKeepBoth}
        fileName={conflictDialog.name}
        type={conflictDialog.type}
      />
    </div>
  )
}