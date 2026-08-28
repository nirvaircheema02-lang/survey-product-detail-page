/**
 * CategoryListCard — Molecule (DS v4.3)
 *
 * WHAT: Card containing a list of CategoryListItems with a header and optional footer.
 * WHY:  Used for "Browse by Industry" or "Browse by Region" compact cards
 *       that show a vertical list of navigable categories with counts.
 * WHEN: Report Store home page sidebar, explore sections, quick-nav cards.
 * HOW:  Composes Card + SectionHeading (compact) + CategoryListItem rows.
 *
 * COLOR SYSTEM: Card border rgba(0,0,0,0.08), dividers rgba(0,0,0,0.04).
 */
import { Card } from '../atoms/Card';
import { CategoryListItem } from '../atoms/CategoryListItem';
import type { LucideIcon } from 'lucide-react';

interface CategoryItem {
  label: string;
  count?: number;
  icon?: LucideIcon;
}

interface CategoryListCardProps {
  /** Card title */
  title: string;
  /** Optional label above title */
  label?: string;
  /** Category items to render */
  items: CategoryItem[];
  /** Currently selected category label */
  activeLabel?: string;
  /** Callback when a category is clicked */
  onSelect?: (label: string) => void;
  /** Whether to show chevrons on items */
  showChevrons?: boolean;
  /** Max items to show before truncating (0 = show all) */
  maxVisible?: number;
  /** Footer content */
  footer?: React.ReactNode;
  /** Additional className */
  className?: string;
}

export function CategoryListCard({
  title,
  label,
  items,
  activeLabel,
  onSelect,
  showChevrons = true,
  maxVisible = 0,
  footer,
  className = '',
}: CategoryListCardProps) {
  const visibleItems = maxVisible > 0 ? items.slice(0, maxVisible) : items;
  const hasMore = maxVisible > 0 && items.length > maxVisible;

  return (
    <Card
      data-component="CategoryListCard"
      className={className}
      shadow="sm"
      padding="none"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        {label && (
          <span
            className="block uppercase tracking-[0.1em] mb-1"
            style={{ fontSize: 'var(--text-card-micro)', color: 'rgba(0,0,0,0.4)' }}
          >
            {label}
          </span>
        )}
        <h3 style={{ fontSize: 'var(--text-base)', color: 'rgba(0,0,0,0.9)' }}>
          {title}
        </h3>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }} />

      {/* Items */}
      <div className="py-1">
        {visibleItems.map((item) => (
          <CategoryListItem
            key={item.label}
            label={item.label}
            count={item.count}
            icon={item.icon}
            active={activeLabel === item.label}
            showChevron={showChevrons}
            onClick={() => onSelect?.(item.label)}
          />
        ))}
      </div>

      {/* More indicator */}
      {hasMore && (
        <div className="px-4 py-2" style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'rgba(0,0,0,0.04)' }}>
          <button
            className="w-full text-center transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
            style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.4)' }}
            onClick={() => onSelect?.('__view_all__')}
          >
            +{items.length - maxVisible} more
          </button>
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'rgba(0,0,0,0.06)' }}>
          {footer}
        </div>
      )}
    </Card>
  );
}