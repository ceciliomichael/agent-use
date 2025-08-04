import { 
  Folder,
  FolderOpen,
  FileText,
  FileType,
  Component,
  FileCode,
  Coffee,
  Hash,
  Zap,
  Settings,
  Globe,
  Palette,
  Braces,
  Code,
  BookOpen,
  Database,
  Terminal,
  Plus,
  RotateCcw,
  Upload,
  MoreHorizontal,
  X,
  Edit3,
  Trash2,
  ChevronRight,
  type LucideIcon
} from 'lucide-react'

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Folder,
  FolderOpen,
  FileText,
  FileType,
  Component,
  FileCode,
  Coffee,
  Hash,
  Zap,
  Settings,
  Globe,
  Palette,
  Braces,
  Code,
  BookOpen,
  Database,
  Terminal,
  Plus,
  RotateCcw,
  Upload,
  MoreHorizontal,
  X,
  Edit3,
  Trash2,
  ChevronRight
}

interface IconProps {
  name: string
  size?: number
  className?: string
}

export function DynamicIcon({ name, size = 16, className }: IconProps) {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    // Fallback to a default icon if the requested icon doesn't exist
    return <FileText size={size} className={className} />
  }
  
  return <IconComponent size={size} className={className} />
}

// Export specific icons for direct use
export {
  Folder,
  FolderOpen,
  FileText,
  FileType,
  Component,
  FileCode,
  Coffee,
  Hash,
  Zap,
  Settings,
  Globe,
  Palette,
  Braces,
  Code,
  BookOpen,
  Database,
  Terminal,
  Plus,
  RotateCcw,
  Upload,
  MoreHorizontal,
  X,
  Edit3,
  Trash2,
  ChevronRight
}