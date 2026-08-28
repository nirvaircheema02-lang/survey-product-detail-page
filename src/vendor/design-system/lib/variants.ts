/**
 * Re-export CVA (class-variance-authority) for use across atoms/molecules/organisms.
 * Centralised here so version is pinned once and import path is consistent.
 *
 * Usage:
 *   import { cva, type VariantProps } from '@/lib/variants'
 *   const buttonVariants = cva('base classes', { variants: { ... } })
 */
export { cva, type VariantProps } from 'class-variance-authority';
