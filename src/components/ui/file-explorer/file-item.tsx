"use client"

import { useState, useRef, useEffect } from "react"
import { FileItemProps } from "@/types/file-explorer"
import { getFileIcon, formatFileSize, formatDate } from "@/lib/file-utils"
import { DynamicIcon, ChevronRight, Edit3, Trash2 } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function FileItem({
  item,
  level,
  onSelect,
  onToggle,
  onRename,
  onDelete,
  isSelected,
  selectedFileId,
  className
}: FileItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    // Always call onSelect for both files and folders to set selection
    onSelect?.(item)
    
    // Additionally toggle folders
    if (item.type === 'folder') {
      onToggle?.(item)
    }
  }

  const handleDoubleClick = () => {
    if (item.type === 'file') {
      setIsEditing(true)
    }
  }

  const handleRename = () => {
    if (editName.trim() && editName !== item.name) {
      onRename?.(item, editName.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditName(item.name)
      setIsEditing(false)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    // TODO: Implement context menu
  }

  const indentStyle = { paddingLeft: `${level * 16 + 8}px` }
  const icon = getFileIcon(item)

  return (
    <div className={cn("file-explorer-item", className)}>
      <div
        className={cn(
          "flex items-center py-2 px-3 cursor-pointer select-none smooth-transition relative",
          "hover:bg-explorer-item-hover group",
          isSelected && "bg-explorer-item-selected",
          "explorer-tree-line"
        )}
        style={indentStyle}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {/* Folder Toggle Icon */}
        {item.type === 'folder' && (
          <div className="w-5 h-5 flex items-center justify-center mr-2 text-muted-foreground hover:text-accent smooth-transition">
            <ChevronRight 
              size={14}
              className={cn(
                "transition-transform duration-medium",
                item.isExpanded ? "rotate-90 text-accent" : "rotate-0"
              )}
            />
          </div>
        )}

        {/* File/Folder Icon */}
        <div className="w-5 h-5 flex items-center justify-center mr-3">
          <DynamicIcon 
            name={icon} 
            size={16} 
            className={cn(
              "smooth-transition",
              item.type === 'folder' 
                ? "text-explorer-folder-icon group-hover:text-explorer-folder-icon" 
                : "text-explorer-file-icon group-hover:text-accent",
              isSelected && "text-accent"
            )} 
          />
        </div>

        {/* File/Folder Name */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="w-full bg-surface border border-accent rounded px-2 py-1 outline-none text-sm text-foreground focus:border-primary"
            />
          ) : (
            <span className={cn(
              "text-sm truncate block font-medium smooth-transition",
              item.type === 'folder' 
                ? "text-explorer-folder-icon group-hover:text-accent" 
                : "text-foreground group-hover:text-accent",
              isSelected && "text-accent font-semibold"
            )}>
              {item.name}
            </span>
          )}
        </div>

        {/* File Info */}
        {item.type === 'file' && item.size !== undefined && (
          <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 smooth-transition">
            <span className="text-xs text-muted-foreground font-medium bg-surface px-2 py-1 rounded border border-border-subtle">
              {formatFileSize(item.size)}
            </span>
            {item.lastModified && (
              <span className="text-xs text-muted-foreground font-medium">
                {formatDate(item.lastModified)}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 smooth-transition">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-surface-hover text-muted-foreground hover:text-accent smooth-transition hover:shadow-md border border-transparent hover:border-border-subtle"
            title="Rename"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(item)
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-destructive/20 text-muted-foreground hover:text-destructive smooth-transition hover:shadow-md border border-transparent hover:border-destructive/30"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Children */}
      {item.type === 'folder' && item.isExpanded && item.children && (
        <div className="file-explorer-children">
          {item.children.map((child) => (
            <FileItem
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              isSelected={child.id === selectedFileId}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  )
}