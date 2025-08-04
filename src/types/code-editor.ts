export interface EditorTab {
  id: string
  title: string
  filePath: string
  content: string
  language?: string
  isDirty?: boolean
  isActive?: boolean
  canClose?: boolean
}

export interface EditorTabsProps {
  tabs: EditorTab[]
  activeTabId?: string
  onTabSelect?: (tabId: string) => void
  onTabClose?: (tabId: string) => void
  onTabMove?: (fromIndex: number, toIndex: number) => void
  maxTabs?: number
  className?: string
}

export interface EditorContentProps {
  content: string
  language?: string
  onChange?: (content: string) => void
  onSave?: () => void
  readOnly?: boolean
  theme?: 'dark' | 'light'
  showLineNumbers?: boolean
  showMinimap?: boolean
  fontSize?: number
  tabSize?: number
  className?: string
}

export interface CodeEditorProps {
  tabs?: EditorTab[]
  activeTabId?: string
  onTabChange?: (tabId: string) => void
  onTabClose?: (tabId: string) => void
  onContentChange?: (tabId: string, content: string) => void
  onSave?: (tabId: string, content: string) => void
  onNewTab?: (filePath?: string, content?: string) => void
  defaultContent?: string
  className?: string
  height?: string
}

export interface EditorSettings {
  theme: 'dark' | 'light'
  fontSize: number
  tabSize: number
  wordWrap: boolean
  showLineNumbers: boolean
  showMinimap: boolean
  autoSave: boolean
  autoSaveDelay: number
}

export type SupportedLanguage = 
  | 'javascript'
  | 'typescript'
  | 'tsx'
  | 'jsx'
  | 'python'
  | 'java'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'html'
  | 'css'
  | 'scss'
  | 'json'
  | 'yaml'
  | 'xml'
  | 'markdown'
  | 'sql'
  | 'bash'
  | 'powershell'
  | 'plaintext'

export interface LanguageConfig {
  id: SupportedLanguage
  name: string
  extensions: string[]
  icon: string
  monacoLanguage?: string
}