'use client';

/**
 * ReferenceCaseletsSection — "Reference" (approved/locked section — do not redesign)
 *
 * @what  Editorial caselet showcase matching the approved Figma exactly: large
 *        hero image with overlaid label chip + title, a narrow side teaser (the
 *        OTHER caselet, with a + control) that switches the active caselet, and
 *        three simple columns (Objective / What we did / Delivered) below,
 *        separated by a subtle vertical divider between adjacent columns (not a
 *        rule on every column, and no numeral anchors).
 * @why   An earlier de-boxing pass added a pill-tab switcher row, large 01/02/03
 *        numerals, and a warm background not present in the approved design —
 *        all removed here. The side-teaser "+" click IS the only approved
 *        switching control; there is no separate tab row in Figma.
 */

import { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading, SectionLabel, Button, SectionWrapper } from '@/vendor/design-system/atoms';
import { CASELETS } from '@/data/survey-bank-nbfc';

export function ReferenceCaseletsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const active = CASELETS[activeIndex];
  const otherIndex = (activeIndex + 1) % CASELETS.length;
  const other = CASELETS[otherIndex];

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reducedMotion ? 0 : 0.25, ease: 'easeOut' as const },
  };

  const columns = [
    { label: 'Objective', text: active.objective },
    { label: 'What we did', text: active.whatWeDid },
    { label: 'Delivered', text: active.delivered },
  ];

  return (
    <SectionWrapper
      id="reference-caselets"
      aria-labelledby="reference-caselets-heading"
      background="white"
      spacing="xl"
      maxWidth="wide"
      className="scroll-mt-[120px] [&>div:first-child]:mb-0!"
    >
        {/* Header trio in its own wrapper. The workspace's global
            `[data-component="SectionWrapper"] > div:first-child:has(SectionHeading)`
            rule (globals.css) means to add 48px margin-bottom after just the
            header trio, but `:has()` matches at any depth — since SectionWrapper
            always renders ONE content div wrapping all of a section's children,
            that div always `:has()` the heading no matter how deep it's nested,
            so the rule was landing its 48px *after the button* (this section's
            last child) instead of after the description. That stray trailing
            48px was the "excessive empty space below the content" being
            flagged. Cancelled below (higher-specificity override, scoped to
            this section only) and re-applied here, on the div the rule was
            actually meant to target. */}
        <div className="mb-12">
          <div className="inline-flex mb-3">
            <SectionLabel background="light" variant="accent">
              Reference Caselets
            </SectionLabel>
          </div>

          <SectionHeading
            level={2}
            id="reference-caselets-heading"
            className="mb-4"
          >
            Reference
          </SectionHeading>

          <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch]">
            Real-world examples of survey work in the SME lending and financial services space.
          </p>
        </div>

        {/* Hero media row */}
        <div className="flex gap-4">
          {/* Main image — active caselet */}
          <div className="relative flex-1 aspect-[16/9] lg:aspect-[16/7] min-h-[280px] rounded-[var(--radius-sm,10px)] overflow-hidden">
            <motion.div key={active.id} className="absolute inset-0" {...fade}>
              <Image
                src={active.image}
                alt={active.imageAlt}
                fill
                sizes="(min-width:1024px) 900px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"
              />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-flex bg-white/15 backdrop-blur-sm text-white text-[11px] uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-[5px]">
                  {active.label}
                </span>
                <p className="text-white font-body font-medium text-[clamp(17px,2vw,22px)] leading-snug max-w-[36ch] mt-2">
                  {active.title}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Side teaser — the other caselet, tap to switch */}
          <div className="hidden lg:block w-[160px] self-stretch">
            <button
              type="button"
              aria-label={`View ${other.title}`}
              onClick={() => setActiveIndex(otherIndex)}
              className="relative w-full h-full rounded-[var(--radius-sm,10px)] overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
            >
              <Image
                src={other.image}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="size-10 flex items-center justify-center rounded-[8px] bg-white/15 backdrop-blur-sm group-hover:bg-white/25 transition-colors duration-200">
                  <Plus size={18} strokeWidth={2} className="text-white" />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Active caselet details — editorial columns, not cards */}
        <motion.div key={`${active.id}-details`} {...fade}>
          <h3 className="font-body font-semibold text-[20px] text-[var(--semantic-ink-strong)] mt-8 mb-6">
            {active.title}
          </h3>

          {/* Simple 3-column treatment — subtle divider between adjacent columns
              only (none on the first), no numeral anchors. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {columns.map((col, i) => (
              <div
                key={col.label}
                className={i > 0 ? 'md:border-l md:border-[var(--border-soft)] md:pl-8' : ''}
              >
                <h4 className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[var(--semantic-ink-muted)] mb-3">
                  {col.label}
                </h4>
                <p className="text-[14px] leading-relaxed text-[var(--semantic-ink-body)]">
                  {col.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <Button variant="secondary" size="md" className="mt-10">
          Talk to Survey Consultant
        </Button>
    </SectionWrapper>
  );
}
