"use client"

import { ToolbarProps } from "@/types/file-explorer"
import { Plus, Folder, RotateCcw, Upload, MoreHorizontal, FileText } from "@/lib/icons"
import { cn } from "@/lib/utils"

export function Toolbar({
  onNewFile,
  onNewFolder,
  onRefresh,
  onUpload,
  selectedFile,
  className
}: ToolbarProps) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 border-b border-panel-border-soft bg-gradient-surface shadow-inner",
      className
    )}>
      <div className="flex items-center space-x-2">
        <button
          onClick={onNewFile}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover smooth-transition text-muted-foreground hover:text-accent hover:shadow-md border border-transparent hover:border-border-subtle"
          title="New File"
        >
          <FileText size={16} />
        </button>
        
        <button
          onClick={onNewFolder}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover smooth-transition text-muted-foreground hover:text-explorer-folder-icon hover:shadow-md border border-transparent hover:border-border-subtle"
          title="New Folder"
        >
          <Folder size={16} />
        </button>
        
        <div className="w-px h-5 bg-border-subtle mx-2" />
        
        <button
          onClick={onRefresh}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover smooth-transition text-muted-foreground hover:text-accent hover:shadow-md border border-transparent hover:border-border-subtle"
          title="Refresh"
        >
          <RotateCcw size={16} className="transition-transform duration-medium hover:rotate-180" />
        </button>
        
        <button
          onClick={onUpload}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover smooth-transition text-muted-foreground hover:text-accent hover:shadow-md border border-transparent hover:border-border-subtle"
          title="Upload Files"
        >
          <Upload size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {selectedFile && (
          <div className="text-xs text-muted-foreground font-medium truncate max-w-36 bg-surface px-2 py-1 rounded-md border border-border-subtle">
            {selectedFile.name}
          </div>
        )}
        
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover smooth-transition text-muted-foreground hover:text-accent hover:shadow-md border border-transparent hover:border-border-subtle"
          title="View Options"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}