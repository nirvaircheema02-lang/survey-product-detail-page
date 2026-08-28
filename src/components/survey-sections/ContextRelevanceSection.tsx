'use client';

/**
 * ContextRelevanceSection — "Why run this survey now"
 *
 * @what  One continuous editorial 3-column composition (If you are / You're likely
 *        facing / This will help answer) replacing 3 separately-bordered cards from
 *        Figma. A single internal vertical hairline (desktop only) replaces the card
 *        perimeter borders — no drop shadows, no oversized colored icon boxes.
 * @why   De-boxing brief: retain the 3 information groups + existing content, remove
 *        the outer card containment. Whitespace + typography carry the separation.
 */

import { Users, AlertTriangle, CircleHelp, Check } from 'lucide-react';
import { SectionHeading, SectionLabel, SectionWrapper } from '@kenresearch/design-system/atoms';

interface ContextColumn {
  icon: typeof Users;
  heading: string;
  items: string[];
}

const COLUMNS: ContextColumn[] = [
  {
    icon: Users,
    heading: 'If you are...',
    items: [
      'Bank SME lending head',
      'NBFC product or credit leader',
      'Distribution or channel head',
      'Fintech SME growth team',
      'Strategy lead, retail lending',
    ],
  },
  {
    icon: AlertTriangle,
    heading: "You're likely facing...",
    items: [
      'SME fit confusion: bank vs NBFC',
      'Drop-offs at documentation stage',
      'Banks perceived stable but slow',
      'NBFCs perceived fast but expensive',
      'Renewal switching over service gaps',
    ],
  },
  {
    icon: CircleHelp,
    heading: 'This will help answer...',
    items: [
      'Preference drivers beyond rate',
      'Funnel drop-off stage mapping',
      'Segment splits by lender type',
      'Fee and tenure tolerance bands',
      'Renewal and switch triggers',
    ],
  },
];

export function ContextRelevanceSection() {
  return (
    <SectionWrapper
      id="context-relevance"
      aria-labelledby="context-relevance-heading"
      background="white"
      spacing="lg"
      maxWidth="wide"
      className="scroll-mt-[120px]"
    >
      <div className="inline-flex mb-3">
        <SectionLabel background="light" variant="accent">
          Context &amp; Relevance
        </SectionLabel>
      </div>

      <SectionHeading
        level={2}
        id="context-relevance-heading"
        className="mb-4"
      >
        Why run this survey now
      </SectionHeading>

      <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch] mb-12">
        Most lenders don&apos;t lose SMEs purely on interest rates. They lose them due to slow
        disbursals, opaque fee structures, collateral rigidity, relationship gaps, and poor renewal
        experiences, none of which fully show up in branch MIS or portfolio dashboards.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-10 gap-x-0">
        {COLUMNS.map((col, i) => (
          <div
            key={col.heading}
            className={[
              i > 0 ? 'lg:border-l lg:border-[var(--border-soft)] lg:pl-10' : '',
              i < COLUMNS.length - 1 ? 'lg:pr-10' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <col.icon
              size={20}
              strokeWidth={1.6}
              className="text-[var(--semantic-ink-muted)] mb-4"
              aria-hidden="true"
            />
            <h3 className="font-body font-semibold text-[15px] text-[var(--semantic-ink-strong)] pb-3 mb-4 border-b border-[var(--border-soft)]">
              {col.heading}
            </h3>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[var(--semantic-ink-body)]"
                >
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="text-[var(--semantic-ink-muted)] mt-[3px] flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
