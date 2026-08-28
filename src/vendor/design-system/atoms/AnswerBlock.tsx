/**
 * AnswerBlock — Atom
 *
 * WHY · FAQ sections need semantic Q&A markup for both human readers and
 *       AI-extractable structured content (GEO / AIO pipelines). Raw `<p>` pairs
 *       have zero machine-parseable signal. FAQPage schema + dl/dt/dd semantics
 *       give Google's AI Overviews, SGE, and Perplexity a clean extraction surface.
 *
 * WHAT · Renders a `<dl>/<dt>/<dd>` pair with optional microdata attributes for
 *        FAQPage schema (itemscope/itemtype/itemprop). Two visual modes:
 *        `inline` (minimal type-rhythm, runs in document flow) and
 *        `card` (Card atom wrapper, boxed surface).
 *
 * WHEN · FAQ sections (Section 28 in PDP recipe) · any Q&A list where structured
 *        markup benefits crawlers · GEO-optimised content blocks.
 *
 * WHEN NOT · Prose paragraphs with no question framing · glossary definitions
 *            (use dl/dt/dd directly without this atom if no schema needed) ·
 *            nav items or form labels.
 *
 * WHERE · v1-product-page-ver0.2 Section 28 FAQSection ·
 *         future: case-study + report-store FAQ organisms.
 *
 * HOW ·
 * ```tsx
 * // Default inline · renders in document flow
 * <AnswerBlock
 *   question="What is the CAGR for the Australia cold chain market?"
 *   answer="The Australia cold chain logistics market is expected to grow at a CAGR of 8.2% from 2022 to 2027."
 * />
 *
 * // Card style · boxed
 * <AnswerBlock
 *   question="Which sectors drive cold chain demand?"
 *   answer="Pharmaceutical distribution and temperature-sensitive e-commerce are primary growth drivers."
 *   variant="card"
 * />
 *
 * // Schema-only · invisible · emits microdata only
 * <AnswerBlock
 *   question="What is Ken Research?"
 *   answer="Ken Research is a market intelligence firm covering 300+ industries globally."
 *   schemaOnly
 * />
 * ```
 *
 * @reusabilityScore 5
 * @a11y_status reviewed-AA — dl/dt/dd semantic · question and answer roles clear
 * @lifecycle stable
 * @promotedFrom v1-product-page-ver0.2 (day-1 core-v2 promotion per PHASE-2-PROPOSAL 2c)
 * @portedDate 2026-05-18 — Sprint 1 Foundation
 */
'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Card } from './Card';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AnswerBlockProps {
  /** Question · renders as &lt;dt&gt; with schema markup */
  question: string;
  /** Answer · renders as &lt;dd&gt; with schema markup — string or ReactNode */
  answer: string | ReactNode;
  /**
   * Schema-only mode: renders microdata but hides visually via sr-only.
   * Use when injecting schema into page HEAD area without duplicate visual content.
   */
  schemaOnly?: boolean;
  /**
   * Visual style.
   * inline (default) — minimal type rhythm, runs in document flow.
   * card             — wrapped in Card atom (white, md padding, sm shadow).
   */
  variant?: 'inline' | 'card';
  /** Optional className passthrough */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * AnswerBlock — semantic Q&A atom with FAQPage microdata.
 * Renders dl/dt/dd pair with itemscope for structured data extractability.
 */
export function AnswerBlock({
  question,
  answer,
  schemaOnly = false,
  variant = 'inline',
  className,
}: AnswerBlockProps) {
  const content = (
    <dl
      data-component="AnswerBlock"
      className={cn(
        schemaOnly && 'sr-only',
        variant === 'inline' && !schemaOnly && 'space-y-2',
        className,
      )}
      // FAQPage schema: dl wraps the Q+A pair
      itemScope
      itemType="https://schema.org/Question"
    >
      {/* Question */}
      <dt
        className={cn(
          'font-[500]',
          variant === 'inline'
            ? 'text-[var(--semantic-ink-strong)]'
            : 'text-[var(--semantic-ink-strong)]',
        )}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-normal)',
        }}
        itemProp="name"
      >
        {question}
      </dt>

      {/* Answer */}
      <dd
        className={cn(
          'm-0',
          variant === 'inline'
            ? 'text-[var(--semantic-ink-body)]'
            : 'text-[var(--semantic-ink-body)]',
        )}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-relaxed)',
        }}
        itemScope
        itemType="https://schema.org/Answer"
        itemProp="acceptedAnswer"
      >
        <span itemProp="text">{answer}</span>
      </dd>
    </dl>
  );

  // Card variant wraps in Card atom
  if (variant === 'card' && !schemaOnly) {
    return (
      <Card variant="white" padding="md" shadow="sm" className={className}>
        {content}
      </Card>
    );
  }

  return content;
}
