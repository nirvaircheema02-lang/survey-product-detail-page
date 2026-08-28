/**
 * TestimonialSection
 *
 * WHY · Client endorsements need a visually distinct, editorially restrained treatment — not a standard
 *       marketing carousel. Single-quote card with 5-star rating anchors credibility without noise.
 * WHAT · Single testimonial block: horizontal rule opener · serif italic quote · attribution name ·
 *        5-star rating + numeric score. White bg · `--container-narrow` · warm-50 card.
 *        Propified 2026-05-15 · all data optional · defaults retain Yash Highvoltage backward-compat for handed templates.
 * WHEN · Case-study pages needing a single client quote before the resources/final-cta sections.
 * WHEN NOT · Multi-testimonial sliders (use carousel molecule) · rating aggregations (use StatsRow).
 * WHERE · Case-study template — section 6 (white bg · after ImpactSection · before ResourcesSection).
 * HOW ·
 *   ```tsx
 *   // Default (backward-compat · matches v3/v28 hardcoded)
 *   <TestimonialSection />
 *
 *   // Custom (new case studies)
 *   <TestimonialSection
 *     eyebrow="Client Endorsement"
 *     quote="Ken Research helped us validate our market entry strategy in MENA."
 *     attribution="VP Strategy, Acme Corp"
 *     rating={4.9}
 *     starCount={5}
 *   />
 *   ```
 *
 * @reusabilityScore 4
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom casestudy-templates/template-v3
 */
import { Star } from 'lucide-react';

export interface TestimonialSectionProps {
  /** Section eyebrow label · default "Client Endorsement" */
  eyebrow?: string;
  /** Quote body · serif italic · default = Yash Highvoltage quote */
  quote?: string;
  /** Attribution line · "Title, Company" format · default = Yash Highvoltage director */
  attribution?: string;
  /** Numeric rating shown next to stars · default 4.97 */
  rating?: number;
  /** Max stars · default 5 */
  starCount?: number;
}

const DEFAULT_QUOTE = '"Ken Research helped us quantify our addressable opportunity, build a sharper product strategy, and clearly articulate our competitive strengths. Their analysis played a key role in our next-stage discussions with investors."';

export function TestimonialSection({
  eyebrow = 'Client Endorsement',
  quote = DEFAULT_QUOTE,
  attribution = 'Director, Yash Highvoltage Insulators',
  rating = 4.97,
  starCount = 5,
}: TestimonialSectionProps = {}) {
  const filledStars = Math.min(starCount, Math.round(rating));
  return (
    <section data-component="TestimonialSection" className="py-12 sm:py-16 md:py-20 bg-white border-t border-black/10">
      <div className="max-w-[var(--container-narrow)] mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-12 sm:mb-16 md:mb-20">
          <span className="font-medium text-black/40 uppercase tracking-[3px] mb-6 md:mb-8 block" style={{ fontSize: 'var(--text-nav)' }}>
            {eyebrow}
          </span>
        </div>

        <div
          className="max-w-[var(--container-narrow)] p-6 sm:p-8 md:p-10 rounded-[10px] transition-all duration-300"
          style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--black-200)',
            boxShadow: '0 4px 20px rgba(195, 198, 249, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="h-px w-16 md:w-24 bg-black/20 mb-8 md:mb-12"></div>

          <p className="leading-[1.6] text-black mb-8 md:mb-10 font-light italic" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1rem, 2.5vw, var(--text-lg))' }}>
            {quote}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-1 text-black/70" style={{ fontSize: 'var(--text-xs)' }}>
              <span className="font-medium text-black">{attribution}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" role="img" aria-label={`Rating · ${rating} of ${starCount} stars`}>
                {[...Array(starCount)].map((_, i) => (
                  <Star
                    key={i}
                    className={i < filledStars ? 'w-4 h-4 fill-black text-black' : 'w-4 h-4 text-black/30'}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="font-medium text-black/70" style={{ fontSize: 'var(--text-xs)' }}>{rating} / {starCount}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}