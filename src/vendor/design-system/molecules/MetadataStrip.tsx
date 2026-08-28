/**
 * MetadataStrip — Molecule
 *
 * WHAT: Horizontal strip of label-value metadata pairs, separated by vertical dividers.
 *       5-column layout by default (Author · Pages · Published · Code · Base Year).
 *       Mobile collapses to 2-col grid. Desktop shows full strip with divide-x separators.
 *
 * WHY: V0_lite HeroSection has metadata fields listed below the CTA buttons — common
 *      pattern in B2B report PDPs to establish credibility upfront (Author, base year,
 *      page count). Centralising the strip prevents drift in spacing, font sizing, and
 *      divider colour across consumer pages.
 *      Hick's Law — pre-scan metadata lets buyer validate report scope before scrolling.
 *
 * WHEN: Below CTA buttons in HeroSection. Any scan-level metadata summary row.
 *
 * WHEN NOT: Do NOT use for navigation links — use Breadcrumb.
 *           Do NOT use for stat values — use StatPairRow (those have icons + large type).
 *           Do NOT use for card meta — use CardMetaRow.
 *
 * WHERE: HeroSection below-CTA area · report PDP metadata block · case-study meta row.
 *
 * HOW:
 * ```tsx
 * <MetadataStrip
 *   items={[
 *     { label: 'Author', value: 'Ken Research Analysts' },
 *     { label: 'Pages', value: '165+' },
 *     { label: 'Published', value: 'January 2024' },
 *     { label: 'Report Code', value: 'KR-HC-24-001' },
 *     { label: 'Base Year', value: '2024' },
 *   ]}
 * />
 *
 * // On dark cinematic surface
 * <MetadataStrip
 *   colorScheme="dark"
 *   items={[...]}
 * />
 * ```
 *
 * A11y: Uses `<dl>` / `<dt>` / `<dd>` for semantic term-description pairing.
 *
 * @tier molecule
 * @canonical-source V0_lite_report-legacy · HeroSection.tsx (below-CTA metadata strip)
 * @ported 2026-05-19 · aura-builder · Batch 3.1c
 * @status ready
 */

import type { CSSProperties } from 'react';
import { cn } from '../lib/cn';

export interface MetadataItem {
  /** Short label for the metadata field (e.g. "Author", "Pages"). */
  label: string;
  /** Display value (e.g. "Ken Research Analysts", "165+"). */
  value: string;
}

export interface MetadataStripProps {
  /**
   * Array of label-value pairs. Recommended 3–5 items.
   * Fewer than 2 degrades the divide-x pattern; more than 6 becomes crowded on mobile.
   */
  items: MetadataItem[];
  /**
   * Surface color scheme.
   * "dark" → white/50 labels, white/90 values (cinematic hero).
   * "light" → black/40 labels, black/70 values (editorial surface).
   * @default 'light'
   */
  colorScheme?: 'light' | 'dark';
  /** Additional className on the root dl element. */
  className?: string;
}

/**
 * MetadataStrip
 *
 * Horizontal label-value strip with divide-x separators.
 * Mobile: 2-col grid. Desktop: flex row with `gap-8` and `divide-x`.
 */
export function MetadataStrip({
  items,
  colorScheme = 'light',
  className,
}: MetadataStripProps) {
  const isDark = colorScheme === 'dark';

  const labelStyle: CSSProperties = {
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--tracking-label-wide)',
    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    fontWeight: 'var(--font-weight-medium)',
  };

  const valueStyle: CSSProperties = {
    fontSize: 'var(--text-nav)',
    color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
    fontWeight: 'var(--font-weight-medium)',
    marginTop: 'var(--space-1)',
  };

  const dividerColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

  return (
    <dl
      data-component="MetadataStrip"
      className={cn(
        // Mobile: 2-col grid
        'grid grid-cols-2 gap-4',
        // Desktop: flex row with gap-8
        'sm:flex sm:flex-row sm:flex-wrap sm:gap-0 sm:items-center',
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.label}
          className={cn(
            'flex flex-col',
            idx > 0 && 'sm:border-l sm:pl-8'
          )}
          style={idx > 0 ? { borderColor: dividerColor } : undefined}
        >
          <dt style={labelStyle} className="font-sans">
            {item.label}
          </dt>
          <dd style={valueStyle} className="font-sans">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
