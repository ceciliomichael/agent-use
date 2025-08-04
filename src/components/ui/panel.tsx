"use client"

import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { PanelProps } from "@/types/layout"

const panelVariants = cva(
  "panel-transition overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-panel border border-panel-border text-panel-foreground",
        glass: "glass-effect text-panel-foreground",
        "glass-subtle": "glass-subtle text-panel-foreground",
        "glass-strong": "glass-strong text-panel-foreground",
        surface: "bg-surface border border-panel-border text-surface-foreground hover:bg-surface-hover",
        "surface-elevated": "bg-surface-elevated border border-panel-border-soft text-surface-foreground shadow-md",
        "surface-gradient": "bg-gradient-surface border border-panel-border-soft text-surface-foreground shadow-inner",
        primary: "bg-gradient-primary text-primary-foreground border border-border-hover shadow-glow-soft",
        accent: "bg-gradient-accent text-accent-foreground border border-border-accent shadow-glow",
        elevated: "bg-panel-elevated border border-panel-border-soft text-panel-foreground shadow-lg",
      },
      padding: {
        none: "p-0",
        xs: "p-2",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      glow: {
        true: "glow-effect",
        soft: "glow-soft",
        false: "",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        enhanced: "shadow-enhanced",
      },
      animate: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      glow: false,
      shadow: "none",
      animate: false,
    },
  }
)

export interface PanelComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  border?: boolean
  rounded?: boolean
}

const Panel = forwardRef<HTMLDivElement, PanelComponentProps>(
  ({ 
    className, 
    variant, 
    padding, 
    glow, 
    shadow,
    animate, 
    border = true,
    rounded = false, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(
          panelVariants({ variant, padding, glow, shadow, animate }),
          !border && "border-0",
          rounded && "rounded-lg",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Panel.displayName = "Panel"

export { Panel, panelVariants }