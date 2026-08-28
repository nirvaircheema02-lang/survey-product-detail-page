'use client';

/**
 * TruncatedText · adaptive text truncation with tooltip disclosure · Ken DS.
 *
 * WHY  · Table cells at narrow viewport widths clip long text (property names,
 *        opportunity titles, entity names). Native CSS ellipsis truncates but
 *        discards context — users lose the full value. TruncatedText detects
 *        actual overflow via scrollWidth/clientWidth, wraps in CellTooltip
 *        only when truly truncated (or always if alwaysShowTooltip=true).
 *
 * WHAT · Span with CSS truncation. ResizeObserver re-checks on container resize.
 *        Tooltip shows full text + optional meta line.
 *        Multi-line clamp via -webkit-line-clamp for N-line truncation.
 *
 * WHEN · Any table cell, chart label, or entity name that may overflow its container.
 *
 * WHERE · `design-system/core-v2/src/charts/primitives/TruncatedText.tsx`
 *         Exported via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <TruncatedText tooltipMeta="TAM: AUD 180 Mn · Score: 9.1">
 *          TGA GDP-compliant 3PL — Pharma cold-chain storage (Australia-wide)
 *        </TruncatedText>
 *        ```
 *
 * @module design-system/core-v2/src/charts/primitives/TruncatedText
 */

import { useRef, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { CellTooltip } from './CellTooltip';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TruncatedTextProps {
  /**
   * Full text · always shown in tooltip · truncated in cell if overflow.
   */
  children: string;
  /**
   * Max lines before truncation · default 1 (single-line ellipsis).
   * Values >1 use -webkit-line-clamp.
   * @default 1
   */
  maxLines?: number;
  /**
   * Show tooltip only when text is actually truncated · default true.
   */
  showTooltipWhenTruncated?: boolean;
  /**
   * Show tooltip always regardless of truncation · useful for cells that
   * always benefit from extra context (e.g. metric explanations).
   * @default false
   */
  alwaysShowTooltip?: boolean;
  /**
   * Extra metadata shown below the full text in the tooltip.
   * Accepts ReactNode for rich content (e.g. score chips, TAM figures).
   */
  tooltipMeta?: ReactNode;
  /**
   * Optional className on the text span.
   */
  className?: string;
  /**
   * Inline style overrides on the text span.
   */
  style?: CSSProperties;
}

// ─── Tooltip content renderer ─────────────────────────────────────────────────

function TooltipContent({ text, meta }: { text: string; meta?: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontWeight: 500 }}>{text}</span>
      {meta && (
        <span
          style={{
            color: 'rgba(26,26,46,0.60)',
            fontSize: '10px',
            borderTop: '1px solid rgba(228,226,240,0.8)',
            paddingTop: '4px',
            marginTop: '2px',
          }}
        >
          {meta}
        </span>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TruncatedText({
  children,
  maxLines = 1,
  showTooltipWhenTruncated = true,
  alwaysShowTooltip = false,
  tooltipMeta,
  className,
  style,
}: TruncatedTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  // Check truncation — scrollWidth > clientWidth (single-line)
  // or scrollHeight > clientHeight (multi-line clamp)
  const checkTruncation = () => {
    const el = textRef.current;
    if (!el) return;
    const truncated =
      maxLines === 1
        ? el.scrollWidth > el.clientWidth
        : el.scrollHeight > el.clientHeight;
    setIsTruncated(truncated);
  };

  useEffect(() => {
    checkTruncation();
    const el = textRef.current;
    if (!el) return;
    const ro = new ResizeObserver(checkTruncation);
    ro.observe(el);
    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, maxLines]);

  // CSS truncation styles
  const truncationStyle: CSSProperties =
    maxLines === 1
      ? {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'block',
        }
      : {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        };

  const shouldShowTooltip = alwaysShowTooltip || (showTooltipWhenTruncated && isTruncated);

  const textSpan = (
    <span
      ref={textRef}
      className={className}
      style={{ ...truncationStyle, ...style }}
    >
      {children}
    </span>
  );

  if (!shouldShowTooltip) {
    return textSpan;
  }

  return (
    <CellTooltip
      content={<TooltipContent text={children} meta={tooltipMeta} />}
      position="auto"
      disabled={false}
    >
      {textSpan}
    </CellTooltip>
  );
}
