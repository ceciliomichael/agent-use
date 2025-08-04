"use client"

import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Panel } from "./panel"
import { TwoPanelLayoutProps } from "@/types/layout"

const layoutVariants = cva(
  "h-screen w-full flex",
  {
    variants: {
      gap: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
      responsive: {
        true: "flex-col lg:flex-row",
        false: "flex-row",
      },
      animate: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      gap: "md",
      responsive: true,
      animate: true,
    },
  }
)

const leftPanelVariants = cva(
  "flex-shrink-0",
  {
    variants: {
      responsive: {
        true: "w-full lg:w-[70%]",
        false: "w-[70%]",
      },
      animate: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      responsive: true,
      animate: false,
    },
  }
)

const rightPanelVariants = cva(
  "flex-shrink-0",
  {
    variants: {
      responsive: {
        true: "w-full lg:w-[30%]",
        false: "w-[30%]",
      },
      animate: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      responsive: true,
      animate: false,
    },
  }
)

export interface TwoPanelLayoutComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof layoutVariants> {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  leftPanelClassName?: string
  rightPanelClassName?: string
  leftPanelProps?: React.ComponentProps<typeof Panel>
  rightPanelProps?: React.ComponentProps<typeof Panel>
}

const TwoPanelLayout = forwardRef<HTMLDivElement, TwoPanelLayoutComponentProps>(
  ({ 
    className,
    leftPanel,
    rightPanel,
    leftPanelClassName,
    rightPanelClassName,
    leftPanelProps = {},
    rightPanelProps = {},
    gap,
    responsive,
    animate,
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(layoutVariants({ gap, responsive, animate }), className)}
        ref={ref}
        {...props}
      >
        {/* Left Panel - 70% */}
        <div className={cn(leftPanelVariants({ responsive, animate }))}>
          <Panel 
            className={cn("h-full", leftPanelClassName)}
            variant="glass"
            padding="lg"
            glow
            {...leftPanelProps}
          >
            {leftPanel}
          </Panel>
        </div>

        {/* Right Panel - 30% */}
        <div className={cn(rightPanelVariants({ responsive, animate }))}>
          <Panel 
            className={cn("h-full", rightPanelClassName)}
            variant="glass"
            padding="none"
            rounded={false}
            glow
            {...rightPanelProps}
          >
            {rightPanel}
          </Panel>
        </div>
      </div>
    )
  }
)

TwoPanelLayout.displayName = "TwoPanelLayout"

export { TwoPanelLayout, layoutVariants }