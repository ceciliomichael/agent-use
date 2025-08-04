import { FileItem, FileSystemAction } from '@/types/file-explorer'
import { SupportedLanguage, LanguageConfig } from '@/types/code-editor'

// Language configurations
export const languageConfigs: LanguageConfig[] = [
  { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.mjs'], icon: 'FileText', monacoLanguage: 'javascript' },
  { id: 'typescript', name: 'TypeScript', extensions: ['.ts'], icon: 'FileType', monacoLanguage: 'typescript' },
  { id: 'tsx', name: 'TypeScript React', extensions: ['.tsx'], icon: 'Component', monacoLanguage: 'typescript' },
  { id: 'jsx', name: 'JavaScript React', extensions: ['.jsx'], icon: 'Component', monacoLanguage: 'javascript' },
  { id: 'python', name: 'Python', extensions: ['.py', '.pyw'], icon: 'FileCode', monacoLanguage: 'python' },
  { id: 'java', name: 'Java', extensions: ['.java'], icon: 'Coffee', monacoLanguage: 'java' },
  { id: 'csharp', name: 'C#', extensions: ['.cs'], icon: 'Hash', monacoLanguage: 'csharp' },
  { id: 'go', name: 'Go', extensions: ['.go'], icon: 'Zap', monacoLanguage: 'go' },
  { id: 'rust', name: 'Rust', extensions: ['.rs'], icon: 'Settings', monacoLanguage: 'rust' },
  { id: 'html', name: 'HTML', extensions: ['.html', '.htm'], icon: 'Globe', monacoLanguage: 'html' },
  { id: 'css', name: 'CSS', extensions: ['.css'], icon: 'Palette', monacoLanguage: 'css' },
  { id: 'scss', name: 'SCSS', extensions: ['.scss', '.sass'], icon: 'Palette', monacoLanguage: 'scss' },
  { id: 'json', name: 'JSON', extensions: ['.json'], icon: 'Braces', monacoLanguage: 'json' },
  { id: 'yaml', name: 'YAML', extensions: ['.yaml', '.yml'], icon: 'FileText', monacoLanguage: 'yaml' },
  { id: 'xml', name: 'XML', extensions: ['.xml'], icon: 'Code', monacoLanguage: 'xml' },
  { id: 'markdown', name: 'Markdown', extensions: ['.md', '.markdown'], icon: 'BookOpen', monacoLanguage: 'markdown' },
  { id: 'sql', name: 'SQL', extensions: ['.sql'], icon: 'Database', monacoLanguage: 'sql' },
  { id: 'bash', name: 'Bash', extensions: ['.sh', '.bash'], icon: 'Terminal', monacoLanguage: 'shell' },
  { id: 'powershell', name: 'PowerShell', extensions: ['.ps1'], icon: 'Terminal', monacoLanguage: 'powershell' },
  { id: 'plaintext', name: 'Plain Text', extensions: ['.txt'], icon: 'FileText', monacoLanguage: 'plaintext' }
]

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.substring(lastDotIndex) : ''
}

/**
 * Get language configuration by file extension
 */
export function getLanguageByExtension(extension: string): LanguageConfig {
  const language = languageConfigs.find(lang => 
    lang.extensions.includes(extension.toLowerCase())
  )
  return language || languageConfigs.find(lang => lang.id === 'plaintext')!
}

/**
 * Get language configuration by filename
 */
export function getLanguageByFilename(filename: string): LanguageConfig {
  const extension = getFileExtension(filename)
  return getLanguageByExtension(extension)
}

/**
 * Get file icon based on type and extension
 */
export function getFileIcon(item: FileItem): string {
  if (item.type === 'folder') {
    return item.isExpanded ? 'FolderOpen' : 'Folder'
  }
  
  const extension = getFileExtension(item.name)
  const language = getLanguageByExtension(extension)
  return language.icon
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Format date in human readable format
 */
export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * Generate unique ID for file items
 */
export function generateFileId(path: string, type?: 'file' | 'folder'): string {
  const baseId = btoa(path).replace(/[^a-zA-Z0-9]/g, '')
  return type ? `${baseId}_${type}` : baseId
}

/**
 * Create a new file item
 */
export function createFileItem(
  name: string, 
  type: 'file' | 'folder', 
  path: string,
  parentPath?: string
): FileItem {
  const extension = type === 'file' ? getFileExtension(name) : undefined
  
  return {
    id: generateFileId(path, type),
    name,
    type,
    path,
    parentPath,
    extension,
    isExpanded: false,
    children: type === 'folder' ? [] : undefined,
    isSelected: false,
    isEditable: false,
    lastModified: new Date(),
    size: 0
  }
}

/**
 * Sort files with folders first, then by name
 */
export function sortFileItems(items: FileItem[]): FileItem[] {
  return [...items].sort((a, b) => {
    // Folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    // Then alphabetically
    return a.name.localeCompare(b.name, undefined, { numeric: true })
  })
}

/**
 * Find file item by path in tree
 */
export function findFileByPath(files: FileItem[], path: string): FileItem | null {
  for (const file of files) {
    if (file.path === path) {
      return file
    }
    if (file.children) {
      const found = findFileByPath(file.children, path)
      if (found) return found
    }
  }
  return null
}

/**
 * Update file item in tree
 */
export function updateFileInTree(
  files: FileItem[], 
  path: string, 
  updater: (file: FileItem) => FileItem
): FileItem[] {
  return files.map(file => {
    if (file.path === path) {
      return updater(file)
    }
    if (file.children) {
      return {
        ...file,
        children: updateFileInTree(file.children, path, updater)
      }
    }
    return file
  })
}

/**
 * Remove file item from tree
 */
export function removeFileFromTree(files: FileItem[], path: string): FileItem[] {
  return files.filter(file => {
    if (file.path === path) {
      return false
    }
    if (file.children) {
      file.children = removeFileFromTree(file.children, path)
    }
    return true
  })
}

/**
 * Get default content for new files based on extension
 */
export function getDefaultFileContent(filename: string): string {
  const language = getLanguageByFilename(filename)
  
  switch (language.id) {
    case 'typescript':
    case 'tsx':
      return '// TypeScript file\n\nexport {}\n'
    case 'javascript':
    case 'jsx':
      return '// JavaScript file\n\n'
    case 'python':
      return '#!/usr/bin/env python3\n# Python file\n\n'
    case 'html':
      return '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    \n</body>\n</html>\n'
    case 'css':
      return '/* CSS file */\n\n'
    case 'json':
      return '{\n    \n}\n'
    case 'markdown':
      return '# Markdown File\n\n'
    default:
      return ''
  }
}

/**
 * Validate filename
 */
export function isValidFilename(filename: string): boolean {
  if (!filename || filename.trim().length === 0) return false
  
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/
  if (invalidChars.test(filename)) return false
  
  // Check for reserved names (Windows)
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
  const nameWithoutExt = filename.split('.')[0].toUpperCase()
  if (reservedNames.includes(nameWithoutExt)) return false
  
  return true
}