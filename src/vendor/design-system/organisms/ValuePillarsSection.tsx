/**
 * ValuePillarsSection
 *
 * WHY · Engagement objectives / value pillars in long-form editorial need large-number anchors with
 *       full-width divider rows — a card grid loses the "sequential equal weight" editorial feel.
 * WHAT · Stacked 12-col rows: serif large number (2-col, black/20) · title + description prose (10-col).
 *        Border-top per row creates visual rhythm. White bg. Props: `pillars[]` with number/title/description.
 * WHEN · Case-study engagement objectives or product value propositions needing editorial numbered treatment.
 * WHEN NOT · Consulting steps with descriptions (use `MethodologySection`) ·
 *            numbered metrics (use `ImpactSection`) · horizontally scrolled cards (use `ChallengesSection`).
 * WHERE · Case-study template — alternative to `EngagementObjectivesSection` for simpler 2-col layout needs.
 * HOW ·
 *   ```tsx
 *   <ValuePillarsSection pillars={[
 *     { number: "01", title: "Market Intelligence", description: "Quantify TAM/SAM with primary data..." },
 *     { number: "02", title: "Competitive Positioning", description: "Map rivals across 4 dimensions..." }
 *   ]} />
 *   ```
 *
 * @reusabilityScore 3
 * @a11y_status pending-review
 * @lifecycle beta
 * @promotedFrom casestudy-templates/template-v3
 */
interface ValuePillar {
  number: string;
  title: string;
  description: string;
}

interface ValuePillarsSectionProps {
  pillars: ValuePillar[];
}

export function ValuePillarsSection({ pillars }: ValuePillarsSectionProps) {
  return (
    <section data-component="ValuePillarsSection" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="font-medium text-black/40 uppercase tracking-[3px] mb-6 md:mb-8 block" style={{ fontSize: 'var(--text-xs)' }}>Engagement Objectives</span>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-12">
          {pillars.map((pillar, index) => (
            <div key={index} className="grid grid-cols-12 gap-8 border-t border-black/10 pt-12">
              {/* Number */}
              <div className="col-span-2">
                <div className="font-light text-black/20 tracking-tight" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-3xl)' }}>
                  {pillar.number}
                </div>
              </div>
              
              {/* Content */}
              <div className="col-span-10">
                <h3 className="font-normal text-black leading-[1.4] tracking-tight mb-6" style={{ fontSize: 'var(--text-lg)' }}>
                  {pillar.title}
                </h3>
                <p className="leading-[1.8] text-black/70 max-w-[var(--container-prose)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}