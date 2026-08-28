/**
 * SurveyCard
 *
 * WHY · The Surveys pillar needs a card component that mirrors ReportCard's dual grid/list
 *        layout pattern so listing pages can reuse the same ViewToggle + grid/list
 *        infrastructure. Survey-specific concerns (question count, response progress bar,
 *        completion status) differ enough to warrant a dedicated molecule.
 * WHAT · Dual-layout card: grid (vertical: category+status header → icon+title →
 *        description → meta → progress bar → footer) or list (horizontal: status accent
 *        bar | icon | title+meta | progress | status+date | CTA). Composes Card,
 *        CompletionBadge, Badge, Button. Props: id, title, description, category,
 *        questionCount, responseCount, targetCount, status, date, estimatedTime, layout,
 *        onClick, className, overlayBadge.
 * WHEN · In survey listing pages and survey management dashboards within the Surveys pillar.
 *        Use `layout="grid"` in card grids; `layout="list"` in list-view toggle state.
 * WHEN NOT · Don't use for report data — use ReportCard. Don't use when no response
 *             progress data is available; the progress bar renders as 0% which is misleading.
 * WHERE · Surveys pillar pages (no current project consumer · DS sample page only)
 * HOW ·
 *   ```tsx
 *   <SurveyCard
 *     id="srv-001"
 *     title="APAC Market Pulse Survey Q2 2025"
 *     category="Market Intelligence"
 *     questionCount={12}
 *     responseCount={78}
 *     targetCount={200}
 *     status="active"
 *     date="May 2025"
 *     onClick={(id) => router.push(`/surveys/${id}`)}
 *   />
 *   ```
 *
 * @reusabilityScore 2     // Surveys pillar only
 * @a11y_status pending-review
 * @lifecycle beta
 * @promotedFrom core-v2 native
 */
import { ClipboardList, Users } from 'lucide-react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { CompletionBadge } from './CompletionBadge';
import { iconColors } from '../atoms/iconColors';
import type { ReactNode } from 'react';

export type SurveyCardLayout = 'grid' | 'list';

export interface SurveyCardProps {
  id: string;
  title: string;
  description?: string;
  category: string;
  questionCount: number;
  responseCount: number;
  targetCount: number;
  status: 'draft' | 'active' | 'completed' | 'closed';
  date: string;
  estimatedTime?: string;
  layout?: SurveyCardLayout;
  onClick?: (id: string) => void;
  className?: string;
  overlayBadge?: ReactNode;
}

export function SurveyCard({
  id,
  title,
  description,
  category,
  questionCount,
  responseCount,
  targetCount,
  status,
  date,
  estimatedTime,
  layout = 'grid',
  onClick,
  className,
  overlayBadge,
}: SurveyCardProps) {
  const progressPct = targetCount > 0 ? Math.min(100, Math.round((responseCount / targetCount) * 100)) : 0;

  if (layout === 'list') {
    return (
      <Card
        data-component="SurveyCard"
        hover
        className={`group cursor-pointer flex items-stretch overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 ${className ?? ''}`}
        onClick={() => onClick?.(id)}
      >
        {/* Left accent */}
        <div
          className="w-1.5 flex-shrink-0 self-stretch"
          style={{
            background: status === 'active'
              ? 'var(--green-700)'
              : status === 'completed'
              ? 'var(--purple-600)'
              : 'rgba(0,0,0,0.08)',
          }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-center gap-4 py-3 px-4">
          {/* Icon */}
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center"
            style={{
              borderRadius: 'var(--radius-element, 5px)',
              background: 'rgba(128, 108, 224, 0.06)',
            }}
          >
            <ClipboardList size={18} color={iconColors.content} />
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <p
              className="text-black truncate group-hover:text-black/80 transition-colors"
              style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}
            >
              {title}
            </p>
            <div className="flex items-center gap-2 mt-0.5" style={{ fontSize: 'var(--text-xs)' }}>
              <span className="text-black/40 uppercase tracking-wider">{category}</span>
              <span className="text-black/15">·</span>
              <span className="text-black/40">{questionCount} questions</span>
              {estimatedTime && (
                <>
                  <span className="text-black/15">·</span>
                  <span className="text-black/40">{estimatedTime}</span>
                </>
              )}
            </div>
          </div>

          {/* Response progress */}
          <div className="flex-shrink-0 w-24 hidden sm:block">
            <div className="flex items-center justify-between mb-1" style={{ fontSize: 'var(--text-xs)' }}>
              <span className="text-black/40">
                <Users size={10} className="inline mr-1" />
                {responseCount}/{targetCount}
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  background: progressPct >= 100 ? 'var(--purple-600)' : 'var(--green-700)',
                }}
              />
            </div>
          </div>

          {/* Status + date */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <CompletionBadge status={status} />
            <span className="text-black/30" style={{ fontSize: 'var(--text-xs)' }}>{date}</span>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0 hidden sm:block">
            <Button variant="secondary" size="xs" animatedArrow>
              View
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // ─── Grid Layout ─────────────────────────────
  return (
    <Card
      data-component="SurveyCard"
      hover
      padding="md"
      className={`group cursor-pointer flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 ${className ?? ''}`}
      onClick={() => onClick?.(id)}
    >
      {/* Header row: category + status */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant="rounded" size="xs" theme="coral" bordered>{category}</Badge>
        <CompletionBadge status={status} />
      </div>

      {/* Icon + title */}
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{
            borderRadius: 'var(--radius-element, 5px)',
            background: 'rgba(128, 108, 224, 0.06)',
          }}
        >
          <ClipboardList size={16} color={iconColors.content} />
        </div>
        <p
          className="text-black group-hover:text-black/80 transition-colors line-clamp-2"
          style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}
        >
          {title}
        </p>
      </div>

      {/* Description */}
      {description && (
        <p
          className="text-black/45 line-clamp-2 mb-3 leading-relaxed"
          style={{ fontSize: 'var(--text-xs)' }}
        >
          {description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center gap-3 mb-3" style={{ fontSize: 'var(--text-xs)' }}>
        <span className="text-black/40">{questionCount} questions</span>
        {estimatedTime && (
          <>
            <span className="text-black/15">·</span>
            <span className="text-black/40">{estimatedTime}</span>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1.5" style={{ fontSize: 'var(--text-xs)' }}>
          <span className="text-black/40">
            <Users size={10} className="inline mr-1" />
            Responses
          </span>
          <span className="text-black/50 tabular-nums">{responseCount}/{targetCount}</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPct}%`,
              background: progressPct >= 100 ? 'var(--purple-600)' : 'var(--green-700)',
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: '1px solid var(--black-200)' }}
      >
        <span className="text-black/30" style={{ fontSize: 'var(--text-xs)' }}>{date}</span>
        <Button variant="secondary" size="xs" animatedArrow>
          View Survey
        </Button>
      </div>

      {/* Optional overlay badge */}
      {overlayBadge && (
        <div className="absolute top-2 right-2">{overlayBadge}</div>
      )}
    </Card>
  );
}