import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatClassName(className: string | undefined): string {
  return className ? ` ${className}` : ""
}

export function createBreakpointClass(breakpoint: string, className: string): string {
  return `${breakpoint}:${className}`
}