/**
 * CollapsibleSection — Atom
 *
 * WHY: Generic expand/collapse pattern reused across FAQ · TOC · long
 *      content blocks. Eliminates per-section accordion re-implementation.
 * WHAT: Click-toggleable section w/ chevron rotation + smooth content reveal.
 * WHEN: FAQ items · TOC chapters · methodology details · long taxonomy nodes.
 * WHEN NOT: Critical info (always visible) · forms (use Label + native).
 *
 * HOW:
 * ```tsx
 * <CollapsibleSection title="What is CAGR?" subtitle="Compound Annual Growth Rate">
 *   <p>CAGR represents the constant annual growth rate over a period.</p>
 * </CollapsibleSection>
 *
 * <CollapsibleSection title="Methodology" defaultOpen={false}>
 *   <MethodologyDetails />
 * </CollapsibleSection>
 * ```
 *
 * @promotedFrom Design_system_vs_26/src/app/components/CollapsibleSection.tsx
 * @portedDate 2026-05-12 — DS Port Batch 2 · Tier 2
 */
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = true,
  children,
  className = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      data-component="CollapsibleSection"
      className={`border border-black/10 rounded-[10px] overflow-hidden bg-white ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <div className="text-left">
          <h4 className="text-lg font-bold text-black">{title}</h4>
          {subtitle && <p className="text-sm text-black/60 mt-1">{subtitle}</p>}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-black/60 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-6 border-t border-black/10">{children}</div>
      )}
    </div>
  );
}
