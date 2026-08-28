/**
 * QuickAccessBar — Organism (DS v4.3)
 *
 * WHAT: Horizontal quick-access action bar for common Report Store actions.
 * WHY:  Gives users fast access to key actions (new reports, popular, formats)
 *       without scrolling through the full page.
 * WHEN: Below hero on the Report Store home page.
 * HOW:  Full-width bar with icon + label action buttons.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity.
 */
import { Sparkles, TrendingUp, FileText, BarChart3, Globe, Clock } from 'lucide-react';
// import { iconColors } from '../atoms/iconColors'; // unused after port
import { IconBadge } from '../atoms/IconBadge';

const QUICK_ACTIONS = [
  { icon: Sparkles, label: 'New This Week', sublabel: '12 reports' },
  { icon: TrendingUp, label: 'Trending', sublabel: '8 reports' },
  { icon: FileText, label: 'Full Reports', sublabel: '156 reports' },
  { icon: BarChart3, label: 'Data Packs', sublabel: '42 reports' },
  { icon: Globe, label: 'By Region', sublabel: '9 regions' },
  { icon: Clock, label: 'Coming Soon', sublabel: '4 reports' },
];

interface QuickAccessBarProps {
  onActionClick?: (label: string) => void;
}

export function QuickAccessBar({ onActionClick }: QuickAccessBarProps) {
  return (
    <div
      data-component="QuickAccessBar"
      className="w-full py-4"
      style={{
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'rgba(0,0,0,0.06)',
        backgroundColor: 'rgba(0,0,0,0.015)',
      }}
    >
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => onActionClick?.(action.label)}
              className="flex items-center gap-2.5 px-4 py-2.5 flex-shrink-0 transition-all duration-150 cursor-pointer group min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-inset"
              style={{
                borderRadius: 'var(--radius-element)',
              }}
            >
              <IconBadge icon={action.icon} size="xs" />
              <div className="text-left">
                <p
                  className="whitespace-nowrap transition-colors"
                  style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.65)' }}
                >
                  {action.label}
                </p>
                <p
                  className="whitespace-nowrap"
                  style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)' }}
                >
                  {action.sublabel}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
