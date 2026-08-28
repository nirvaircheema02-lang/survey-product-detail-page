/**
 * EngagementObjectivesSection
 *
 * WHY · Case-study engagement objectives need a sticky-sidebar + stacked-cards layout — a flat list fails
 *       to communicate sequential consulting value. Sticky header reinforces "these are co-equal pillars."
 * WHAT · 2-column grid: sticky left (eyebrow + h2 + description + divider) · right scroll column of
 *        objective cards (numbered pill + h3 + description). Props: `objectives[]` with number/title/description.
 * WHEN · Case-study section displaying 2-5 strategic consulting objectives / engagement value pillars.
 * WHEN NOT · Impact metrics (use `ImpactSection`) · methodology steps (use `MethodologySection`) ·
 *            product features (use `ValuePillarsSection`).
 * WHERE · Case-study template — section 3 (white bg · after ChallengesSection).
 * HOW ·
 *   ```tsx
 *   <EngagementObjectivesSection objectives={[
 *     { number: "01", title: "Market Sizing", description: "Quantify TAM/SAM..." },
 *     { number: "02", title: "Competitive Analysis", description: "Map tier-1/2 rivals..." }
 *   ]} />
 *   ```
 *
 * @reusabilityScore 4
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom casestudy-templates/template-v3
 */
interface Objective {
  number: string;
  title: string;
  description: string;
}

interface EngagementObjectivesSectionProps {
  objectives: Objective[];
}

export function EngagementObjectivesSection({ objectives }: EngagementObjectivesSectionProps) {
  return (
    <section data-component="EngagementObjectivesSection" className="bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 md:gap-16">
          {/* Left Column - Section Header (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Category Label - Consistent with other sections */}
            <span className="font-medium text-black/40 uppercase tracking-[3px] mb-6 md:mb-8 block" style={{ fontSize: 'var(--text-nav)' }}>
              Engagement Value Pillars
            </span>

            {/* Section Title */}
            <h2 className="leading-[1.15] font-light text-black tracking-tight mb-4 md:mb-6" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4.5vw, var(--text-2xl))' }}>
              Engagement Objectives
            </h2>

            {/* Section Description */}
            <p className="leading-[1.7] text-black/70" style={{ fontSize: 'var(--text-sm)' }}>
              Strategic consulting objectives designed to provide actionable insights and sustainable competitive advantages
            </p>

            {/* Divider Line */}
            <div className="mt-6 md:mt-8 h-px w-16 bg-black/20" />
          </div>

          {/* Right Column - Objectives Stack */}
          <div className="space-y-10 md:space-y-12">
            {objectives.map((objective, index) => (
              <div 
                key={index}
                className="group"
              >
                {/* Objective Badge */}
                <div className="mb-6">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 bg-white hover:bg-black/[0.02] transition-colors">
                    <span className="font-medium uppercase tracking-[2px] text-black/40" style={{ fontSize: 'var(--text-xs)' }}>
                      Objective {objective.number}
                    </span>
                  </div>
                </div>

                {/* Objective Title */}
                <h3 className="font-normal text-black leading-[1.3] tracking-tight mb-4 group-hover:text-black/80 transition-colors" style={{ fontSize: 'var(--text-xl)' }}>
                  {objective.title}
                </h3>

                {/* Objective Description */}
                <p className="leading-[1.7] text-black/70 transition-colors" style={{ fontSize: 'var(--text-sm)' }}>
                  {objective.description}
                </p>

                {/* Divider (except for last item) */}
                {index < objectives.length - 1 && (
                  <div className="mt-12 h-px w-full bg-black/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}