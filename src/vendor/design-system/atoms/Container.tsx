/**
 * Container — Atom
 *
 * WHY: Consistent content width constraints ensure optimal readability
 * and visual rhythm. Centralises the responsive padding + max-width
 * pattern used across all case study sections and report store pages.
 *
 * WHAT: A semantic wrapper that applies a token-driven max-width,
 * centers content via `mx-auto`, and adds responsive horizontal padding.
 * Token set: `--container-page/content/narrow/prose/compact` (defined in
 * `editorial-light.css` + `cinematic-dark.css`, portable across both variants).
 *
 * WHEN:
 * - Use in ALL case study / report page sections for constrained content.
 * - Use any time a full-width section needs centred, width-capped content.
 *
 * WHEN NOT:
 * - Don't use for full-bleed backgrounds — wrap the `<section>` around
 *   `<Container>` instead, not the other way round.
 * - Never nest `<Container>` inside another `<Container>`.
 *
 * HOW:
 * ```tsx
 * <section className="bg-black">
 *   <Container maxWidth="content" className="relative z-10">
 *     <h2>Content here</h2>
 *   </Container>
 * </section>
 * ```
 *
 * CONTAINER WIDTH HIERARCHY (tokens in editorial-light.css):
 * --container-page:    75rem  (1200px) — Full page shell, heros, nav
 * --container-content: 62.5rem (1000px) — Standard sections, card grids (DEFAULT)
 * --container-narrow:  56.25rem (900px) — CTAs, testimonials, focused content
 * --container-prose:   43.75rem (700px) — Long-form text, optimal line length
 * --container-compact: 37.5rem  (600px) — Short descriptions, methodology text
 *
 * @promotedFrom Design_system_vs_26/src/app/components/Container.tsx
 * @portedDate 2026-05-12 — DS Port Batch 1
 */
'use client';

import React from 'react';
import { cn } from '../lib/cn';

export type ContainerMaxWidth = 'page' | 'content' | 'narrow' | 'prose' | 'compact';

export interface ContainerProps {
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Override the max-width token. Defaults to `content` (--container-content, 1000px) */
  maxWidth?: ContainerMaxWidth;
  /** HTML element to render. Defaults to `div`. */
  as?: React.ElementType;
}

const MAX_WIDTH_TOKEN: Record<ContainerMaxWidth, string> = {
  page:    'var(--container-page)',
  content: 'var(--container-content)',
  narrow:  'var(--container-narrow)',
  prose:   'var(--container-prose)',
  compact: 'var(--container-compact)',
};

export function Container({
  children,
  className,
  maxWidth = 'content',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag
      data-component="Container"
      className={cn('mx-auto px-4 sm:px-6 md:px-8', className)}
      style={{ maxWidth: MAX_WIDTH_TOKEN[maxWidth] }}
    >
      {children}
    </Tag>
  );
}
