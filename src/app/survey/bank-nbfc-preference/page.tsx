/**
 * Survey Product Detail Page — Bank vs NBFC Preference Survey (SMEs)
 *
 * @what  Net-new page — no existing survey PDP was found anywhere in this repo
 *        (v1-product-page-ver0.4 is a report PDP; design-system/recipes/survey-detail.md
 *        describes a different, respondent-facing "take this survey" flow). Built as
 *        its own route reusing this project's chrome, DS components, and tokens.
 * @why   Live content source of truth: kenresearch.com/survey/bank-nbfc-perference.
 *        Figma (node 3668:1090) used for layout/visual de-boxing direction only.
 * @how   Section order deliberately places the new Interactive Dashboard Preview
 *        between Research Themes and Sampling Strategy, so the narrative reads
 *        context → themes → output preview → sampling → methodology → execution →
 *        commercial → caselets → FAQ. Kept as a Server Component (unlike the rest
 *        of this project's pages, which are all 'use client') specifically so this
 *        route gets its own <title> instead of inheriting the project root layout's
 *        generic "V1 Product Page v0.4" — the actual page composition + the only
 *        page-level state (mobile nav drawer) live in ./SurveyPageClient.tsx.
 */

import type { Metadata } from 'next';
import { SurveyPageClient } from './SurveyPageClient';

export const metadata: Metadata = {
  title: 'Bank vs NBFC Preference Survey (SMEs) | Ken Research',
  description:
    'Survey product detail page for the Bank vs NBFC Preference Survey (SMEs) — SME lending & finance research from Ken Research.',
};

export default function BankNbfcPreferenceSurveyPage() {
  return <SurveyPageClient />;
}
