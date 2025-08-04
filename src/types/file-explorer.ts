export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  parentPath?: string
  size?: number
  lastModified?: Date
  extension?: string
  isExpanded?: boolean
  children?: FileItem[]
  isSelected?: boolean
  isEditable?: boolean
}

export interface FileTreeProps {
  files: FileItem[]
  onFileSelect?: (file: FileItem) => void
  onFolderToggle?: (folder: FileItem) => void
  onFileRename?: (file: FileItem, newName: string) => void
  onFileDelete?: (file: FileItem) => void
  onFileCreate?: (parentPath: string, name: string, type: 'file' | 'folder') => void
  selectedFileId?: string
  className?: string
}

export interface FileItemProps {
  item: FileItem
  level: number
  onSelect?: (file: FileItem) => void
  onToggle?: (folder: FileItem) => void
  onRename?: (file: FileItem, newName: string) => void
  onDelete?: (file: FileItem) => void
  isSelected?: boolean
  selectedFileId?: string
  className?: string
}

export interface FileExplorerProps {
  rootPath?: string
  files?: FileItem[]
  onFilesChange?: (files: FileItem[]) => void
  onFileSelect?: (file: FileItem) => void
  onFileOpen?: (file: FileItem) => void
  className?: string
  height?: string
}

export interface ToolbarProps {
  onNewFile?: () => void
  onNewFolder?: () => void
  onRefresh?: () => void
  onUpload?: () => void
  selectedFile?: FileItem | null
  className?: string
}

export type FileSystemAction = 
  | 'create-file'
  | 'create-folder'
  | 'rename'
  | 'delete'
  | 'copy'
  | 'cut'
  | 'paste'
  | 'refresh'
  | 'upload'

export interface FileOperation {
  type: FileSystemAction
  path?: string
  newName?: string
  targetPath?: string
}