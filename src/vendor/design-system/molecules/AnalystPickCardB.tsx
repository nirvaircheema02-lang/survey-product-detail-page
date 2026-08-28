/**
 * AnalystPickCardB
 *
 * WHY · Analyst-first editorial card variant: leads with analyst identity + quote before the
 *        report content, reversing the standard report-first composition of AnalystPickCard.
 *        Exists to surface expert credibility as the primary trust signal.
 * WHAT · Renders analyst avatar + name/role → blockquote → embedded report mini-card → like
 *        counter + "Explore Resources" CTA. Props: id, image, title, industry, region, date,
 *        quote, analystName, analystRole, analystInitials, saved, onToggleSave, onClick.
 * WHEN · Use in "Analyst Picks" horizontal carousels and editorial spotlight sections where
 *        the analyst's recommendation is the hook (not the report title).
 * WHEN NOT · Don't use when the report title/thumbnail should lead — use ReportCard or
 *             ReportGridCard instead. Don't use outside a HorizontalScroll container; it's
 *             optimised for fixed-width carousel contexts.
 * WHERE · report-store-legacy AnalystPicks.tsx · competition-benchmarking-listing-v02 AnalystPicks.tsx
 * HOW ·
 *   ```tsx
 *   <AnalystPickCardB
 *     id="rpt-001"
 *     image="/covers/rpt-001.jpg"
 *     title="Global EV Battery Market 2025"
 *     industry="Automotive"
 *     region="Asia Pacific"
 *     date="May 2025"
 *     quote="This report redefines how we model battery degradation curves at scale."
 *     analystName="Priya Mehta"
 *     analystInitials="PM"
 *     onClick={(id) => router.push(`/reports/${id}`)}
 *   />
 *   ```
 *
 * @reusabilityScore 2     // used in AnalystPicks carousel · not cross-pillar
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { ThumbsUp, Award } from "lucide-react";
import React from "react";
import { ImageWithFallback } from '../atoms/ImageWithFallback';
import { Badge } from '../atoms/Badge';
import { IndustryBadge } from './IndustryBadge';
import { CardMetaRow } from './CardMetaRow';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';

interface AnalystPickCardBProps {
  id: string;
  image: string;
  title: string;
  industry: string;
  region: string;
  date?: string;
  quote: string;
  analystName: string;
  analystRole?: string;
  analystInitials: string;
  saved?: boolean;
  onToggleSave?: () => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function AnalystPickCardB({ id, image, title, industry, region, date, quote, analystName, analystRole = "Analyst", analystInitials, saved: _saved = false, onToggleSave: _onToggleSave, onClick, className }: AnalystPickCardBProps) {
  return (
    <Card data-component="AnalystPickCardB" hover padding="md" className={`group cursor-pointer flex flex-col h-full ${className || ""}`} onClick={() => onClick?.(id)}>
      {/* Analyst header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--warm-300)", color: "rgba(0,0,0,0.45)", fontSize: "var(--text-card-micro)", fontWeight: 500 }}>
          {analystInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-black/80 truncate" style={{ fontSize: "var(--text-xs)", fontWeight: 500 }}>{analystName}</p>
          <p className="text-black/35 truncate" style={{ fontSize: "var(--text-xs)" }}>{analystRole}</p>
        </div>
        <Badge variant="rounded" size="xs" theme="coral" bordered>
          <Award className="h-3 w-3" />
          Expert Pick
        </Badge>
      </div>

      {/* Blockquote */}
      <blockquote className="text-black/45 italic leading-relaxed line-clamp-3 mb-5 pl-3.5" style={{ fontSize: "var(--text-nav)", borderLeft: "2px solid var(--coral-500)" }}>
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Embedded report mini-card */}
      <div className="flex items-stretch gap-0 mb-4 overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: "var(--rc-radius-card-inner)", background: "var(--warm-200)" }}>
        <div className="relative w-16 flex-shrink-0 self-stretch overflow-hidden" style={{ borderRadius: "var(--rc-radius-image)" }}>
          <ImageWithFallback src={image} alt={title} className="absolute inset-0 w-full h-full object-cover img-zoom" />
        </div>
        <div className="flex-1 min-w-0 p-3.5">
          <IndustryBadge className="mb-1">{industry}</IndustryBadge>
          <h4 className="text-black/75 line-clamp-2 group-hover:text-black transition-colors leading-snug" style={{ fontSize: "var(--text-nav)", fontWeight: 500 }}>{title}</h4>
          <div className="mt-1.5">
            <CardMetaRow region={region} date={date} variant="B" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: "1px solid var(--warm-500)" }}>
        <div className="flex items-center gap-3">
          <LikeCounter />
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="xs" animatedArrow onClick={() => onClick?.(id)}>
            Explore Resources
          </Button>
        </div>
      </div>
    </Card>
  );
}

function LikeCounter() {
  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(() => Math.floor(Math.random() * 40) + 5);

  return (
    <button
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 ${liked ? "text-[var(--green-600)] bg-[var(--green-50)]" : "text-black/25 hover:text-black/50 hover:bg-black/[0.03]"}`}
      style={{ fontSize: "var(--text-xs)", border: liked ? "1px solid var(--green-500)" : "1px solid rgba(0,0,0,0)" }}
      onClick={(e) => { e.stopPropagation(); setLiked((prev) => { setCount((c) => (prev ? c - 1 : c + 1)); return !prev; }); }}
      title={liked ? "Remove like" : "Like this pick"}
    >
      <ThumbsUp className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} strokeWidth={2} />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}