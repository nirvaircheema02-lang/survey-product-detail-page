'use client';

import Link from 'next/link';
import { ArrowLeft, Circle, PenLine, Square } from 'lucide-react';
import { Navbar, Footer } from '@/vendor/design-system/organisms';
import { SectionHeading, SectionLabel, SectionWrapper } from '@/vendor/design-system/atoms';
import {
  RESEARCH_THEMES,
  SAMPLE_QUESTIONS,
  type SampleQuestionType,
} from '@/data/survey-bank-nbfc';

const surveyHref = '/survey/bank-nbfc-preference';

const typeIcon = {
  single: Circle,
  multi: Square,
  open: PenLine,
} satisfies Record<SampleQuestionType, typeof Circle>;

const questionCount = RESEARCH_THEMES.reduce(
  (count, theme) => count + (SAMPLE_QUESTIONS[theme.index]?.questions.length ?? 0),
  0,
);

export function SampleQuestionsPageClient() {
  return (
    <>
      <Navbar activeHref="/survey" />
      <main id="main">
        <SectionWrapper background="warm" spacing="xl" maxWidth="wide">
          <Link
            href={`${surveyHref}#research-themes`}
            className="mb-8 inline-flex items-center gap-2 font-body text-[13px] font-medium text-[var(--semantic-ink-body)] hover:text-[var(--color-brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to survey
          </Link>

          <div className="mb-4">
            <SectionLabel background="light" variant="accent">Question Preview</SectionLabel>
          </div>
          <SectionHeading level={1} className="mb-4">All Sample Questions</SectionHeading>
          <p className="mb-10 max-w-[70ch] font-body text-[16px] leading-[1.6] text-[var(--semantic-ink-body)]">
            Explore {questionCount} sample questions across the eight research themes in the SME borrowing journey.
          </p>

          <nav aria-label="Jump to a research theme" className="mb-12 flex flex-wrap gap-2">
            {RESEARCH_THEMES.map((theme) => (
              <a
                key={theme.index}
                href={`#theme-${theme.index}`}
                className="rounded-full border border-[var(--border-default)] px-3 py-2 font-body text-[12px] text-[var(--semantic-ink-body)] transition-colors hover:border-[var(--color-brand-red)] hover:text-[var(--color-brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]"
              >
                {theme.index} {theme.title}
              </a>
            ))}
          </nav>

          <div className="space-y-12">
            {RESEARCH_THEMES.map((theme) => {
              const sample = SAMPLE_QUESTIONS[theme.index];
              if (!sample) return null;

              return (
                <section key={theme.index} id={`theme-${theme.index}`} aria-labelledby={`theme-heading-${theme.index}`} className="scroll-mt-[120px]">
                  <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-[var(--border-default)] pb-4">
                    <span aria-hidden="true" className="font-display text-[32px] font-light text-[var(--semantic-ink-subtle)]">
                      {theme.index}
                    </span>
                    <h2 id={`theme-heading-${theme.index}`} className="font-display text-[clamp(22px,3vw,30px)] font-light text-[var(--semantic-ink-strong)]">
                      {theme.title}
                    </h2>
                    <span className="ml-auto font-body text-[13px] text-[var(--semantic-ink-muted)]">
                      {sample.questions.length} sample questions
                    </span>
                  </div>

                  <ol className="grid gap-4 md:grid-cols-2">
                    {sample.questions.map((question, index) => {
                      const Icon = typeIcon[question.type];
                      return (
                        <li key={question.text} className="rounded-[var(--radius-sm,8px)] border border-[var(--border-soft)] bg-white p-5 sm:p-6">
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <span className="font-body text-[12px] font-semibold tabular-nums text-[var(--semantic-ink-subtle)]">
                              QUESTION {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--semantic-ink-muted)]">
                              <Icon size={13} strokeWidth={2} aria-hidden="true" />
                              {question.typeLabel}
                            </span>
                          </div>
                          <h3 className="font-body text-[16px] font-semibold leading-snug text-[var(--semantic-ink-strong)]">
                            {question.text}
                          </h3>
                          {question.options.length > 0 ? (
                            <ul className="mt-5 space-y-2">
                              {question.options.map((option) => (
                                <li key={option} className="flex items-center gap-2.5 font-body text-[13px] text-[var(--semantic-ink-body)]">
                                  <span
                                    aria-hidden="true"
                                    className={`h-3 w-3 flex-shrink-0 border border-[var(--border-default)] ${question.type === 'multi' ? 'rounded-[3px]' : 'rounded-full'}`}
                                  />
                                  {option}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-5 font-body text-[13px] text-[var(--semantic-ink-muted)]">Free-text response</p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </div>

          <Link
            href={`${surveyHref}#research-themes`}
            className="mt-12 inline-flex items-center gap-2 font-body text-[14px] font-medium text-[var(--semantic-ink-body)] hover:text-[var(--color-brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to survey
          </Link>
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
