'use client';

/**
 * PropertyTable · competitor comparison matrix · Ken DS table component.
 *
 * WHY  · McKinsey/IBISWorld/CB Insights web-PDP density standard for
 *        competitor landscape. Structured comparison matrices outperform
 *        unstructured competitor cards for analyst-audience scanning.
 *        NO card chrome · borderless rows · ref-aligned.
 *
 * WHAT · Comparison table · rows = property (HQ · Founded · Fleet size ·
 *        Temperature ranges · Pan-AU coverage · Tech stack · Revenue band) ·
 *        cols = top 3 visible players + N gated columns. Last N cols blurred
 *        via GatedBlock overlay or native CSS filter.
 *
 * WHEN · §14 Competitor Landscape. Below bubble chart · above SourceCluster.
 *        Any cross-competitor property comparison.
 *
 * WHERE · `design-system/core-v2/src/charts/tables/PropertyTable.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <PropertyTable
 *          properties={PROPERTIES}
 *          players={PLAYERS}
 *          gatedFrom={3}
 *          density="comfortable"
 *        />
 *        ```
 *
 * Bug fix applied during DS port (2026-05-25):
 *   - Row height was 72px — 24-27px above ref comfortable range (45-48px).
 *   - FIX: `density="comfortable"` default targets 45px per KEN_TABLE_DENSITY.
 *   - FIX: header periwinkle wash via TableShell `headerWash` prop (was transparent).
 *   - FIX: `stickyHeader` opt-in prop added (default false · §14 8-row doesn't need it).
 *   - TableShell owns: header bg · row dividers · density. PropertyTable owns:
 *     column rendering · paywall/gating · italic descriptors.
 *
 * Gating: first `gatedFrom` visible cols · remaining cols blurred w/ GatedBlock
 * lock pill overlay. Server-side data redaction MANDATORY in production.
 *
 * A11y · `aria-label` on `<table>` via TableShell `ariaLabel` prop.
 *        `scope="col"` on `<th>` · `scope="row"` on row-header cells.
 *
 * @promotedFrom projects/v1-project/v1-product-page-ver0.4/src/components/atoms/PropertyTable.tsx
 * @relatedDoc design-system/core-v2/src/charts/primitives/TableShell.tsx
 * @relatedDoc design-system/core-v2/src/charts/theme/tokens.ts
 */

import { Lock } from 'lucide-react';
import { TableShell, useTableDensity, type TableDensity, type TableVariant, type TableHeaderStyle } from '../primitives/TableShell';
import { TruncatedText } from '../primitives/TruncatedText';
import type { ChartSurface } from '../theme/highcharts-base';

export interface PlayerProperty {
  /** Row label · property name */
  property: string;
  /** Optional sub-label · italic · ink-subtle */
  sublabel?: string;
}

export interface PlayerColumn {
  /** Player / company name · column header */
  name: string;
  /** Optional short descriptor below name (e.g. "Toll Holdings subsidiary") */
  descriptor?: string;
  /** Cell values aligned to properties array by index */
  values: string[];
  /** Optional: flag column as premium/gated · applies blur + lock pill */
  gated?: boolean;
}

export interface PropertyTableProps {
  /** Row definitions · ordered list of properties to compare */
  properties: PlayerProperty[];
  /** Column definitions · ordered list of players (first 3 visible · rest gated) */
  players: PlayerColumn[];
  /**
   * Number of visible columns before gating begins.
   * Remaining cols show blurred values + lock pill.
   * @default 3
   */
  gatedFrom?: number;
  /**
   * Row density · controls row height via TableShell context.
   * comfortable=45px (default) · standard=40px · compact=28px · spacious=48px
   * @default 'comfortable'
   */
  density?: TableDensity;
  /**
   * Stick the header to the top of the scroll container.
   * Set true for tables with >12 rows where header context is lost on scroll.
   * @default false
   */
  stickyHeader?: boolean;
  /**
   * Max height when stickyHeader=true. Creates v-scroll context inside wrapper.
   * @default '400px'
   */
  maxHeight?: string | number;
  /**
   * Card: bordered rounded card (Ref 1). Open: flush editorial (Ref 2).
   * @default 'card'
   */
  variant?: TableVariant;
  /**
   * Header background style passthrough to TableShell.
   * wash: periwinkle wash · transparent: border-bottom only · inverted: neutral dark + white text.
   * @default 'wash'
   */
  headerStyle?: TableHeaderStyle;
  /**
   * Surface context · light (default) or dark.
   * Controls row hover bg and ensures correct contrast on both surfaces.
   * @default 'light'
   */
  surface?: ChartSurface;
  /** Optional className passthrough on the outer wrapper */
  className?: string;
}

// ─── Inner table content (reads density from TableShell context) ──────────────

function PropertyTableInner({
  properties,
  players,
  gatedFrom,
  surface = 'light',
}: Required<Pick<PropertyTableProps, 'properties' | 'players' | 'gatedFrom'>> & { surface?: ChartSurface }) {
  const rowHeightPx = useTableDensity();
  const isDark = surface === 'dark';
  // Bible § 2.4 skip-shade: light = rgba(0,0,0,0.06) · dark = rgba(255,255,255,0.08)
  const rowHoverBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const visiblePlayers = players.slice(0, gatedFrom);
  const gatedPlayers = players.slice(gatedFrom);
  const hasGated = gatedPlayers.length > 0;

  return (
    <>
      {/* Column headers */}
      <thead>
        <tr>
          {/* Row-header column · empty cell */}
          <th
            scope="col"
            className="w-[160px] min-w-[140px] text-left py-3 pr-5 border-b border-[var(--black-200,#e5e5e5)]"
          >
            <span className="sr-only">Property</span>
          </th>

          {/* Visible player headers */}
          {visiblePlayers.map((p) => (
            <th
              key={p.name}
              scope="col"
              className="text-left py-3 pr-5 border-b border-[var(--black-200,#e5e5e5)] align-bottom"
              style={{ minWidth: '130px' }}
            >
              <p
                className="font-body font-medium text-[var(--semantic-ink-strong)]"
                style={{ fontSize: '13.5px', lineHeight: 1.25 }}
              >
                {p.name}
              </p>
              {p.descriptor && (
                <p
                  className="font-body text-[var(--semantic-ink-muted)] italic mt-0.5"
                  data-header-subtitle="true"
                  style={{ fontSize: '11px', lineHeight: 1.3 }}
                >
                  {p.descriptor}
                </p>
              )}
            </th>
          ))}

          {/* Gated column header(s) · blurred + lock */}
          {hasGated && (
            <th
              scope="col"
              className="text-left py-3 pr-5 border-b border-[var(--black-200,#e5e5e5)] align-bottom"
              style={{ minWidth: gatedPlayers.length > 1 ? `${gatedPlayers.length * 130}px` : '130px' }}
              aria-label="Premium · gated competitor data"
            >
              <div className="relative select-none">
                {/* Blurred player names · blur alone obfuscates without opacity reducing contrast ratio.
                    Removed opacity: 0.4 — axe flags low-contrast at opacity < 1 even in aria-hidden.
                    filter: blur(6px) is sufficient for gating UX per WCAG 1.4.3 intent. */}
                <div
                  aria-hidden="true"
                  style={{ filter: 'blur(6px)' }}
                >
                  {gatedPlayers.map((p) => (
                    <p
                      key={p.name}
                      className="font-body font-medium text-[var(--semantic-ink-strong)] mb-0.5"
                      style={{ fontSize: '13.5px', lineHeight: 1.25 }}
                    >
                      {p.name}
                    </p>
                  ))}
                </div>
                {/* Lock pill */}
                <span
                  className="absolute top-0 left-0 inline-flex items-center gap-1 rounded-full bg-[var(--color-foundation-black,#0a0a0c)] text-white px-2 py-0.5"
                >
                  <Lock size={9} aria-hidden="true" />
                  <span
                    className="font-body uppercase tracking-[0.1em]"
                    style={{ fontSize: '8.5px', fontWeight: 600 }}
                  >
                    {gatedPlayers.length} more · Preview only
                  </span>
                </span>
              </div>
            </th>
          )}
        </tr>
      </thead>

      {/* Rows */}
      <tbody>
        {properties.map((prop, rowIdx) => {
          const isLast = rowIdx === properties.length - 1;
          return (
            <tr
              key={prop.property}
              className="group transition-colors"
              // Bible § 2.4 skip-shade: skip one shade beyond default · surface-aware
              // Tailwind hover:bg-[] arbitrary class unreliable at compile — inline onMouseEnter
              style={{ height: `${rowHeightPx}px` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = rowHoverBg; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''; }}
            >
              {/* Row header · property name */}
              <th
                scope="row"
                className={[
                  'text-left py-3 pr-5 align-top',
                  isLast ? '' : 'border-b border-[var(--black-100,rgba(0,0,0,0.08))]',
                ].join(' ')}
              >
                <p
                  className="font-body font-medium text-[var(--semantic-ink-strong)] uppercase tracking-[0.08em]"
                  style={{ fontSize: '10.5px', lineHeight: 1.4 }}
                >
                  {prop.property}
                </p>
                {prop.sublabel && (
                  <p
                    className="font-body italic text-[var(--semantic-ink-muted)] mt-0.5"
                    style={{ fontSize: '10px', lineHeight: 1.3 }}
                  >
                    {prop.sublabel}
                  </p>
                )}
              </th>

              {/* Visible player cells */}
              {visiblePlayers.map((player) => (
                <td
                  key={player.name}
                  className={[
                    'py-3 pr-5 align-top',
                    isLast ? '' : 'border-b border-[var(--black-100,rgba(0,0,0,0.08))]',
                  ].join(' ')}
                >
                  <TruncatedText
                    className="font-body text-[var(--semantic-ink-body)]"
                    style={{ fontSize: '12.5px', lineHeight: 1.55 }}
                    tooltipMeta={`${prop.property} · ${player.name}`}
                  >
                    {player.values[rowIdx] ?? '—'}
                  </TruncatedText>
                </td>
              ))}

              {/* Gated cells · single merged cell with blurred decoy values */}
              {hasGated && (
                <td
                  className={[
                    'py-3 align-top',
                    isLast ? '' : 'border-b border-[var(--black-100,rgba(0,0,0,0.08))]',
                  ].join(' ')}
                  aria-label="Gated · requires premium access"
                >
                  <div className="relative select-none">
                    {/* Blurred decoy values · blur alone per gating UX. Removed opacity: 0.35 —
                        axe correctly flags low-contrast at opacity < 1 even when aria-hidden.
                        blur(5px) is sufficient to obfuscate values without failing WCAG 1.4.3. */}
                    <div
                      aria-hidden="true"
                      className="flex gap-5"
                      style={{ filter: 'blur(5px)' }}
                    >
                      {gatedPlayers.map((p) => (
                        <p
                          key={p.name}
                          className="font-body text-[var(--semantic-ink-body)] min-w-[120px]"
                          style={{ fontSize: '12.5px', lineHeight: 1.55 }}
                        >
                          {p.values[rowIdx] ?? '████'}
                        </p>
                      ))}
                    </div>
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PropertyTable({
  properties,
  players,
  gatedFrom = 3,
  density = 'comfortable',
  stickyHeader = false,
  maxHeight,
  variant = 'card',
  headerStyle = 'wash',
  surface = 'light',
  className,
}: PropertyTableProps) {
  const hasGated = players.length > gatedFrom;

  return (
    <div className={className}>
      <TableShell
        variant={variant}
        density={density}
        stickyHeader={stickyHeader}
        maxHeight={maxHeight}
        headerStyle={headerStyle}
        ariaLabel="Competitor property comparison matrix"
        caption="Competitor property comparison · shows property rows vs player columns"
      >
        <PropertyTableInner
          properties={properties}
          players={players}
          gatedFrom={gatedFrom}
          surface={surface}
        />
      </TableShell>

      {/* Gated CTA strip below table */}
      {hasGated && (
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span
            className="font-body text-[var(--semantic-ink-muted)] italic"
            style={{ fontSize: '12px' }}
          >
            {players.length - gatedFrom} additional competitor profile{players.length - gatedFrom > 1 ? 's' : ''} gated ·{' '}
            <strong className="font-medium not-italic text-[var(--semantic-ink-body)]">full matrix includes fleet composition · pricing bands · tech stack details</strong>
          </span>
          <a
            href="/contact-expert?ref=14-competitor-matrix"
            className="inline-flex items-center gap-1 rounded-[var(--radius-xs,5px)] bg-[var(--color-brand-red,#b01f24)] text-white px-3 py-1.5 font-body font-medium hover:bg-[#8f181d] transition-colors flex-none"
            style={{ fontSize: '12px', letterSpacing: '0.01em' }}
          >
            Talk to expert
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </div>
  );
}
