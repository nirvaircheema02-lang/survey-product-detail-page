'use client';

/**
 * SurveyPageClient — client-side composition for the Bank vs NBFC Preference
 * Survey (SMEs) product detail page.
 *
 * @what  Canonical DS chrome (Navbar / Footer organisms) wrapping the survey
 *        section sequence. FAQ is the canonical DS FAQSection organism — it
 *        owns its own section shell and contact CTA, so it is NOT wrapped in a
 *        SectionWrapper (ANTI_PATTERNS Cat 4.5: never wrap an organism).
 * @why   Split out from page.tsx so page.tsx stays a Server Component and can
 *        export per-route `metadata`. This file owns the page-level state.
 * @how   Section rhythm alternates white / warm with xl spacing on the three
 *        editorial anchors (Themes · Methodology · Caselets) and lg elsewhere,
 *        matching the alternation every design-system/recipes/* sequence uses.
 */

import { Navbar, Footer, FAQSection } from '@/vendor/design-system/organisms';
import { PageProgressBar } from '@/components/chrome/PageProgressBar';
import { SurveyHero } from '@/components/survey-sections/SurveyHero';
import { ContextRelevanceSection } from '@/components/survey-sections/ContextRelevanceSection';
import { ResearchThemesSection } from '@/components/survey-sections/ResearchThemesSection';
import { DashboardPreviewSection } from '@/components/survey-sections/DashboardPreviewSection';
import { SamplingStrategySection } from '@/components/survey-sections/SamplingStrategySection';
import { SurveyMethodologySection } from '@/components/survey-sections/SurveyMethodologySection';
import { ExecutionProcessSection } from '@/components/survey-sections/ExecutionProcessSection';
import { CommercialTermsSection } from '@/components/survey-sections/CommercialTermsSection';
import { ReferenceCaseletsSection } from '@/components/survey-sections/ReferenceCaseletsSection';
import { FAQ_ITEMS, FAQ_CTA } from '@/data/survey-bank-nbfc';

export function SurveyPageClient() {
  return (
    <>
      <PageProgressBar />
      <Navbar activeHref="/survey" />

      <main id="main">
        <SurveyHero />
        <ContextRelevanceSection />
        <ResearchThemesSection />
        <DashboardPreviewSection />
        <SamplingStrategySection />
        <SurveyMethodologySection />
        <ExecutionProcessSection />
        <CommercialTermsSection />
        <ReferenceCaseletsSection />

        {/* Canonical DS FAQ organism — content injected, pattern untouched.
            Brings its own "Still have questions?" contact CTA. */}
        <div id="faq" className="scroll-mt-[120px]">
          <FAQSection
            faqs={FAQ_ITEMS}
            defaultOpenId={null}
            label="Frequently Asked Questions"
            heading="Common Questions"
            description="Answers to frequently asked questions about this survey mandate."
            contactHref="#discovery-call"
            contactLabel={FAQ_CTA.buttonLabel}
            contactHeading={FAQ_CTA.heading}
            contactDescription={FAQ_CTA.copy}
            contactCtaVariant="button"
            labelVariant="accent"
            containerWidth="page"
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
