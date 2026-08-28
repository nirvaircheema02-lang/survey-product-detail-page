/**
 * IndustryFocusBanner — Organism (DS v4.3)
 *
 * WHAT: Dark hero banner shown on the listing page when an industry is selected.
 * WHY:  Gives contextual identity to the filtered view — industry name,
 *       report count, description, and clickable sub-category pills.
 * WHEN: Top of listing mode, above the toolbar, when selectedIndustry is set.
 * HOW:  Dark bg with "Industry Focus" badge, industry heading, count,
 *       description, and sub-category pill row. Close button deselects industry.
 *
 * COLOR SYSTEM: All colors via inline style rgba(). No Tailwind color classes.
 * FONT TOKENS:
 *   Badge label       → var(--text-card-micro) 10px
 *   Industry heading  → var(--text-2xl) serif
 *   Count             → var(--text-xs) 12.8px
 *   Description       → var(--text-xs) 12.8px
 *   Sub-category pills → var(--text-xs) 12.8px
 */
import { Sparkles, X, ChevronRight } from 'lucide-react';

interface IndustryFocusBannerProps {
  industryName: string;
  reportCount: number;
  subCategories: string[];
  selectedSubs: string[];
  onToggleSub: (sub: string) => void;
  onClose: () => void;
}

export function IndustryFocusBanner({
  industryName,
  reportCount,
  subCategories,
  selectedSubs,
  onToggleSub,
  onClose,
}: IndustryFocusBannerProps) {
  return (
    <div
      data-component="IndustryFocusBanner"
      className="relative mb-5"
      style={{
        backgroundColor: 'rgba(30,30,30,1)',
        borderRadius: '12px',
        padding: '28px 32px 24px',
      }}
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-5">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5"
          style={{
            fontSize: 'var(--text-card-micro)',
            color: 'rgba(255,255,255,0.8)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '6px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <Sparkles size={12} style={{ color: 'rgba(255,255,255,0.5)' }} />
          Industry Focus
        </span>

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(30,30,30,1)]"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
          }}
          aria-label="Close industry focus"
        >
          <X size={14} />
        </button>
      </div>

      {/* Heading + count */}
      <div className="mb-2">
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-2xl)',
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.2,
          }}
        >
          {industryName}
          <span
            className="ml-3"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {reportCount.toLocaleString()} research reports
          </span>
        </h2>
      </div>

      {/* Description */}
      <p
        className="mb-5"
        style={{
          fontSize: 'var(--text-xs)',
          color: 'rgba(255,255,255,0.45)',
          maxWidth: '600px',
          lineHeight: 1.5,
        }}
      >
        Explore comprehensive market research across all {industryName.toLowerCase()} sectors and sub-categories.
      </p>

      {/* Sub-category pills */}
      {subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subCategories.map((sub) => {
            const isActive = selectedSubs.includes(sub);
            return (
              <button
                key={sub}
                onClick={() => onToggleSub(sub)}
                className="inline-flex items-center gap-1 px-3 py-1.5 cursor-pointer transition-all duration-150 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 focus-visible:ring-offset-[rgba(30,30,30,1)]"
                style={{
                  fontSize: 'var(--text-xs)',
                  borderRadius: '20px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0)',
                  color: isActive ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.55)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                {sub}
                <ChevronRight size={12} style={{ color: isActive ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)' }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
