'use client';

/**
 * PreviewCard — Blurred report preview card shown on the right side of the cinematic Hero.
 *
 * WHAT: A glass card (rounded-[10px], backdrop-blur, border) containing:
 *       - WindowControls molecule at the top
 *       - Chapter label + section title pair
 *       - Mini bar-chart placeholder (decorative)
 *       - PaywallOverlay blurring the lower section w/ PREMIUM Badge
 *       Consumer can pass `onExpand` to handle the maximize action.
 *
 * WHY: The preview card converts abstract "market report" into tangible content
 *      at a glance. The paywall overlay creates a desire loop (Fogg motivation)
 *      — show enough to create wanting, lock the rest. 10px radius is Ken DS
 *      card standard (ANTI_PATTERNS rule 32 — don't strip card chrome).
 *
 * WHEN: Inside ReportHeroSection right column · desktop only (hidden on mobile).
 *
 * WHEN NOT: On light editorial surfaces without `surface="light"`. Do not inline
 *           a full-page PDF render here — this is a teaser card only.
 *
 * WHERE: ReportHeroSection organism right side.
 *
 * HOW:
 * ```tsx
 * <PreviewCard
 *   chapterLabel="Chapter 2"
 *   sectionTitle="Market Overview & Definition"
 *   surface="dark"
 *   onExpand={() => setModalOpen(true)}
 * />
 * ```
 *
 * @canonical V0_lite_report-legacy/src/app/components/HeroSection.tsx preview region (L426-577)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WindowControls } from './WindowControls';
import { PaywallOverlay } from './PaywallOverlay';

export type PreviewCardSurface = 'dark' | 'light';

export interface PreviewCardProps {
  /** Chapter eyebrow label. E.g. "Chapter 2". */
  chapterLabel?: string;
  /** Section title shown in the card. */
  sectionTitle?: string;
  /** Preview body excerpt text (gets blurred by paywall). */
  bodyExcerpt?: string;
  /** Surface variant. "dark" = glass dark card; "light" = light card. */
  surface?: PreviewCardSurface;
  /** Called when expand icon is clicked. */
  onExpand?: () => void;
  /** Paywall CTA label. Default: "Unlock Full Report". */
  paywallLabel?: string;
  /** Called when paywall CTA is clicked. */
  onPaywallCTA?: () => void;
  className?: string;
}

/** Mini bar chart — decorative placeholder */
function MiniChart({ isDark }: { isDark: boolean }) {
  const heights = [40, 60, 45, 80, 65, 55, 75];
  const barGrad = isDark
    ? 'linear-gradient(to top, rgba(223,234,250,0.25), rgba(223,234,250,0.55))'
    : 'linear-gradient(to top, rgba(128,108,224,0.12), rgba(128,108,224,0.32))';

  return (
    <div
      className="rounded-[5px] p-3"
      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
      aria-hidden="true"
    >
      <div
        className="flex justify-between mb-2"
        style={{
          fontSize: 'var(--text-xs)',
          color: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)',
        }}
      >
        <span>Revenue ($B)</span>
        <span>2020–2026</span>
      </div>
      <div className="flex h-16 items-end gap-1.5" role="img" aria-label="Mini bar chart placeholder">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[2px]"
            style={{ height: `${h}%`, background: barGrad }}
          />
        ))}
      </div>
    </div>
  );
}

export function PreviewCard({
  chapterLabel = 'Chapter 2',
  sectionTitle = 'Market Overview & Definition',
  bodyExcerpt = 'AI in healthcare encompasses machine learning, NLP, and computer vision applied to medical applications…',
  surface = 'dark',
  onExpand,
  paywallLabel = 'Unlock Full Report',
  onPaywallCTA,
  className = '',
}: PreviewCardProps) {
  const isDark = surface === 'dark';

  const cardBg = isDark
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(255,255,255,0.90)';
  const cardBorder = isDark
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(0,0,0,0.08)';
  const headingColor = isDark ? 'rgba(255,255,255,0.90)' : 'rgba(0,0,0,0.90)';
  const labelColor = isDark ? 'rgba(255,255,255,0.40)' : 'rgba(0,0,0,0.40)';
  const bodyColor = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.60)';

  return (
    <motion.div
      data-component="PreviewCard"
      className={`relative group cursor-pointer ${className}`}
      style={{
        background: cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${cardBorder}`,
        borderRadius: '10px',
        boxShadow: isDark
          ? '0 10px 20px rgba(0,0,0,0.30)'
          : '0 10px 20px rgba(0,0,0,0.10)',
        padding: 'var(--card-padding-lg, 1.5rem)',
      }}
      whileHover={{
        scale: 1.015,
        boxShadow: isDark
          ? '0 20px 32px rgba(0,0,0,0.40)'
          : '0 20px 32px rgba(0,0,0,0.16)',
      }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={onExpand}
    >
      {/* Expand button — visible on hover */}
      {onExpand && (
        <motion.button
          type="button"
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          aria-label="Expand report preview"
          className="absolute top-4 right-4 p-2 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Maximize2
            className="h-4 w-4"
            aria-hidden="true"
            style={{ color: isDark ? 'rgba(255,255,255,0.60)' : 'rgba(0,0,0,0.60)' }}
          />
        </motion.button>
      )}

      {/* Window controls */}
      <div className="mb-4">
        <WindowControls label="Sample Preview" colorScheme={surface} />
      </div>

      {/* Chapter + title */}
      <div className="space-y-1 mb-3">
        <div
          className="uppercase tracking-wide"
          style={{ fontSize: 'var(--text-xs)', color: labelColor }}
        >
          {chapterLabel}
        </div>
        <div
          className="font-medium leading-snug"
          style={{ fontSize: 'var(--text-sm)', color: headingColor }}
        >
          {sectionTitle}
        </div>
      </div>

      {/* Body excerpt */}
      <p
        className="leading-relaxed mb-3"
        style={{ fontSize: 'var(--text-xs)', color: bodyColor }}
      >
        {bodyExcerpt}
      </p>

      {/* Mini chart */}
      <MiniChart isDark={isDark} />

      {/* Paywall overlay on the lower section */}
      <div className="relative mt-3">
        <PaywallOverlay
          onCTA={onPaywallCTA}
          ctaLabel={paywallLabel}
          surface={surface}
        >
          {/* Blurred content (ghost rows simulating locked data) */}
          <div
            className="space-y-2 p-3 rounded-[5px]"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
            }}
            aria-hidden="true"
          >
            <div
              style={{ fontSize: 'var(--text-xs)', color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.30)' }}
            >
              Regional Market Distribution
            </div>
            {[100, 80, 75].map((w, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  height: '8px',
                  width: `${w}%`,
                  background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)',
                }}
              />
            ))}
          </div>
        </PaywallOverlay>
      </div>
    </motion.div>
  );
}
