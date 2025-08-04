"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../dialog"
import { FileText, Folder } from "@/lib/icons"
import { isValidFilename } from "@/lib/file-utils"
import { cn } from "@/lib/utils"

interface CreateDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: (name: string, type: 'file' | 'folder') => void
  type: 'file' | 'folder'
  parentPath: string
  existingItems: Array<{ name: string; type: 'file' | 'folder' }>
}

export function CreateDialog({
  open,
  onClose,
  onConfirm,
  type,
  parentPath,
  existingItems
}: CreateDialogProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(type === 'file' ? 'untitled.txt' : 'New Folder')
      setError('')
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [open, type])

  const validateName = (value: string) => {
    if (!value.trim()) {
      return 'Name cannot be empty'
    }
    
    if (!isValidFilename(value)) {
      return 'Invalid characters in name'
    }
    
    // Check for duplicates only within the same type
    const existingItemOfSameType = existingItems.find(
      item => item.name === value.trim() && item.type === type
    )
    
    if (existingItemOfSameType) {
      return `${type === 'file' ? 'File' : 'Folder'} already exists`
    }
    
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedName = name.trim()
    const validationError = validateName(trimmedName)
    
    if (validationError) {
      setError(validationError)
      return
    }
    
    onConfirm(trimmedName, type)
    onClose()
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    
    if (error) {
      const validationError = validateName(value)
      setError(validationError)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === 'file' ? <FileText size={20} /> : <Folder size={20} />}
            <span>Create New {type === 'file' ? 'File' : 'Folder'}</span>
          </DialogTitle>
          <DialogDescription>
            {parentPath === '/' ? 'Creating in root directory' : `Creating in: ${parentPath}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              {type === 'file' ? 'File' : 'Folder'} Name
            </label>
            <input
              ref={inputRef}
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className={cn(
                "w-full px-3 py-2 bg-surface border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                error ? "border-destructive" : "border-panel-border"
              )}
              placeholder={type === 'file' ? 'Enter file name...' : 'Enter folder name...'}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover rounded-md transition-colors"
            >
              Create {type === 'file' ? 'File' : 'Folder'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface ConflictDialogProps {
  open: boolean
  onClose: () => void
  onReplace: () => void
  onKeepBoth: () => void
  fileName: string
  type: 'file' | 'folder'
}

export function ConflictDialog({
  open,
  onClose,
  onReplace,
  onKeepBoth,
  fileName,
  type
}: ConflictDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogClose onClose={onClose} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === 'file' ? <FileText size={20} /> : <Folder size={20} />}
            <span>{type === 'file' ? 'File' : 'Folder'} Already Exists</span>
          </DialogTitle>
          <DialogDescription>
            A {type} named "{fileName}" already exists in this location.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-foreground">
            What would you like to do?
          </p>

          <DialogFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onKeepBoth}
              className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded-md transition-colors"
            >
              Keep Both
            </button>
            <button
              onClick={onReplace}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md transition-colors"
            >
              Replace
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}