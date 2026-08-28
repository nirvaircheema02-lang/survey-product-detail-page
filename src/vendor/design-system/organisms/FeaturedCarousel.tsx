/**
 * FeaturedCarousel — Organism (cross-pillar)
 *
 * WHY: Featured-items rows on Report Store · Surveys homes need consistent header + horizontal-scroll carousel pattern.
 * WHAT: SectionWrapper(white) wrapping SectionHeading (label/title/subtitle/endSlot) + HorizontalScroll body. Children = cards.
 * WHEN: Pillar home Section 2 ("Latest Research" · "Featured Surveys") · cross-pillar promotional rows.
 * WHEN NOT: Filterable grid (use BrowseGrid) · paginated listing (use CardListing) · single feature (use IndustrySpotlight).
 * HOW: Slot-based · accepts ANY card type as children · consumer wraps own cards. Pass `label · title · subtitle · ctaText`.
 *
 * Structure: SectionWrapper(white) → SectionHeading(label+title+subtitle+endSlot) → HorizontalScroll → children
 */
import type { ReactNode } from 'react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { CTALink } from '../atoms/CTALink';
import { HorizontalScroll } from '../molecules';

export interface FeaturedCarouselProps {
  /** SectionHeading label */
  label: string;
  /** SectionHeading title */
  title: string;
  /** SectionHeading subtitle */
  subtitle?: string;
  /** CTA link text (rendered in endSlot) */
  ctaText?: string;
  /** Background color variant */
  background?: 'white' | 'warm' | 'black';
  /** Width of each carousel item */
  itemWidth?: number;
  /** Carousel items — each should be a card component */
  children: ReactNode;
  /** className for outer wrapper */
  className?: string;
  /** Pass-through data-* attributes (e.g. data-component from parent organism) */
  [key: `data-${string}`]: string | undefined;
}

export function FeaturedCarousel({
  label,
  title,
  subtitle,
  ctaText = 'View all',
  background = 'white',
  children,
  className,
  ...dataProps
}: FeaturedCarouselProps) {
  return (
    <SectionWrapper data-component="FeaturedCarousel" {...dataProps} background={background} spacing="lg" maxWidth="wide" className={className}>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label={label}
          title={title}
          subtitle={subtitle}
          endSlot={
            ctaText ? (
              <CTALink href="#">
                {ctaText}
              </CTALink>
            ) : undefined
          }
        />
        <div className="mt-8">
          <HorizontalScroll>
            {children}
          </HorizontalScroll>
        </div>
      </div>
    </SectionWrapper>
  );
}