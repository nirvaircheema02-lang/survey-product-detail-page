/**
 * ReportCard
 *
 * WHY · The core deliverable of the Ken Research platform is the market report. Every
 *        listing page, carousel, and search result displays report cards. A single
 *        composable component with `variant` prop prevents grid/list/compact/featured
 *        drifting into separate codebases.
 * WHAT · Unified card rendering across 4 variants:
 *        - `grid` (default): vertical card — image → badge → title → meta → footer
 *        - `list`: horizontal — thumbnail | content | date + CTA
 *        - `compact`: ranked list item with small thumbnail (IndustryReportSection top-N)
 *        - `featured`: full-bleed hero overlay with CTA prominent (FeaturedResearch section)
 *        Composes Card, ImageWithFallback, IndustryBadge, CardMetaRow, CardFooterRow,
 *        Button, Badge. Props: id, image, title, industry, subcat, projection, region,
 *        date, onClick, variant, overlayBadge, aspectRatio, className, metaVariant,
 *        description, ctaLabel, rank.
 * WHEN · Primary card for all report listing pages, featured sections, carousels, and
 *        search results. Use `variant="grid"` (default) in grids; `variant="list"` in
 *        list-view toggle state; `variant="compact"` in top-N ranked lists;
 *        `variant="featured"` for hero spotlight.
 * WHEN NOT · Analyst quote-led card → AnalystPickCardB. Data-highlight stats →
 *             DataHighlightCard. Deprecated `ReportGridCard` wrapper → don't import for
 *             new code.
 * WHERE · report-store-legacy App.tsx · FeaturedResearch.tsx · IndustryReportSection.tsx ·
 *          competition-benchmarking-listing-v02 · V0.2_report
 * HOW ·
 *   ```tsx
 *   // Grid layout (default)
 *   <ReportCard id="rpt-001" image="/img.jpg" title="EV Battery 2025"
 *     industry="Automotive" region="Asia Pacific" date="May 2025"
 *     projection="12% CAGR" onClick={(id) => router.push(`/reports/${id}`)} />
 *
 *   // List layout
 *   <ReportCard {...props} variant="list" description="A 280-page deep-dive..." />
 *
 *   // Compact ranked item
 *   <ReportCard {...props} variant="compact" rank={1} />
 *
 *   // Featured hero
 *   <ReportCard {...props} variant="featured" />
 *   ```
 *
 * IMAGE BADGE OVERLAYS:
 *   Badges on image layers need higher-opacity backgrounds than standard dark-mode Badges
 *   (which use ~15-20% opacity designed for dark page backgrounds). Overrides push
 *   backgrounds to 55-65% with backdrop-blur for readability over any image content.
 *   Ken red tokenized via `color-mix(in srgb, var(--brand-red) X%, transparent)`.
 *
 * @parity-merged legacy ReportCard.tsx features on 2026-05-15:
 *   ✓ compact variant (IndustryReportSection top-N ranked lists)
 *   ✓ featured variant (FeaturedResearch hero · large image · CTA prominent)
 *   ✓ Image-badge backdrop-blur overlay (brand red tokenized via color-mix)
 *   ✓ List-mode mobile CTA visible (was hidden <sm — regression fixed)
 *   ✓ Grid gradient strength upgraded: from-black/40 (matches legacy cinematic level)
 *   ✓ Dropped legacy show* flag props — null = hidden pattern retained (cleaner)
 *   ✓ Dropped save/bookmark (intentionally deferred per core-v2 decision)
 *   ✓ Entrance stagger stays at caller (not card responsibility)
 *
 * @reusabilityScore 5     // primary card · every listing page in the workspace
 * @a11y_status pass       // focus-visible · aria-pressed · role=article · keyboard
 * @lifecycle stable
 * @promotedFrom core-v2 native · extended 2026-05-15
 */
'use client';

import { ImageWithFallback } from '../atoms/ImageWithFallback';
import { IndustryBadge } from './IndustryBadge';
import { CardMetaRow } from './CardMetaRow';
import { CardFooterRow } from './CardFooterRow';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { TrendingUp, Crown, ArrowRight, MapPin } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { CardMetaVariant } from './CardMetaRow';

// ─── Variant type ─────────────────────────────────────────────────────────────

export type ReportCardVariant = 'grid' | 'list' | 'compact' | 'featured';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ReportCardProps {
  id: string;
  image: string;
  title: string;
  industry: string;
  subcat?: string;
  projection?: string | null;
  region: string;
  date: string;
  onClick?: (id: string) => void;
  /** Card display variant. Default: 'grid'. */
  variant?: ReportCardVariant;
  /** Overlay badge node rendered top-left on grid image. Null = hidden. */
  overlayBadge?: ReactNode;
  /** Aspect ratio for grid image (default '16/9'). */
  aspectRatio?: string;
  className?: string;
  metaVariant?: CardMetaVariant;
  /** Optional description shown in list layout only. */
  description?: string;
  /** CTA label for list layout (default: 'View Report'). */
  ctaLabel?: string;
  /** Rank position (1-indexed) for compact variant. */
  rank?: number;
  /**
   * Badge string rendered on the image overlay (grid / featured / compact).
   * Maps to Badge theme automatically. Null = hidden.
   * @example "Featured" | "Hot" | "New"
   */
  badge?: string | null;
  /**
   * @deprecated Use `variant` instead. Kept for backward-compat with existing
   * consumers that pass `layout="grid"|"list"`. Merged 2026-05-15.
   */
  layout?: 'grid' | 'list';
}

// ─── Image-badge overlay helpers ──────────────────────────────────────────────

/**
 * Maps a badge label to a Badge `theme` for dark/image-overlay contexts.
 * "hot" or "featured" → brand (Ken red). Everything else → neutral.
 */
function getImageBadgeTheme(badge: string): 'brand' | 'neutral' | 'success' {
  const lower = badge.toLowerCase();
  if (lower === 'hot' || lower === 'featured') return 'brand';
  return 'neutral';
}

/**
 * CSS overrides for Badges placed on image layers.
 * Standard dark-mode Badge backgrounds (~15-20% opacity) are unreadable over images.
 * These push to 55-65% with backdrop-blur.
 * Ken red: tokenized via color-mix(in srgb, var(--brand-red) X%, transparent)
 * to avoid hardcoding #b01f24.
 */
const IMAGE_BADGE_BASE: CSSProperties = {
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
};

const IMAGE_BADGE_OVERRIDES: Record<string, CSSProperties> = {
  brand: {
    ...IMAGE_BADGE_BASE,
    '--badge-bg': 'color-mix(in srgb, var(--brand-red) 65%, transparent)',
    '--badge-border': 'color-mix(in srgb, var(--brand-red) 80%, transparent)',
    '--badge-text': 'rgba(255, 255, 255, 0.95)',
    '--badge-hover-bg': 'color-mix(in srgb, var(--brand-red) 75%, transparent)',
    '--badge-hover-border': 'color-mix(in srgb, var(--brand-red) 90%, transparent)',
  } as CSSProperties,
  neutral: {
    ...IMAGE_BADGE_BASE,
    '--badge-bg': 'rgba(0, 0, 0, 0.55)',
    '--badge-border': 'rgba(255, 255, 255, 0.12)',
    '--badge-text': 'rgba(255, 255, 255, 0.92)',
    '--badge-hover-bg': 'rgba(0, 0, 0, 0.65)',
    '--badge-hover-border': 'rgba(255, 255, 255, 0.2)',
  } as CSSProperties,
  success: {
    ...IMAGE_BADGE_BASE,
    '--badge-bg': 'rgba(34, 197, 94, 0.22)',
    '--badge-border': 'rgba(34, 197, 94, 0.5)',
    '--badge-text': 'rgba(187, 247, 208, 1)',
    '--badge-hover-bg': 'rgba(34, 197, 94, 0.3)',
    '--badge-hover-border': 'rgba(34, 197, 94, 0.65)',
  } as CSSProperties,
};

function getImageBadgeStyle(theme: string): CSSProperties {
  return IMAGE_BADGE_OVERRIDES[theme] ?? IMAGE_BADGE_BASE;
}

// ─── Grid variant ─────────────────────────────────────────────────────────────

function GridCard({
  id,
  image,
  title,
  industry,
  subcat,
  projection,
  region,
  date,
  onClick,
  overlayBadge,
  aspectRatio = '16/9',
  className,
  metaVariant = 'A',
  badge,
}: ReportCardProps) {
  const badgeTheme = badge ? getImageBadgeTheme(badge) : undefined;

  return (
    <Card
      data-component="ReportCard"
      as="div"
      hover
      className={`group cursor-pointer overflow-hidden flex flex-col ${className || ''}`}
      onClick={() => onClick?.(id)}
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover img-zoom"
        />
        {/* Cinematic gradient — from-black/40 matches legacy immersive level */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Image badge — top left */}
        {badge && badgeTheme && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="rounded"
              size="xs"
              theme={badgeTheme}
              mode="dark"
              bordered
              style={getImageBadgeStyle(badgeTheme)}
            >
              {badge}
            </Badge>
          </div>
        )}

        {/* Caller-provided overlay badge (e.g. rank, custom) */}
        {overlayBadge && (
          <div className="absolute top-3 right-3">{overlayBadge}</div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2.5">
        <IndustryBadge>{subcat || industry}</IndustryBadge>
        <h3
          className="text-black/85 group-hover:text-black transition-colors line-clamp-2 leading-snug"
          style={{ fontSize: 'var(--text-nav)' }}
          title={title}
        >
          {title}
        </h3>
        <CardMetaRow
          projection={metaVariant === 'A' ? projection : null}
          region={region}
          date={metaVariant === 'B' ? date : undefined}
          variant={metaVariant}
        />
        {metaVariant === 'A' && <CardFooterRow date={date} />}
      </div>
    </Card>
  );
}

// ─── List variant ─────────────────────────────────────────────────────────────

function ListCard({
  id,
  image,
  title,
  industry,
  subcat,
  projection,
  region,
  date,
  onClick,
  overlayBadge,
  className,
  metaVariant = 'A',
  description,
  ctaLabel = 'View Report',
}: ReportCardProps) {
  return (
    <Card
      data-component="ReportCard"
      hover
      className={`group cursor-pointer overflow-hidden ${className || ''}`}
      onClick={() => onClick?.(id)}
    >
      <div className="flex">
        {/* Thumbnail — fixed width, self-stretching */}
        <div className="relative w-20 sm:w-28 md:w-36 flex-shrink-0 overflow-hidden self-stretch">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover img-zoom"
          />
          {overlayBadge && (
            <div className="absolute top-1.5 left-1.5">{overlayBadge}</div>
          )}
        </div>

        {/* Main content — fills available space */}
        <div className="flex-1 min-w-0 flex flex-col py-3 px-3 sm:px-4 gap-1.5">
          <IndustryBadge>{subcat || industry}</IndustryBadge>
          <h3
            className="text-black/85 group-hover:text-black transition-colors line-clamp-2 leading-snug"
            style={{ fontSize: 'var(--text-nav)' }}
            title={title}
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-black/45 line-clamp-1 hidden sm:block"
              style={{ fontSize: 'var(--text-xs)' }}
            >
              {description}
            </p>
          )}
          <CardMetaRow
            projection={metaVariant === 'A' ? projection : null}
            region={region}
            date={metaVariant === 'B' ? date : undefined}
            variant={metaVariant}
            className="flex items-center gap-1.5 flex-wrap mt-auto"
          />

          {/* Mobile CTA — visible below sm breakpoint (was regressed to hidden) */}
          <div className="flex sm:hidden items-center mt-1">
            <Button
              variant="secondary"
              size="xs"
              animatedArrow
              onClick={(e) => { e?.stopPropagation?.(); onClick?.(id); }}
            >
              {ctaLabel}
            </Button>
          </div>
        </div>

        {/* Right column — meta + CTA, desktop only */}
        <div className="hidden sm:flex flex-col items-end justify-between flex-shrink-0 py-3 pr-4 gap-2">
          <span
            className="text-black/35 whitespace-nowrap"
            style={{ fontSize: 'var(--text-xs)' }}
          >
            {date}
          </span>

          {projection && (
            <span
              className="flex items-center gap-1 whitespace-nowrap"
              style={{ fontSize: 'var(--text-xs)', color: 'var(--green-700)' }}
            >
              <TrendingUp className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              {projection}
            </span>
          )}

          <Button
            variant="secondary"
            size="xs"
            animatedArrow
            onClick={(e) => { e?.stopPropagation?.(); onClick?.(id); }}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Compact variant ──────────────────────────────────────────────────────────

/**
 * CompactCard — Ranked list item with small thumbnail.
 * Used in IndustryReportSection top-N lists. Narrow row, minimal meta.
 * `rank` prop 1-3 renders dark accent badge; 4+ renders muted.
 */
function CompactCard({
  id,
  image,
  title,
  industry,
  subcat,
  projection,
  region,
  onClick,
  rank,
  className,
}: ReportCardProps) {
  return (
    <div
      data-component="ReportCard"
      role="article"
      className={`flex items-center gap-4 p-4 cursor-pointer group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset ${className || ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0)' }}
      tabIndex={0}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(id); } }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.03)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0)'; }}
    >
      {/* Rank badge */}
      {rank != null && (
        <div
          className="w-8 h-8 flex items-center justify-center flex-shrink-0 tabular-nums"
          aria-label={`Rank ${rank}`}
          style={{
            fontSize: 'var(--text-xs)',
            borderRadius: 'var(--radius-element)',
            backgroundColor: rank <= 3 ? 'var(--text-primary)' : 'var(--warm-500)',
            color: rank <= 3 ? 'var(--color-surface-primary, rgb(255,255,255))' : 'rgba(0,0,0,0.5)',
          }}
        >
          {rank}
        </div>
      )}

      {/* Thumbnail */}
      <div
        className="w-12 aspect-[2/3] overflow-hidden flex-shrink-0"
        style={{
          borderRadius: 'var(--rc-radius-image)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--warm-500)',
        }}
      >
        <ImageWithFallback
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover img-zoom"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-black/80 truncate group-hover:text-black transition-colors"
          style={{ fontSize: 'var(--text-nav)' }}
          title={title}
        >
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <IndustryBadge>{subcat || industry}</IndustryBadge>
        </div>
      </div>

      {/* Meta — desktop */}
      <div
        className="hidden sm:flex items-center gap-5 flex-shrink-0"
        style={{ fontSize: 'var(--text-xs)' }}
      >
        <span className="text-black/40 flex items-center gap-1">
          <MapPin className="h-3 w-3" aria-hidden="true" style={{ color: 'rgba(0,0,0,0.35)' }} />
          {region}
        </span>
        {projection && (
          <span
            className="flex items-center gap-1 tabular-nums"
            style={{ color: 'var(--green-600)' }}
          >
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {projection}
          </span>
        )}
      </div>

      <ArrowRight
        className="h-4 w-4 flex-shrink-0 transition-colors"
        aria-hidden="true"
        style={{ color: 'rgba(0,0,0,0.3)' }}
      />
    </div>
  );
}

// ─── Featured variant ─────────────────────────────────────────────────────────

/**
 * FeaturedCard — Full-bleed hero overlay.
 * Used in FeaturedResearch section. Large image, gradient overlay, CTA prominent.
 * Renders "Featured" crown badge + optional report badge top-left.
 * Region meta top-right. Industry + projection badges above title.
 */
function FeaturedCard({
  id,
  image,
  title,
  industry,
  projection,
  region,
  onClick,
  badge,
  className,
}: ReportCardProps) {
  const badgeTheme = badge ? getImageBadgeTheme(badge) : undefined;

  return (
    <article
      data-component="ReportCard"
      className={`group relative overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] ${className || ''}`}
      style={{ borderRadius: 'var(--rc-radius-card)' }}
      tabIndex={0}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(id); } }}
    >
      <ImageWithFallback
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover img-zoom"
      />

      {/* Deep cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/5 pointer-events-none" />

      <div className="absolute inset-0 p-7 flex flex-col justify-end">
        {/* Top-left: Featured badge + optional report badge */}
        <div className="absolute top-5 left-5 flex gap-2">
          <Badge
            variant="rounded"
            size="xs"
            theme="brand"
            mode="dark"
            bordered
            style={getImageBadgeStyle('brand')}
          >
            <Crown className="h-3 w-3" aria-hidden="true" />
            Featured
          </Badge>
          {badge && badgeTheme && (
            <Badge
              variant="rounded"
              size="xs"
              theme={badgeTheme}
              mode="dark"
              bordered
              style={getImageBadgeStyle(badgeTheme)}
            >
              {badge}
            </Badge>
          )}
        </div>

        {/* Top-right: region */}
        <div className="absolute top-5 right-5 flex items-center gap-2.5">
          <span
            className="flex items-center gap-1"
            style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.6)' }}
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {region}
          </span>
        </div>

        {/* Content overlay: industry + projection badges → title → CTA */}
        <div className="flex items-center gap-2.5 mb-3">
          <Badge
            variant="rounded"
            size="xs"
            theme="neutral"
            mode="dark"
            bordered
            style={getImageBadgeStyle('neutral')}
          >
            {industry}
          </Badge>
          {projection && (
            <Badge
              variant="rounded"
              size="xs"
              theme="success"
              mode="dark"
              bordered
              style={getImageBadgeStyle('success')}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              {projection}
            </Badge>
          )}
        </div>

        <h3
          className="text-white mb-4 max-w-lg leading-snug"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: 'var(--text-base)',
          }}
        >
          {title}
        </h3>

        <div onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="xs"
            background="dark"
            animatedArrow
            onClick={() => onClick?.(id)}
          >
            Read Report
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Main export — variant dispatcher ─────────────────────────────────────────

export function ReportCard(props: ReportCardProps) {
  // Resolve variant: explicit `variant` wins, then `layout` back-compat alias, then 'grid'.
  const resolved = props.variant ?? (props.layout as ReportCardVariant | undefined) ?? 'grid';

  switch (resolved) {
    case 'list':     return <ListCard {...props} />;
    case 'compact':  return <CompactCard {...props} />;
    case 'featured': return <FeaturedCard {...props} />;
    case 'grid':
    default:         return <GridCard {...props} />;
  }
}
