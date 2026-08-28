'use client';

/**
 * CommercialTermsSection — "Request a Commercial Proposal" (functional calculator)
 *
 * @what  Two-zone layout: LEFT is 4 separately-bordered field cards (sample
 *        size, geography, survey mode, LOI) matching Figma exactly, each its
 *        own `Card`. RIGHT is a sticky "Indicative Estimate" Card with warm
 *        header/footer strips, live estimate figure, cost-breakdown list, and
 *        brand CTA. Estimate live-updates on every control change via
 *        computeEstimateInr/formatEstimate from the data module.
 * @why   Explicit instruction to match Figma exactly here, reversing an
 *        earlier de-boxing pass that replaced the 4 field cards with one
 *        continuous hairline-divided column. Figma's select "cards" have a
 *        single visible border (the card's own) rather than a card containing
 *        a separately-bordered select trigger — so each `SelectTrigger` here
 *        is re-skinned borderless/bg-transparent to sit inside the `Card`
 *        without a nested double-border, while remaining a real, accessible
 *        DS `Select` underneath (not a fake/hand-rolled dropdown look).
 */

import { useState } from 'react';
import { CircleCheck, Clock } from 'lucide-react';
import { SectionHeading, SectionLabel, Button, Card, SectionWrapper } from '@/vendor/design-system/atoms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/vendor/design-system/ui/select';
import { Slider } from '@/vendor/design-system/ui/slider';
import { Input } from '@/vendor/design-system/ui/input';
import {
  SAMPLE_SIZE_RANGE,
  GEOGRAPHY_OPTIONS,
  SURVEY_MODE_OPTIONS,
  LOI_OPTIONS,
  CURRENCY_OPTIONS,
  COST_BREAKDOWN,
  COMMERCIAL_NOTES,
  computeEstimateInr,
  formatEstimate,
  type GeographyOption,
  type SurveyModeOption,
  type LoiOption,
  type CurrencyOption,
} from '@/data/survey-bank-nbfc';

const SAMPLE_STEP = 100;

// Figma's field labels are a small muted caption above a bold value/control —
// not the bold-black heading treatment used for section-level field groups
// elsewhere on this page.
const GROUP_LABEL_CLASS = 'block font-body font-medium text-[14px] text-[var(--semantic-ink-muted)] mb-1.5';

// Borderless/bg-transparent + bold text — Figma's card has ONE visible border
// (the Card's own), not a nested card-containing-a-bordered-select look. Still
// a real DS `Select`/`SelectTrigger` underneath, just re-skinned to blend into
// the surrounding Card instead of drawing its own box.
// Value weight/size matches the live production calculator's readonly-input
// treatment exactly (text-[#000] font-medium at 14px), not the larger 16px
// semibold used elsewhere for standalone field values.
const SELECT_TRIGGER_CLASS =
  'w-full min-h-[28px] px-0 border-transparent bg-transparent hover:border-transparent font-body font-medium text-[14px] text-[var(--color-foundation-black)]';

// Live calculator's option-list highlight is a literal #f9f7f6 on both hover
// and the currently-selected row — that's an exact match for this DS's own
// --warm-200 token (design-system/core-v2/src/styles/base.css), so use the
// token rather than re-hardcoding the hex.
const SELECT_ITEM_CLASS =
  'text-[14px] py-2 pl-4 data-[state=checked]:bg-[var(--warm-200)] focus:bg-[var(--warm-200)]';

function clampSampleSize(n: number): number {
  if (Number.isNaN(n)) return SAMPLE_SIZE_RANGE.default;
  return Math.min(SAMPLE_SIZE_RANGE.max, Math.max(SAMPLE_SIZE_RANGE.min, Math.round(n)));
}

/** One labelled select group, boxed as its own field card (Figma). */
function ConfigSelect({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Card variant="white" padding="lg" shadow="none">
      <label htmlFor={id} className={GROUP_LABEL_CLASS}>
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={SELECT_TRIGGER_CLASS}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt} className={SELECT_ITEM_CLASS}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  );
}

export function CommercialTermsSection() {
  const [sampleSize, setSampleSize] = useState<number>(SAMPLE_SIZE_RANGE.default);
  const [sampleInput, setSampleInput] = useState<string>(String(SAMPLE_SIZE_RANGE.default));
  const [geography, setGeography] = useState<GeographyOption>(GEOGRAPHY_OPTIONS[0]);
  const [mode, setMode] = useState<SurveyModeOption>(SURVEY_MODE_OPTIONS[0]);
  const [loi, setLoi] = useState<LoiOption | null>(null);
  const [currency, setCurrency] = useState<CurrencyOption>(CURRENCY_OPTIONS[0]);

  const estimateInr = computeEstimateInr(geography, mode, loi);
  const estimateDisplay = estimateInr === null ? 'On request' : formatEstimate(estimateInr, currency);

  const commitSampleInput = () => {
    const clamped = clampSampleSize(parseInt(sampleInput, 10));
    setSampleSize(clamped);
    setSampleInput(String(clamped));
  };

  // Trigger shows "₹ INR" style; guard the AED case where symbol === code.
  const currencySymbol = currency.symbol.trim();
  const currencyTriggerText =
    currencySymbol === currency.code ? currency.code : `${currencySymbol} ${currency.code}`;

  // Bold the leading "Note:" without retyping the disclaimer content.
  const disclaimer = COMMERCIAL_NOTES.disclaimer;
  const notePrefix = 'Note:';
  const hasNotePrefix = disclaimer.startsWith(notePrefix);

  return (
    <SectionWrapper
      id="commercial-terms"
      aria-labelledby="commercial-terms-heading"
      background="white"
      spacing="lg"
      maxWidth="wide"
      className="scroll-mt-[120px]"
    >
        <div className="inline-flex mb-3">
          <SectionLabel background="light" variant="accent">
            Commercial Terms
          </SectionLabel>
        </div>

        <SectionHeading
        level={2}
        id="commercial-terms-heading"
        className="mb-4"
      >
        Request a Commercial Proposal
      </SectionHeading>

        <p className="font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)] max-w-[70ch] mb-12">
          Pricing depends on cohort, geography, sample size, approach, LOI, and deliverables.
          Configure below for an indicative estimate.
        </p>

        {/* minmax(0,1fr), not bare 1fr — a plain 1fr track can't shrink past its
            content's min-content width, so at the low end of the lg: range the
            left column can force the whole grid wider than the section and push
            the fixed 400px estimate panel past the viewport edge instead of
            wrapping. minmax(0,_) lets it shrink instead. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-10 lg:gap-12 items-start">
          {/* LEFT — 4 separately-bordered field cards (Figma), gap-separated */}
          <div className="space-y-4">
            {/* 1 · Sample size — slider + synced number input */}
            <Card variant="white" padding="lg" shadow="none">
              <label htmlFor="commercial-sample-size" className={GROUP_LABEL_CLASS} id="commercial-sample-size-label">
                Select Sample Size
              </label>
              <div className="flex gap-4 items-center">
                <Slider
                  thumbLabel="Sample size"
                  aria-labelledby="commercial-sample-size-label"
                  // Track/thumb sizing matches the live calculator's 24px-tall pill
                  // track with a 20px thumb (2px reveal above/below) — scoped here via
                  // descendant selectors rather than changed on the shared atom, since
                  // every other Slider consumer still wants the default 16px/16px scale.
                  className="flex-1 [&_[data-slot=slider-track]]:h-6 [&_[data-slot=slider-track]]:bg-[var(--black-50)] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:shadow-md"
                  showValueTooltip
                  tooltipAlwaysVisible
                  tooltipPosition="below"
                  formatValue={(v) => v.toLocaleString('en-IN')}
                  min={SAMPLE_SIZE_RANGE.min}
                  max={SAMPLE_SIZE_RANGE.max}
                  step={SAMPLE_STEP}
                  value={[sampleSize]}
                  onValueChange={([v]) => {
                    setSampleSize(v);
                    setSampleInput(String(v));
                  }}
                />
                <Input
                  id="commercial-sample-size"
                  type="number"
                  inputMode="numeric"
                  // Native OS spinner arrows clash w/ the custom-styled input chrome
                  // everywhere else on this page — the slider is already the primary
                  // control, this field just needs to be typeable.
                  className="w-28 min-h-[44px] text-[14px] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min={SAMPLE_SIZE_RANGE.min}
                  max={SAMPLE_SIZE_RANGE.max}
                  step={SAMPLE_STEP}
                  value={sampleInput}
                  onChange={(e) => {
                    setSampleInput(e.target.value);
                    const parsed = parseInt(e.target.value, 10);
                    if (!Number.isNaN(parsed)) setSampleSize(clampSampleSize(parsed));
                  }}
                  onBlur={commitSampleInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitSampleInput();
                  }}
                />
              </div>
            </Card>

            {/* 2 · Geography */}
            <ConfigSelect
              id="commercial-geography"
              label="Geography"
              value={geography.label}
              options={GEOGRAPHY_OPTIONS.map((o) => o.label)}
              onChange={(v) =>
                setGeography(GEOGRAPHY_OPTIONS.find((o) => o.label === v) ?? GEOGRAPHY_OPTIONS[0])
              }
            />

            {/* 3 · Survey mode */}
            <ConfigSelect
              id="commercial-mode"
              label="Select Mode of Survey"
              value={mode.label}
              options={SURVEY_MODE_OPTIONS.map((o) => o.label)}
              onChange={(v) =>
                setMode(SURVEY_MODE_OPTIONS.find((o) => o.label === v) ?? SURVEY_MODE_OPTIONS[0])
              }
            />

            {/* 4 · LOI — starts unset ("Select" placeholder) */}
            <ConfigSelect
              id="commercial-loi"
              label="Length of the Interview"
              value={loi?.label ?? ''}
              placeholder="Select"
              options={LOI_OPTIONS.map((o) => o.label)}
              onChange={(v) => setLoi(LOI_OPTIONS.find((o) => o.label === v) ?? null)}
            />
          </div>

          {/* RIGHT — indicative estimate panel (the one allowed contained surface) */}
          <div className="lg:sticky lg:top-[120px] self-start">
            <Card variant="white" padding="none" shadow="sm" className="overflow-hidden">
              {/* Header strip */}
              <div className="bg-[var(--warm-300,#f5f2f1)] px-5 py-3 flex items-center justify-between gap-3 border-b border-[var(--border-soft)]">
                <SectionLabel background="light">Indicative Estimate</SectionLabel>
                <Select
                  value={currency.code}
                  onValueChange={(code) =>
                    setCurrency(CURRENCY_OPTIONS.find((c) => c.code === code) ?? CURRENCY_OPTIONS[0])
                  }
                >
                  <SelectTrigger
                    size="sm"
                    aria-label="Currency"
                    className="w-auto min-w-[88px] bg-white font-body text-[13px] text-[var(--semantic-ink-strong)]"
                  >
                    <SelectValue>{currencyTriggerText}</SelectValue>
                  </SelectTrigger>
                  <SelectContent align="end">
                    {CURRENCY_OPTIONS.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body */}
              <div className="px-5 py-6">
                <p
                  aria-live="polite"
                  className="font-display font-light text-[clamp(28px,3vw,39px)] leading-[1.15] tracking-[-0.015em] text-[var(--semantic-ink-strong)]"
                >
                  {estimateDisplay}
                </p>
                {estimateInr !== null && (
                  <p className="text-[12px] text-[var(--semantic-ink-muted)] mt-1">
                    + applicable taxes
                  </p>
                )}

                <p className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[var(--semantic-ink-muted)] mt-6 mb-2">
                  Cost Breakdown
                </p>
                <ul className="divide-y divide-[color:var(--border-soft)]">
                  {COST_BREAKDOWN.map((row) => (
                    <li
                      key={row.item}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <span className="text-[14px] text-[var(--semantic-ink-body)]">
                        {row.item}
                      </span>
                      {row.status === 'Included' ? (
                        <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--semantic-status-success-text)] shrink-0">
                          <CircleCheck size={14} strokeWidth={2} aria-hidden="true" />
                          {row.status}
                        </span>
                      ) : (
                        <span className="text-[13px] font-medium text-[var(--semantic-status-warning-text)] shrink-0">
                          {row.status}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <Button variant="brand" size="md" fullWidth animatedArrow className="mt-6">
                  Submit Proposal Request
                </Button>
              </div>

              {/* Footer strip — full-bleed inside the Card */}
              <div className="bg-[var(--warm-300,#f5f2f1)] border-t border-[var(--border-soft)] px-5 py-3 flex gap-2 items-center">
                <Clock
                  size={14}
                  strokeWidth={1.6}
                  className="text-[var(--semantic-ink-muted)] shrink-0"
                  aria-hidden="true"
                />
                <p className="text-[13px] text-[var(--semantic-ink-muted)]">
                  {COMMERCIAL_NOTES.turnaround}
                </p>
              </div>
            </Card>

            {/* Disclaimer — outside the Card */}
            <p className="text-[13px] leading-relaxed text-[var(--semantic-ink-muted)] max-w-[70ch] mt-4">
              {hasNotePrefix ? (
                <>
                  <strong className="font-semibold">{notePrefix}</strong>
                  {disclaimer.slice(notePrefix.length)}
                </>
              ) : (
                disclaimer
              )}
            </p>
          </div>
        </div>
    </SectionWrapper>
  );
}
