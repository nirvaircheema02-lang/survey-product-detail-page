/**
 * Shadcn/UI Primitives Barrel
 *
 * Ported from Design_system_vs_26 OG (DS Port Batch 4, 2026-05-12).
 * Wholesale copy preserving shadcn/ui conventions for compatibility with
 * existing consumer code AND community shadcn patterns.
 *
 * Usage:
 *   import { Accordion, Dialog, Drawer, Tabs } from '@kenresearch/design-system/ui';
 *   // OR per-file:
 *   import { Accordion } from '@kenresearch/design-system/ui/accordion';
 *
 * NOTE: These are LOWER-LEVEL primitives. For Ken-branded components prefer:
 *   - Atoms: Button · Card · Badge · etc. from '@kenresearch/design-system/atoms'
 *   - Molecules: ReportCard · StatCard · etc. from '@kenresearch/design-system/molecules'
 *
 * Use shadcn primitives directly only when:
 *   - Building a NEW Ken atom that doesn't exist yet (compose from primitive)
 *   - Need a primitive (Sheet · Drawer · Command) without Ken styling layer
 */

export * from './accordion';
export * from './alert-dialog';
export * from './alert';
export * from './aspect-ratio';
export * from './avatar';
export * from './badge';
export * from './breadcrumb';
export * from './button';
export * from './calendar';
export * from './card';
export * from './carousel';
export * from './chart';
export * from './checkbox';
export * from './collapsible';
export * from './command';
export * from './context-menu';
export * from './dialog';
export * from './drawer';
export * from './dropdown-menu';
export * from './form';
export * from './hover-card';
export * from './input-otp';
export * from './input';
export * from './label';
export * from './menubar';
export * from './navigation-menu';
export * from './pagination';
export * from './popover';
export * from './progress';
export * from './radio-group';
export * from './resizable';
export * from './scroll-area';
export * from './select';
export * from './separator';
export * from './sheet';
export * from './sidebar';
export * from './skeleton';
export * from './slider';
export * from './sonner';
export * from './switch';
export * from './table';
export * from './tabs';
export * from './textarea';
export * from './toggle-group';
export * from './toggle';
export * from './tooltip';
