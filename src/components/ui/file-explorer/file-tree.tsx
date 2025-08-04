"use client"

import { FileTreeProps } from "@/types/file-explorer"
import { FileItem as FileItemComponent } from "./file-item"
import { sortFileItems } from "@/lib/file-utils"
import { Folder } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function FileTree({
  files,
  onFileSelect,
  onFolderToggle,
  onFileRename,
  onFileDelete,
  onFileCreate,
  selectedFileId,
  className
}: FileTreeProps) {
  const sortedFiles = sortFileItems(files)

  if (sortedFiles.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center py-12 text-center relative",
        className
      )}>
        <div className="relative z-10 flex flex-col items-center" style={{ marginTop: '75%', transform: 'translateY(-50%)' }}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-surface border border-panel-border-soft flex items-center justify-center mb-6 shadow-lg">
            <Folder size={36} className="text-explorer-folder-icon" />
          </div>
          <div className="text-base font-medium text-foreground mb-3 px-4">
            No files in this directory
          </div>
          <div className="text-sm text-muted-foreground max-w-xs px-6 py-2">
            Create a new file or folder using the toolbar above to get started
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("file-tree", className)}>
      {sortedFiles.map((file) => (
        <FileItemComponent
          key={file.id}
          item={file}
          level={0}
          onSelect={onFileSelect}
          onToggle={onFolderToggle}
          onRename={onFileRename}
          onDelete={onFileDelete}
          isSelected={file.id === selectedFileId}
          selectedFileId={selectedFileId}
        />
      ))}
    </div>
  )
}