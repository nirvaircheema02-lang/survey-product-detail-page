'use client';

/**
 * SamplingStrategySection — "Tell us about your ideal sample"
 *
 * @what  Each of the 4 config groups (Sample size · Target audience · Region ·
 *        Segments) as its own bordered `Card`, with the group's icon inside a
 *        DS `IconBox` (warm-tinted square) — replicating the Figma design's
 *        per-group card treatment directly, per explicit direction on this
 *        section, rather than the continuous-hairline-surface pattern used
 *        elsewhere on this page. Right "Your Selection" summary panel keeps its
 *        own Card, now with small icons on each group label matching Figma too.
 * @why   This section is an intentional, explicit exception to the page's
 *        de-boxing pass — the user asked to replicate Figma's boxed layout here
 *        specifically, built with real DS components/tokens (Card/IconBox/
 *        FilterChip/Badge), not hand-rolled arbitrary values.
 */

import { useState } from 'react';
import { Users, Target, Globe, BarChart3, X, type LucideIcon } from 'lucide-react';
import {
  SectionHeading,
  SectionLabel,
  Button,
  Badge,
  Divider,
  TextLink,
  Card,
  IconBox,
  FilterChip,
  SectionWrapper,
} from '@kenresearch/design-system/atoms';
import { SAMPLING_GROUPS } from '@/data/survey-bank-nbfc';

/** lucide icon per sampling group id — shared between each group's card and the
 *  summary panel's mini labels, matching the Figma reference for this section. */
const GROUP_ICONS: Record<string, LucideIcon> = {
  'sample-size': Users,
  'target-audience': Target,
  region: Globe,
  segments: BarChart3,
};

export function SamplingStrategySection() {
  /** groupId → selected option values */
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const hasSelection = Object.values(selections).some((values) => values.length > 0);

  const toggleOption = (groupId: string, option: string, multiSelect: boolean) => {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      const isActive = current.includes(option);
      if (!multiSelect) {
        // single-select: choosing one replaces the previous; clicking the active one deselects
        return { ...prev, [groupId]: isActive ? [] : [option] };
      }
      return {
        ...prev,
        [groupId]: isActive
          ? current.filter((value) => value !== option)
          : [...current, option],
      };
    });
  };

  const clearAll = () => setSelections({});

  return (
    <SectionWrapper
      id="sampling-strategy"
      aria-labelledby="sampling-strategy-heading"
      background="white"
      spacing="lg"
      maxWidth="wide"
      className="scroll-mt-[120px]"
    >
      <div className="inline-flex mb-3">
        <SectionLabel background="light" variant="accent">
          Sampling Strategy
        </SectionLabel>
      </div>

      <SectionHeading level={2} id="sampling-strategy-heading" className="mb-4">
        Tell us about your ideal sample
      </SectionHeading>

      <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch] mb-12">
        Help us understand your target respondent profile. Select what applies, we&apos;ll design
        the optimal sample plan based on your inputs.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-12">
        {/* LEFT — each group as its own card, per Figma. */}
        <div className="space-y-6">
          {SAMPLING_GROUPS.map((group) => {
            const Icon = GROUP_ICONS[group.id] ?? Users;
            const selected = selections[group.id] ?? [];
            const headingId = `sampling-group-${group.id}`;
            return (
              <Card key={group.id} variant="white" padding="lg" shadow="none">
                <div className="flex items-start gap-3 mb-4">
                  <IconBox icon={Icon} color="warm" size="md" />
                  <div>
                    <h3
                      id={headingId}
                      className="font-body font-semibold text-[15px] text-[var(--semantic-ink-strong)]"
                    >
                      {group.title}
                    </h3>
                    <p className="font-body text-[14px] leading-[1.5] text-[var(--semantic-ink-muted)] mt-0.5">
                      {group.question}
                    </p>
                  </div>
                </div>

                <div role="group" aria-labelledby={headingId} className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <FilterChip
                      key={option}
                      label={option}
                      active={selected.includes(option)}
                      onToggle={() => toggleOption(group.id, option, group.multiSelect)}
                      /* `wrap`: these options are full phrases ("Not sure yet (recommend
                         based on markets and cuts required)") — at 390px they exceed the
                         card and the chip's default single-line truncation ate the copy. */
                      wrap
                      className="max-w-full min-h-[44px]"
                    />
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* RIGHT — "Your Selection" panel: the one contained surface (functional
            state summary). Sticky on lg+ only; stacks below on mobile. */}
        <div className="self-start lg:sticky lg:top-[120px]">
          <Card variant="white" padding="md" shadow="none">
            <div className="flex justify-between items-center">
              <SectionLabel background="light">Your Selection</SectionLabel>
              {hasSelection && (
                <TextLink
                  size="sm"
                  onClick={clearAll}
                  icon={<X size={14} strokeWidth={2} aria-hidden="true" />}
                >
                  Clear all
                </TextLink>
              )}
            </div>

            {SAMPLING_GROUPS.map((group) => {
              const Icon = GROUP_ICONS[group.id] ?? Users;
              const selected = selections[group.id] ?? [];
              return (
                <div key={group.id}>
                  <Divider variant="subtle" className="my-4" />
                  <p className="font-body font-semibold text-[11px] uppercase tracking-[0.12em] text-[var(--semantic-ink-muted)] mb-2 flex items-center gap-1.5">
                    <Icon size={12} strokeWidth={2} aria-hidden="true" />
                    {group.summaryLabel}
                  </p>
                  {selected.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.map((value) => (
                        <Badge
                          key={value}
                          variant="rounded"
                          size="sm"
                          theme="neutral"
                          bordered
                          title={value}
                          /* Badge defaults to max-width 200px + nowrap + ellipsis (Bible
                             § 1.9 truncation doctrine). Correct for category tags, wrong
                             for echoing back the user's own selection — a Segments value
                             read "LENDER TYPE: BANK-ONLY VS…". Let it wrap in the panel. */
                          style={{ maxWidth: '100%', whiteSpace: 'normal' }}
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body text-[13px] text-[var(--semantic-ink-muted)]">
                      Not Selected
                    </p>
                  )}
                </div>
              );
            })}

            <div className="mt-6">
              <Button variant="brand" size="md" fullWidth animatedArrow>
                Discuss sample plan
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
