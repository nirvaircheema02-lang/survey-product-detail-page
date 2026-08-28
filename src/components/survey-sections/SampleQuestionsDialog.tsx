'use client';

/**
 * SampleQuestionsDialog — "View Sample Questions" preview for a research theme.
 *
 * @what  Canonical DS Dialog (Radix) holding a read-only preview of the real
 *        questions for one theme: module header + progress bar + numbered
 *        question list with respondent-facing option controls.
 * @why   Replaces eight dead `#` links. Content is captured verbatim from the
 *        live page's own modal — never invented.
 * @how   Follows the wiring proven in v1-product-page-ver0.4's
 *        `MarketSizeSection` DatasetModalTrigger: DialogTrigger asChild wrapping
 *        the section's own quiet text action, DialogContent with a fixed header,
 *        scrollable body and footer. Option rows are non-interactive previews —
 *        this is a sales-page preview, not the live instrument (per the DS
 *        QuestionPreview "WHEN NOT" rule: never use preview UI for submission).
 */

import { Circle, Square, PenLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kenresearch/design-system/ui/dialog';
import { Button } from '@kenresearch/design-system/atoms';
import type { ReactNode } from 'react';
import type { ThemeSampleQuestions, SampleQuestionType } from '@/data/survey-bank-nbfc';

const TYPE_ICON: Record<SampleQuestionType, typeof Circle> = {
  single: Circle,
  multi: Square,
  open: PenLine,
};

export interface SampleQuestionsDialogProps {
  /** The trigger element — rendered via `asChild`, keeps the section's own styling. */
  children: ReactNode;
  themeTitle: string;
  data: ThemeSampleQuestions;
}

export function SampleQuestionsDialog({
  children,
  themeTitle,
  data,
}: SampleQuestionsDialogProps) {
  const shown = data.questions.length;
  const remaining = data.totalInModule - shown;
  const pct = Math.round((shown / data.totalInModule) * 100);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-[720px] w-[calc(100vw-32px)] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[var(--border-soft)] text-left space-y-1">
          <DialogTitle className="font-display font-light text-[22px] leading-tight text-[var(--semantic-ink-strong)]">
            Sample Questions Preview
          </DialogTitle>
          <DialogDescription className="font-body text-[13px] text-[var(--semantic-ink-muted)]">
            {themeTitle} &mdash; {shown} of {data.totalInModule} questions shown
          </DialogDescription>

          {/* Coverage bar — how much of the module this preview represents */}
          <div
            className="mt-3 h-1 w-full rounded-full bg-[var(--border-soft)] overflow-hidden"
            role="img"
            aria-label={`${shown} of ${data.totalInModule} questions previewed`}
          >
            <div
              className="h-full rounded-full bg-[var(--color-brand-red)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </DialogHeader>

        {/* Scrollable question list */}
        <div className="overflow-auto flex-1 px-6 py-5">
          <ol className="space-y-7">
            {data.questions.map((q, i) => {
              const Icon = TYPE_ICON[q.type];
              return (
                <li key={q.text} className="grid grid-cols-[24px_1fr] gap-x-3">
                  <span className="font-body text-[13px] tabular-nums text-[var(--semantic-ink-faint,rgba(0,0,0,0.32))] pt-0.5">
                    {i + 1}
                  </span>

                  <div>
                    <p className="font-body font-medium text-[15px] leading-snug text-[var(--semantic-ink-strong)]">
                      {q.text}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-body text-[12px] text-[var(--semantic-ink-muted)]">
                      <Icon size={11} strokeWidth={2} aria-hidden="true" />
                      {q.typeLabel}
                    </p>

                    {q.options.length > 0 ? (
                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {q.options.map((opt) => (
                          <li
                            key={opt}
                            className="flex items-center gap-2 rounded-[var(--radius-xs,5px)] border border-[var(--border-soft)] px-3 py-2 font-body text-[13px] text-[var(--semantic-ink-body)]"
                          >
                            <span
                              aria-hidden="true"
                              className={`h-3 w-3 flex-shrink-0 border border-[var(--border-default)] ${
                                q.type === 'multi' ? 'rounded-[3px]' : 'rounded-full'
                              }`}
                            />
                            {opt}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-3 rounded-[var(--radius-xs,5px)] border border-dashed border-[var(--border-default)] px-3 py-3 font-body text-[13px] text-[var(--semantic-ink-muted)]">
                        Free-text response
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-[var(--border-soft)] flex-row items-center justify-between gap-4 sm:justify-between">
          <p className="font-body text-[13px] text-[var(--semantic-ink-muted)]">
            +{remaining} more questions in the full survey
          </p>
          <Button variant="brand" size="sm">
            Request full questionnaire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
