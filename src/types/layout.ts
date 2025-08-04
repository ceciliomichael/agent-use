import { ReactNode } from "react"

export interface PanelProps {
  children?: ReactNode
  className?: string
  variant?: "default" | "glass" | "surface" | "primary"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  border?: boolean
  glow?: boolean
  animate?: boolean
}

export interface TwoPanelLayoutProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
  className?: string
  leftPanelClassName?: string
  rightPanelClassName?: string
  leftPanelProps?: Omit<PanelProps, "children" | "className">
  rightPanelProps?: Omit<PanelProps, "children" | "className">
  gap?: "none" | "sm" | "md" | "lg"
  responsive?: boolean
  animate?: boolean
}

export type PanelVariant = "default" | "glass" | "surface" | "primary"
export type PanelPadding = "none" | "sm" | "md" | "lg" | "xl"
export type LayoutGap = "none" | "sm" | "md" | "lg"