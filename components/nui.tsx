"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const baseBg = "bg-[#f0f3fa]"
const shadowRest = "shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff]"
const shadowHover = "hover:shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff]"
const shadowInset = "active:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"

export function NCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(baseBg, "rounded-3xl p-6", shadowRest, className)} {...props} />
}

export function NButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        baseBg,
        "rounded-2xl px-5 py-3 transition-all duration-200 font-mono flex items-center justify-center gap-2",
        shadowRest,
        shadowHover,
        shadowInset,
        "text-[#e74c3c]", // brand red text for contrast on light bg
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export const NField = React.forwardRef<
  HTMLInputElement & HTMLSelectElement,
  React.InputHTMLAttributes<HTMLInputElement> &
    React.SelectHTMLAttributes<HTMLSelectElement> & {
      label?: string
      hint?: string
      as?: "input" | "select"
    }
>(function NField({ className, label, hint, as = "input", ...props }, ref) {
  const commonClass = cn(
    baseBg,
    "w-full rounded-2xl px-4 py-3 outline-none transition-all font-mono",
    shadowRest,
    "focus:shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]",
    className,
  )

  const Component = as
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm text-gray-700">{label}</span> : null}
      <Component ref={ref} className={commonClass} {...props} />
      {hint ? <span className="mt-1 block text-xs text-gray-500">{hint}</span> : null}
    </label>
  )
})

export function NToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className={cn(
          baseBg,
          "relative w-14 h-8 rounded-full transition-all",
          shadowRest,
          checked ? "text-[#2ecc71]" : "text-gray-500",
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-6 h-6 rounded-full transition-all",
            baseBg,
            shadowRest,
            checked ? "translate-x-6" : "translate-x-0",
          )}
        />
      </button>
      {label ? <span className="text-sm text-gray-700">{label}</span> : null}
    </div>
  )
}

export function NModal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <NCard className="relative z-10 w-full max-w-md">{children}</NCard>
    </div>
  )
}

export function NProgress({ 
  value, 
  max = 100, 
  className 
}: { 
  value: number
  max?: number
  className?: string 
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        baseBg,
        "w-full h-4 rounded-full overflow-hidden",
        shadowRest
      )}>
        <div 
          className={cn(
            "h-full bg-gradient-to-r from-[#e74c3c] to-[#c0392b] transition-all duration-300 ease-out",
            "shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff]"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function NBadge({ 
  children, 
  variant = "default",
  className 
}: { 
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error" | "info"
  className?: string 
}) {
  const variants = {
    default: "text-gray-700",
    success: "text-[#2ecc71]",
    warning: "text-[#f39c12]",
    error: "text-[#e74c3c]",
    info: "text-[#3498db]"
  }

  return (
    <span className={cn(
      baseBg,
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      shadowRest,
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export function NAlert({ 
  children, 
  type = "info",
  className 
}: { 
  children: React.ReactNode
  type?: "info" | "success" | "warning" | "error"
  className?: string 
}) {
  const types = {
    info: "border-l-4 border-[#3498db]",
    success: "border-l-4 border-[#2ecc71]",
    warning: "border-l-4 border-[#f39c12]",
    error: "border-l-4 border-[#e74c3c]"
  }

  return (
    <div className={cn(
      baseBg,
      "rounded-2xl p-4",
      shadowRest,
      types[type],
      className
    )}>
      {children}
    </div>
  )
}

export function NList({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      baseBg,
      "rounded-2xl overflow-hidden",
      shadowRest,
      className
    )}>
      {children}
    </div>
  )
}

export function NListItem({ 
  children, 
  className,
  onClick 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div 
      className={cn(
        "px-4 py-3 border-b border-gray-200 last:border-b-0 transition-all",
        onClick && "cursor-pointer hover:bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function NAvatar({ 
  src, 
  alt, 
  size = "md",
  className 
}: { 
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string 
}) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  }

  return (
    <div className={cn(
      baseBg,
      "rounded-full overflow-hidden",
      shadowRest,
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

export function NStatCard({ 
  title, 
  value, 
  subtitle,
  icon,
  className 
}: { 
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  className?: string 
}) {
  return (
    <NCard className={cn("text-center", className)}>
      {icon && (
        <div className="flex justify-center mb-3 text-[#e74c3c]">
          {icon}
        </div>
      )}
      <div className="text-2xl font-bold text-[#e74c3c] mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-700 mb-1">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500">{subtitle}</div>
      )}
    </NCard>
  )
}
