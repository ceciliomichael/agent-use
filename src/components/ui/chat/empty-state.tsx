"use client"

export function EmptyState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Start typing to begin...
        </p>
      </div>
    </div>
  )
}