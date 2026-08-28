/**
 * BrowseGrid — Organism (cross-pillar · generic)
 *
 * WHY: Browse/listing sections need consistent SectionHeading + ViewToggle (grid/list) + loading state. Reusable across pillars.
 * WHAT: Generic-typed `BrowseGrid<T>` component · SectionHeading + ViewToggle + grid OR list (per viewMode) + skeleton loaders.
 *      `renderCard(item, viewMode)` slot — consumer plugs any card type.
 * WHEN: Pillar home "Recommended for you" · "Browse Reports" sections · any toggled grid/list listing.
 * WHEN NOT: Paginated heavy listings (use CardListing) · featured carousel (use FeaturedCarousel) · stat grids (use StatsRow).
 * HOW: Generic <T extends {id: string}> · pass `items` · `renderCard` · `viewMode` · `onViewModeChange` · `loading` · header props.
 *
 * Structure: SectionWrapper → SectionHeading ←→ ViewToggle → grid/list of cards or skeletons
 */
import { useState, type ReactNode } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { ViewToggle, type ViewMode } from '../atoms/ViewToggle';
import { SkeletonCard } from '../molecules';

export interface BrowseGridProps<T> {
  /** SectionHeading label */
  label: string;
  /** SectionHeading title */
  title: string;
  /** SectionHeading subtitle */
  subtitle?: string;
  /** Items to render */
  items: T[];
  /** Render function for each item — receives the item + current viewMode */
  renderCard: (item: T, viewMode: ViewMode) => ReactNode;
  /** Custom skeleton renderer (optional — defaults to SkeletonCard) */
  renderSkeleton?: (index: number, viewMode: ViewMode) => ReactNode;
  /** Number of skeleton cards to show during loading */
  skeletonCount?: number;
  /** Count label for ViewToggle (e.g. "reports", "surveys") */
  countLabel?: string;
  /** Loading state — controlled externally */
  loading?: boolean;
  /** Background color variant */
  background?: 'white' | 'warm' | 'black';
  /** Grid columns at large breakpoint */
  columns?: 2 | 3;
  /** Controlled viewMode (optional — if omitted, managed internally) */
  viewMode?: ViewMode;
  /** Callback when view mode changes */
  onViewModeChange?: (mode: ViewMode) => void;
  /** className for outer wrapper */
  className?: string;
  /** Pass-through data-* attributes (e.g. data-component from parent organism) */
  [key: `data-${string}`]: string | undefined;
}

export function BrowseGrid<T extends { id: string }>({
  label,
  title,
  subtitle,
  items,
  renderCard,
  renderSkeleton,
  skeletonCount = 6,
  countLabel,
  loading = false,
  background = 'white',
  columns = 3,
  viewMode: controlledViewMode,
  onViewModeChange,
  className,
  ...dataProps
}: BrowseGridProps<T>) {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('grid');
  const viewMode = controlledViewMode ?? internalViewMode;

  const handleViewModeChange = (mode: ViewMode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  const gridClass = columns === 2
    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  return (
    <SectionWrapper data-component="BrowseGrid" {...dataProps} background={background} spacing="lg" maxWidth="wide" className={className}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <SectionHeading
            label={label}
            title={title}
            subtitle={subtitle}
          />
          <div className="flex-shrink-0 pt-1">
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              count={items.length}
              countLabel={countLabel}
            />
          </div>
        </div>
        <div className={viewMode === 'grid' ? gridClass : 'flex flex-col gap-4'}>
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) =>
                renderSkeleton
                  ? renderSkeleton(i, viewMode)
                  : <SkeletonCard key={`sk-${i}`} variant={viewMode} />
              )
            : items.map((item) => renderCard(item, viewMode))
          }
        </div>
      </div>
    </SectionWrapper>
  );
}
