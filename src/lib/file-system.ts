import { FileItem } from '@/types/file-explorer'
import { EditorTab } from '@/types/code-editor'
import { getLanguageByFilename, getDefaultFileContent, generateFileId } from './file-utils'

/**
 * File system operations for the application
 */
export class FileSystemManager {
  private static instance: FileSystemManager
  private fileContents: Map<string, string> = new Map()
  
  static getInstance(): FileSystemManager {
    if (!FileSystemManager.instance) {
      FileSystemManager.instance = new FileSystemManager()
    }
    return FileSystemManager.instance
  }

  /**
   * Read file content
   */
  async readFile(filePath: string): Promise<string> {
    // In a real implementation, this would read from actual file system
    const existingContent = this.fileContents.get(filePath)
    if (existingContent !== undefined) {
      return existingContent
    }
    
    // Return default content based on file type
    const filename = filePath.split('/').pop() || ''
    return getDefaultFileContent(filename)
  }

  /**
   * Write file content
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    // In a real implementation, this would write to actual file system
    this.fileContents.set(filePath, content)
    console.log(`File saved: ${filePath}`)
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    // In a real implementation, this would check actual file system
    return this.fileContents.has(filePath)
  }

  /**
   * Delete file
   */
  async deleteFile(filePath: string): Promise<void> {
    // In a real implementation, this would delete from actual file system
    this.fileContents.delete(filePath)
    console.log(`File deleted: ${filePath}`)
  }

  /**
   * Create directory
   */
  async createDirectory(dirPath: string): Promise<void> {
    // In a real implementation, this would create actual directory
    console.log(`Directory created: ${dirPath}`)
  }

  /**
   * Convert FileItem to EditorTab
   */
  async fileToEditorTab(file: FileItem): Promise<EditorTab> {
    const content = await this.readFile(file.path)
    const language = getLanguageByFilename(file.name)
    
    return {
      id: `${file.id}_editor`, // Add suffix to avoid conflicts with file explorer IDs
      title: file.name,
      filePath: file.path,
      content,
      language: language.monacoLanguage,
      isDirty: false,
      isActive: false,
      canClose: true
    }
  }

  /**
   * Save editor tab content
   */
  async saveEditorTab(tab: EditorTab): Promise<void> {
    await this.writeFile(tab.filePath, tab.content)
  }

  /**
   * Get file stats (mock implementation)
   */
  async getFileStats(filePath: string): Promise<{ size: number; lastModified: Date }> {
    // In a real implementation, this would get actual file stats
    const content = await this.readFile(filePath)
    return {
      size: new Blob([content]).size,
      lastModified: new Date()
    }
  }
}

// Export singleton instance
export const fileSystem = FileSystemManager.getInstance()