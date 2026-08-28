import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names safely.
 * Resolves conflicting Tailwind utilities (tailwind-merge) + handles
 * conditional/array/object class values (clsx).
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-red-500', { 'font-bold': isBold })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
