import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export utilities for convenience
export * from './utils/dateUtils'
export * from './utils/formUtils'
export * from './utils/searchUtils'