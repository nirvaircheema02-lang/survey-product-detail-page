/**
 * EmptyState — Molecule (DS v4.3)
 *
 * WHAT: Reusable empty/no-results state with icon, title, description, and optional action.
 * WHY:  Provides a consistent zero-result fallback across listing pages.
 * WHEN: Inside CardListing when filters return 0 results.
 * HOW:  Dashed border card with icon circle + title + description + action slot.
 *
 * INTERACTION STATES:
 *   Default     → Dashed border with warm tint background
 *   With action → Action element (Button, link, etc.) rendered below description
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * FONT TOKENS: Title → var(--text-xs), Description → var(--text-xs), Action → inherits.
 */
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title = 'No results found',
  description = 'Try adjusting your filters or search query to find reports.',
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-component="EmptyState"
      className={`text-center py-20 ${className || ''}`}
      style={{
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: 'rgba(0,0,0,0.12)',
        borderRadius: 'var(--radius-element)',
        backgroundColor: 'rgba(0,0,0,0.015)',
        animation: 'fadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}
    >
      <div
        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
      >
        {icon || <Search className="h-5 w-5" style={{ color: 'rgba(0,0,0,0.3)' }} />}
      </div>
      {title && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.6)' }}>
          {title}
        </p>
      )}
      {description && (
        <p className="mt-1" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
