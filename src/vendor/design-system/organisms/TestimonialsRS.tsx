/**
 * TestimonialsRS — Organism (DS v4.3)
 *
 * WHAT: Report Store–specific testimonials section (social proof).
 * WHY:  Displays client quotes specific to the research/report product,
 *       distinct from the case study TestimonialSection.
 * WHEN: Report Store home page, between content sections.
 * HOW:  SectionWrapper(white) + testimonial cards grid.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity.
 */
import { Quote } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { Card } from '../atoms/Card';
import { iconColors } from '../atoms/iconColors';

const TESTIMONIALS = [
  {
    quote: 'The semiconductor market forecast helped us make a $2B investment decision with confidence. The data quality is unmatched.',
    name: 'Michael Torres',
    role: 'VP Strategy',
    company: 'Global Tech Corp',
    initials: 'MT',
  },
  {
    quote: 'We rely on these reports for our quarterly board presentations. The methodology is rigorous and the insights are actionable.',
    name: 'Dr. Anna Kowalski',
    role: 'Chief Research Officer',
    company: 'Nordic Pharma Group',
    initials: 'AK',
  },
  {
    quote: 'The energy storage analysis directly informed our grid modernization strategy. Worth every penny of the investment.',
    name: 'James Okafor',
    role: 'Director of Innovation',
    company: 'Atlas Energy Systems',
    initials: 'JO',
  },
];

export function TestimonialsRS() {
  return (
    <SectionWrapper data-component="TestimonialsRS" background="white" spacing="lg" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label="Client Voices"
          title="What Our Clients Say"
          subtitle="Trusted by 5,000+ organizations for strategic intelligence"
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <Card
              key={idx}
              shadow="sm"
              padding="md"
            >
              {/* Quote icon */}
              <Quote size={20} color={iconColors.content} className="mb-3 opacity-30" />

              {/* Quote text */}
              <p
                className="italic"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'rgba(0,0,0,0.6)',
                  lineHeight: 1.6,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-5 pt-4" style={{ borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'rgba(0,0,0,0.06)' }}>
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    fontSize: 'var(--text-xs)',
                    color: 'rgba(0,0,0,0.45)',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.8)' }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}