/**
 * FilterSectionHeader — Atom (DS v4.3)
 *
 * WHAT: Collapsible section header for sidebar filter groups.
 * WHY:  Extracted from 4x duplicate inline patterns in ReportStoreListingDemoContent.
 *       Industries, Tags, Regions, Publish Year all share the same header anatomy:
 *       icon-in-bordered-box + uppercase label + optional count badge + chevron toggle.
 * WHEN: Inside SidebarPanel filter sections.
 * HOW:  Renders a full-width button with the reference's exact layout:
 *       [icon-box] [LABEL] [badge?] [lock?] [chevron]
 *
 * INTERACTION STATES:
 *   Default   → bg rgba(0,0,0,0.016), label color 0.45
 *   Active    → bg rgba(0,0,0,0.024), label color 0.7, icon-box border darkens
 *   Disabled  → opacity 0.55, cursor not-allowed
 *   Open      → chevron rotated 90deg
 *   Closed    → chevron at 0deg
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * FONT TOKENS: Label → var(--text-xs) 12.8px + uppercase + tracking-[0.08em]
 */
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from './Badge';

interface FilterSectionHeaderProps {
  /** Lucide icon component (already sized, e.g. <Layers size={12} />) */
  icon: ReactNode;
  /** Section label text (rendered uppercase) */
  label: string;
  /** Number of active selections — renders a black pill badge */
  activeCount?: number;
  /** Whether the section content is visible */
  isOpen?: boolean;
  /** Toggle handler — omit to make non-interactive */
  onToggle?: () => void;
  /** Whether a selection exists (darkens header styling) */
  active?: boolean;
  /** Disable interaction (Tags when no industry selected) */
  disabled?: boolean;
  /** Optional trailing element (e.g. Lock icon) */
  trailing?: ReactNode;
  /** Show/hide chevron toggle indicator */
  showChevron?: boolean;
}

export function FilterSectionHeader({
  icon,
  label,
  activeCount = 0,
  isOpen = false,
  onToggle,
  active = false,
  disabled = false,
  trailing,
  showChevron = true,
}: FilterSectionHeaderProps) {
  const isActive = active || activeCount > 0;

  return (
    <button
      data-component="FilterSectionHeader"
      onClick={disabled ? undefined : onToggle}
      className="w-full flex items-center gap-2.5 px-4 py-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
      aria-expanded={isOpen}
      style={{
        backgroundColor: isActive ? 'rgba(0,0,0,0.024)' : 'rgba(0,0,0,0.016)',
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      disabled={disabled}
    >
      {/* Icon in bordered box */}
      <div
        className="w-6 h-6 flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          borderRadius: 'var(--radius-element)',
          borderWidth: isActive ? '1px' : '1px',
          borderStyle: 'solid',
          borderColor: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)',
          backgroundColor: isActive ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,1)',
        }}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className="flex-1 text-left tracking-[0.08em] uppercase transition-colors"
        style={{
          fontSize: 'var(--text-xs)',
          color: isActive ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.45)',
        }}
      >
        {label}
      </span>

      {/* Trailing element (Lock icon, etc.) */}
      {trailing}

      {/* Active count badge */}
      {activeCount > 0 && (
        <Badge variant="pill" size="xs" theme="neutral" mode="dark">
          {activeCount}
        </Badge>
      )}

      {/* Chevron toggle */}
      {showChevron && !disabled && (
        <div
          className="w-5 h-5 flex items-center justify-center flex-shrink-0 transition-transform"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRight size={12} style={{ color: 'rgba(0,0,0,0.45)' }} />
        </div>
      )}
    </button>
  );
}
