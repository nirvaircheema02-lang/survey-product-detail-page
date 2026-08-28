/**
 * survey-bank-nbfc.ts — content + config for the Bank vs NBFC Preference Survey (SMEs) PDP
 *
 * CONTENT SOURCE OF TRUTH: the live page at kenresearch.com/survey/bank-nbfc-perference,
 * captured verbatim 2026-08-25. Figma (node 3668:1090) used only where the live page's
 * own content is truncated (the FGD methodology column — its live card is clipped by the
 * horizontal-overflow bug this rebuild fixes; Figma's FGD copy is bank/NBFC-specific).
 *
 * PRICING: the estimate model below reproduces the live calculator's observed behavior
 * exactly (probed 2026-08-25). It is multiplicative — base ₹4,00,000 (India · Online ·
 * LOI 21-30) × geography factor × mode factor × LOI factor — and every probed live data
 * point matches. Sample size intentionally does NOT change the estimate (live behavior:
 * "Data Collection (CPI + 50C)" is quoted separately as Variable).
 * // TODO: replace pricing + FX with real API when the backend endpoint exists.
 */

// ─── Sampling Strategy ───────────────────────────────────────────────────────

export interface SamplingGroup {
  id: string;
  title: string;
  question: string;
  /** lucide icon name is resolved in the section component */
  multiSelect: boolean;
  options: string[];
  /** Short label used in the "Your Selection" summary panel */
  summaryLabel: string;
}

export const SAMPLING_GROUPS: SamplingGroup[] = [
  {
    id: 'sample-size',
    title: 'Sample size',
    question: 'How many respondents do you need?',
    multiSelect: false,
    summaryLabel: 'Sample size',
    options: [
      'Less than 300',
      '300-500',
      '500-1,000',
      '1,000-3,000',
      '3,000+',
      'Not sure yet (recommend based on markets and cuts required)',
    ],
  },
  {
    id: 'target-audience',
    title: 'Target audience',
    question: 'Who should we survey?',
    multiSelect: true,
    summaryLabel: 'Target audience',
    options: [
      'Bank Borrowers',
      'NBFC Borrowers',
      'Dual-source SMEs',
      'Credit-rejected SMEs',
      'First-time Borrowers',
    ],
  },
  {
    id: 'region',
    title: 'Region',
    question: 'Which regions should we cover?',
    multiSelect: true,
    summaryLabel: 'Region',
    options: ['North', 'South', 'West', 'East', 'Pan-India', 'Multi-country'],
  },
  {
    id: 'segments',
    title: 'Segments',
    question: 'How should we slice the data?',
    multiSelect: true,
    summaryLabel: 'Segments',
    options: [
      'Lender type: bank-only vs NBFC-only vs both',
      'Ticket size: micro (up to 10L), small (10-50L), mid (50L+)',
      'Collateral profile: secured vs unsecured',
      'Relationship vintage: new (under 1 year) vs established (1 year+)',
      'Sector: manufacturing vs trading vs retail vs services',
    ],
  },
];

// ─── Methodology ─────────────────────────────────────────────────────────────

export interface MethodologyMode {
  id: string;
  /** Status label — 'Primary' gets the brand-red treatment */
  status: 'Primary' | 'Optional' | 'Selective';
  name: string;
  description: string;
  /** "Best for" on quant modes, "Key uses" on FGDs. Omitted (with an empty
   *  `bestFor`) on modes whose live card has no Best-for/Key-uses block at all
   *  (Mixed surveys). */
  bestForLabel?: 'Best for' | 'Key uses';
  bestFor: string[];
  deliverables: string[];
}

/** The 4 comparison columns (desktop 4-col · tablet 2×2 · mobile stacked) */
export const METHODOLOGY_MODES: MethodologyMode[] = [
  {
    id: 'online',
    status: 'Primary',
    name: 'Online web survey',
    description:
      'Self-administered survey shared via email / panels to capture structured responses at scale.',
    bestForLabel: 'Best for',
    bestFor: [
      'Measuring bank vs NBFC preference and usage',
      'Ranking lending decision drivers by SME segment',
      'Comparing satisfaction across size, industry, region',
    ],
    deliverables: ['Driver ranking', 'Gap matrix', 'Pricing bands'],
  },
  {
    id: 'cati',
    status: 'Optional',
    name: 'CATI (phone survey)',
    description:
      'Interviewer-led telephone interviews to reach owners who are harder to get online.',
    bestForLabel: 'Best for',
    bestFor: [
      'Micro and small SME owners with low digital comfort',
      'Quick pulse across multiple towns and clusters',
    ],
    deliverables: ['Representative SME coverage', 'Call-log diagnostics'],
  },
  {
    id: 'f2f',
    status: 'Selective',
    name: 'Face-to-face',
    description:
      'On-ground surveys or interviews in key industrial clusters or high-value cohorts.',
    bestForLabel: 'Best for',
    bestFor: [
      'Larger-ticket borrowers needing in-person verification',
      'Contextual mapping of local lending ecosystems',
    ],
    deliverables: ['Cluster insights', 'Rich journey maps'],
  },
  {
    id: 'fgd',
    status: 'Optional',
    name: 'FGDs',
    // Live card's description slot renders empty (verified in live DOM, 2026-08-26).
    description: '',
    bestForLabel: 'Key uses',
    // Live card omits the "Key uses" block entirely (verified in live DOM,
    // 2026-08-26) — Figma still shows it w/ 2 items. Left empty to match live;
    // component skips the block when bestFor.length === 0.
    bestFor: [],
    deliverables: ['Themes and quotes', 'Concept feedback'],
  },
  {
    // 5th live mode — a real 5th card inside the same carousel, not a separate
    // full-width band (verified in live DOM, 2026-08-26: same swiper-wrapper,
    // identical 317px card shape, no "Best for" block — same shape as FGDs above).
    id: 'mixed',
    status: 'Optional',
    name: 'Mixed surveys',
    description:
      'Any 4-mode combo Online + CATI + F2F + FGDs to maximise reach and representation. Mode-specific quotas and weighting for clean comparisons.',
    bestFor: [],
    deliverables: ['Unified dataset', 'Mode-adjusted analytics'],
  },
];

export const METHODOLOGY_RECOMMENDATION = {
  startWith:
    'Online web survey as the core quant instrument, supported by CATI to capture micro and small SME owners in low-digital segments.',
  considerAdding:
    'Face-to-face interviews in strategic industrial clusters and a focused FGD layer to pressure-test messaging and proposition concepts.',
};

// ─── Execution Process ───────────────────────────────────────────────────────

export interface ExecutionStep {
  number: string;
  title: string;
  description: string;
  /** lucide icon key resolved in the section component */
  icon:
    | 'crosshair'
    | 'pen'
    | 'clipboard'
    | 'sliders'
    | 'rocket'
    | 'shield'
    | 'database'
    | 'chart'
    | 'send';
}

export const EXECUTION_STEPS: ExecutionStep[] = [
  {
    number: '01',
    title: 'Define the decision frame',
    description: 'Confirm objectives, target cohorts, geographies, and reporting cuts',
    icon: 'crosshair',
  },
  {
    number: '02',
    title: 'Design the instrument',
    description:
      'Build workstream modules mapped to outputs (drivers, friction, pricing, retention, trust)',
    icon: 'pen',
  },
  {
    number: '03',
    title: 'Lock the questionnaire',
    description:
      'Review wording, sequencing, LOI, and competitive context; approve final version',
    icon: 'clipboard',
  },
  {
    number: '04',
    title: 'Pilot and calibrate',
    description:
      'Test comprehension and ease quality; refine quotas and remove friction where needed',
    icon: 'sliders',
  },
  {
    number: '05',
    title: 'Run fieldwork',
    description: 'Execute collection with active quota management and feasibility controls',
    icon: 'rocket',
  },
  {
    number: '06',
    title: 'Assure quality',
    description:
      'Dedupe, attention checks, speed/consistency rules, removals with audit trail',
    icon: 'shield',
  },
  {
    number: '07',
    title: 'Prepare the dataset',
    description: 'Clean data and deliver codebook/variable definitions',
    icon: 'database',
  },
  {
    number: '08',
    title: 'Analyse and synthesise',
    description: 'Driver ranking, leakage diagnostics, pricing bands, segment insights',
    icon: 'chart',
  },
  {
    number: '09',
    title: 'Deliver and align',
    description:
      'Executive deck (optional dashboard) and leadership readout with recommendations',
    icon: 'send',
  },
];

// ─── Commercial Terms (calculator) ───────────────────────────────────────────

export const SAMPLE_SIZE_RANGE = { min: 100, max: 10000, default: 100 };

export interface GeographyOption {
  label: string;
  /** Multiplier vs India — reproduces live-page observed pricing exactly */
  factor: number;
}

export const GEOGRAPHY_OPTIONS: GeographyOption[] = [
  { label: 'India', factor: 1 },
  {
    label: 'APAC (Singapore, Vietnam, Philippines, Indonesia, Australia, NZ, Japan, Thailand)',
    factor: 2,
  },
  { label: 'Middle East (UAE, KSA, Qatar, Bahrain, Oman, Kuwait)', factor: 2.5 },
  { label: 'North America (US, Canada)', factor: 2.75 },
  { label: 'Europe', factor: 2.75 },
  { label: 'Africa (South Africa, Kenya, Nigeria, Egypt, Algeria)', factor: 2 },
  { label: 'LATAM (Brazil, Mexico)', factor: 3.5 },
];

export interface SurveyModeOption {
  label: string;
  factor: number;
}

export const SURVEY_MODE_OPTIONS: SurveyModeOption[] = [
  { label: 'Online', factor: 1 },
  { label: 'CATI', factor: 1 },
  { label: 'Online FGD (5 people per FGD)', factor: 1.4 },
  { label: 'F2F', factor: 2.4 },
];

export interface LoiOption {
  label: string;
  /** null → estimate shows "On request" (Custom LOI is scoped on the call) */
  factor: number | null;
}

export const LOI_OPTIONS: LoiOption[] = [
  { label: '0-15', factor: 0.71875 },
  { label: '16-20', factor: 0.8125 },
  { label: '21-30', factor: 1 },
  { label: '31-45', factor: 1.28125 },
  { label: '46-60', factor: 1.5625 },
  { label: 'Custom', factor: null },
];

/** ₹ base: India · Online · LOI 21-30 (observed live). LOI unselected → ×0.625 (= live ₹2.50 L default). */
export const PRICE_BASE_INR = 400000;
export const LOI_UNSET_FACTOR = 0.625;

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  /** INR per 1 unit — USD observed from live conversion; others approximate static mock.
   *  TODO: replace w/ real FX API */
  inrPerUnit: number;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', inrPerUnit: 1 },
  { code: 'USD', symbol: '$', name: 'United States Dollar', inrPerUnit: 95.7 },
  { code: 'EUR', symbol: '€', name: 'Euro', inrPerUnit: 103.5 },
  { code: 'GBP', symbol: '£', name: 'British Pound', inrPerUnit: 121.2 },
  { code: 'AED', symbol: 'AED ', name: 'United Arab Emirates Dirham', inrPerUnit: 26.1 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', inrPerUnit: 71.4 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', inrPerUnit: 0.64 },
];

/** Estimate in INR, or null when LOI = Custom ("On request"). */
export function computeEstimateInr(
  geography: GeographyOption,
  mode: SurveyModeOption,
  loi: LoiOption | null,
): number | null {
  const loiFactor = loi === null ? LOI_UNSET_FACTOR : loi.factor;
  if (loiFactor === null) return null;
  return PRICE_BASE_INR * geography.factor * mode.factor * loiFactor;
}

/** "₹2.50 L" / "₹14 L" / "₹1.20 Cr" for INR · "$11,493.90" style for other currencies. */
export function formatEstimate(inr: number, currency: CurrencyOption): string {
  if (currency.code === 'INR') {
    if (inr >= 10000000) {
      const cr = inr / 10000000;
      return `₹${trimZeros(cr)} Cr`;
    }
    const lakh = inr / 100000;
    return `₹${trimZeros(lakh)} L`;
  }
  const converted = inr / currency.inrPerUnit;
  return `${currency.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Whole numbers drop decimals ("₹4 L"); everything else keeps exactly two ("₹2.50 L") — matches live. */
function trimZeros(n: number): string {
  return n.toFixed(2).replace(/\.00$/, '');
}

export const COST_BREAKDOWN = [
  { item: 'Questionnaire Design', status: 'Included' as const },
  { item: 'Data Collection (CPI + 50C)', status: 'Variable' as const },
  { item: 'Analysis & Report', status: 'Included' as const },
];

export const COMMERCIAL_NOTES = {
  turnaround: 'Proposal turnaround typically 24–48 hours',
  disclaimer:
    'Note: Estimate is indicative only. Final pricing is subject to scope finalization after discovery call.',
};

// ─── Reference Caselets ──────────────────────────────────────────────────────

export interface Caselet {
  id: string;
  label: string;
  title: string;
  image: string;
  imageAlt: string;
  objective: string;
  whatWeDid: string;
  delivered: string;
}

export const CASELETS: Caselet[] = [
  {
    id: 'caselet-1',
    label: 'Caselet 1',
    title: 'MSME Working Capital Channel Preferences & Friction Mapping (India)',
    image: '/images/caselet-msme-working-capital.webp',
    imageAlt:
      'Laptop on a desk — MSME working capital channel preference survey engagement',
    objective:
      'Quantify how micro and small manufacturers select between digital lending platforms and traditional branch-based lenders for working capital, isolating the role of turnaround speed, collateral requirements, and relationship trust in shaping channel stickiness and switching triggers.',
    whatWeDid:
      'Fielded a structured quant survey across 6 cities with 480 MSME owners, capturing channel discovery path, application completion rates, documentation burden, disbursement timelines, and satisfaction scores segmented by loan ticket size and vintage of borrowing.',
    delivered:
      'Channel preference corridor by MSME size tier, a ranked friction list per lending channel, a switching trigger framework identifying 5 displacement moments, and segment-level message territories for digital-first acquisition campaigns targeting first-time borrowers.',
  },
  {
    id: 'caselet-2',
    label: 'Caselet 2',
    title: 'SME Trade Finance Product Gaps & Pricing Sensitivity (Western India)',
    image: '/images/caselet-sme-trade-finance.webp',
    imageAlt: 'Currency and finance imagery — SME trade finance survey engagement',
    objective:
      'Map unmet product needs among export-oriented small enterprises using trade finance from private banks versus NBFCs, and identify which pricing dimensions, fee structures, and service gaps most influence renewal decisions and wallet share allocation across lender types.',
    whatWeDid:
      'Conducted 36 semi-structured tele-depth interviews with SME CFOs and founder-operators in Gujarat and Maharashtra, probing product bundling expectations, hidden cost perceptions, relationship manager responsiveness, and willingness to pay for faster limit enhancements.',
    delivered:
      'A pricing sensitivity map across 4 fee components, a product gap register ranked by revenue impact potential for the lender, relationship quality levers by enterprise size, and a segment framework distinguishing price-led versus service-led SME borrower profiles.',
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What decisions will this survey enable?',
    answer:
      'It will show which lender type SMEs prefer, why they choose banks or NBFCs, where journeys break, and what changes can shift share of wallet and loyalty.',
  },
  {
    id: 'faq-2',
    question: 'Who is the buyer vs who are the respondents?',
    answer:
      'The buyer is the bank, NBFC, or fintech commissioning the study. Respondents are SME owners or finance decision-makers currently using or actively considering formal business credit.',
  },
  {
    id: 'faq-3',
    question: 'Can we see differences between bank-only, NBFC-only and mixed borrowers?',
    answer:
      'Yes. The design segments respondents by primary lender type and allows cuts by exposure mix, ticket size, and sector to isolate patterns and opportunities.',
  },
  {
    id: 'faq-4',
    question: 'How will you measure lender preference beyond simple ratings?',
    answer:
      'We combine stated importance, trade-off questions, and driver modelling to reveal which factors actually shift choice between banks and NBFCs for each segment.',
  },
  {
    id: 'faq-5',
    question: 'Will the survey map the full credit journey and drop-offs?',
    answer:
      'Yes, we cover stages from need recognition to renewal, capturing channel used, lender approached, application status, rejections, and reasons for switching or abandoning.',
  },
  {
    id: 'faq-6',
    question: 'Can this survey inform product and pricing strategy?',
    answer:
      'It estimates acceptable rate and fee bands, willingness-to-pay for speed or flexibility, and identifies unmet product needs by SME profile and loan type.',
  },
  {
    id: 'faq-7',
    question: 'How will findings improve our sales and marketing messaging?',
    answer:
      'Insights show which benefits such as speed, flexibility, security, and advisory resonate by segment and what proof points build trust for each lender type.',
  },
];

export const FAQ_CTA = {
  heading: 'Still have questions?',
  copy: 'Schedule a discovery call to discuss your specific needs and get a custom quote.',
  buttonLabel: 'Book a Discovery Call',
};

// ─── Research Themes ─────────────────────────────────────────────────────────

export interface ResearchTheme {
  /** Two-digit index — the primary visual anchor in the section. */
  index: string;
  title: string;
  points: [string, string];
}

export const RESEARCH_THEMES: ResearchTheme[] = [
  {
    index: '01',
    title: 'Discovery & Awareness',
    points: ['First lender contact channels', 'Referral vs direct outreach triggers'],
  },
  {
    index: '02',
    title: 'Preference Drivers',
    points: ['Bank vs NBFC selection criteria', 'Speed, collateral, relationship weight'],
  },
  {
    index: '03',
    title: 'Product & Structuring',
    points: ['Facility type, tenure, collateral mix', 'Cash credit vs term loan preference'],
  },
  {
    index: '04',
    title: 'Journey Friction',
    points: ['Drop-offs across application stages', 'Documentation, verification delays'],
  },
  {
    index: '05',
    title: 'Pricing & WTP',
    points: ['Rate sensitivity by facility type', 'Fee transparency, hidden charge perception'],
  },
  {
    index: '06',
    title: 'Servicing & Stickiness',
    points: ['RM responsiveness, digital self-service', 'Renewal, top-up conversion triggers'],
  },
  {
    index: '07',
    title: 'Trust & Credibility',
    points: ['Institutional trust, regulatory comfort', 'Data privacy, grievance resolution'],
  },
  {
    index: '08',
    title: 'Competitive Positioning',
    points: ['Multi-lender usage, wallet share split', 'Switching intent by lender category'],
  },
];

// ─── Sample Questions (Research Themes modal) ────────────────────────────────

export type SampleQuestionType = 'single' | 'multi' | 'open';

export interface SampleQuestion {
  type: SampleQuestionType;
  /** Respondent-facing instruction shown under the question. */
  typeLabel: string;
  text: string;
  options: string[];
}

export interface ThemeSampleQuestions {
  themeIndex: string;
  /** Total questions in the full instrument for this module. */
  totalInModule: number;
  questions: SampleQuestion[];
}

/**
 * Captured verbatim from the live page (kenresearch.com/survey/bank-nbfc-perference)
 * on 2026-08-26 by opening each of the 8 "View Sample Questions" modals.
 * 4 preview questions shown per theme, out of 32 in the full instrument.
 *
 * NOTE: the live modal hardcodes the header "Module A: Awareness & Consideration"
 * for every theme — a bug there. We label each modal with its own theme title.
 * // TODO: replace w/ real API — GET /api/surveys/:slug/themes/:id/sample-questions
 */
export const SAMPLE_QUESTIONS: Record<string, ThemeSampleQuestions> = {
  '01': {
    themeIndex: '01',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'How did you first learn about your current lending institution?',
        options: ['CA or advisor referral', 'Branch walk-in', 'Online search', 'Sales call', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which sources do you consult before shortlisting a lender for working capital?',
        options: ['Peer recommendations', 'Online reviews', 'Industry association', 'Bank relationship manager', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Did a field agent from an NBFC approach you before you started looking?',
        options: ['Yes, within 6 months', 'Yes, over 6 months ago', 'No', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'What prompted your most recent search for a new credit facility?',
        options: [],
      },
    ],
  },
  '02': {
    themeIndex: '02',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Which single factor most influenced your choice of a bank over an NBFC, or vice versa?',
        options: ['Interest rate', 'Disbursement speed', 'Collateral flexibility', 'Existing relationship', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which lender attributes matter most when you renew or top up a facility?',
        options: ['Pre-approved limit', 'Minimal re-documentation', 'Dedicated RM', 'Lower processing fee', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Would you accept a 50 to 100 bps higher rate for same-week disbursement?',
        options: ['Yes, always', 'Yes, for urgent needs only', 'No', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'Describe the one thing that would make you switch from your current lender today.',
        options: [],
      },
    ],
  },
  '03': {
    themeIndex: '03',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Which credit product does your business use most frequently?',
        options: ['Cash credit or overdraft', 'Term loan', 'Invoice discounting', 'Unsecured business loan', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which collateral types has your lender accepted in the last 24 months?',
        options: ['Commercial property', 'Inventory', 'Receivables', 'Personal guarantee only', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'What loan tenure best fits your current working capital cycle?',
        options: ['Under 6 months', '6 to 12 months', '12 to 36 months', 'Over 36 months', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'What product feature is missing from your current facility that you need most?',
        options: [],
      },
    ],
  },
  '04': {
    themeIndex: '04',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'At which stage did your most recent loan application face the longest delay?',
        options: ['Document submission', 'Credit appraisal', 'Collateral valuation', 'Final sanction', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which documents caused repeated back-and-forth with your lender?',
        options: ['GST returns', 'ITR filings', 'Bank statements', 'Property papers', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Have you abandoned a loan application midway in the last 12 months?',
        options: ['Yes, with a bank', 'Yes, with an NBFC', 'Yes, with both', 'No', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'What was the primary reason you abandoned or paused that application?',
        options: [],
      },
    ],
  },
  '05': {
    themeIndex: '05',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'What is the maximum annual interest rate you would accept on unsecured working capital?',
        options: ['Under 12%', '12 to 16%', '16 to 20%', 'Above 20%', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which fees surprised you after sanction of your most recent facility?',
        options: ['Processing fee', 'Prepayment penalty', 'Insurance charge', 'Annual review fee', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Would you pay a higher processing fee upfront for a guaranteed 48-hour disbursement?',
        options: ['Yes', 'Only if fee is under 1%', 'No', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'How do you compare the total cost of borrowing between your bank and NBFC options?',
        options: [],
      },
    ],
  },
  '06': {
    themeIndex: '06',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'How do you primarily interact with your lender after disbursement?',
        options: ['Dedicated RM visit', 'Branch visit', 'Mobile app or portal', 'Call centre', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which post-disbursement services have you used in the last 12 months?',
        options: ['Limit enhancement', 'Repayment reschedule', 'Statement download', 'Insurance add-on', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Has your lender proactively offered a top-up before your facility expired?',
        options: ['Yes, bank', 'Yes, NBFC', 'Yes, both', 'Neither', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'What single servicing improvement would increase your likelihood of renewing with the same lender?',
        options: [],
      },
    ],
  },
  '07': {
    themeIndex: '07',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Which institution type do you trust more with your business financial data?',
        options: ['Public sector bank', 'Private bank', 'Large NBFC', 'Fintech NBFC', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which trust signals matter most when you evaluate a new lender?',
        options: ['RBI licence visibility', 'Known brand name', 'Peer endorsement', 'Published grievance TAT', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Have you filed a formal complaint with any lender in the last 24 months?',
        options: ['Yes, with a bank', 'Yes, with an NBFC', 'Yes, with both', 'No', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'What specific incident, if any, reduced your trust in a lender you previously used?',
        options: [],
      },
    ],
  },
  '08': {
    themeIndex: '08',
    totalInModule: 32,
    questions: [
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'How many active credit relationships does your business maintain today?',
        options: ['1', '2', '3', '4 or more', 'Not sure'],
      },
      {
        type: 'multi',
        typeLabel: 'Select all that apply',
        text: 'Which lender categories currently hold the largest share of your outstanding credit?',
        options: ['Public sector bank', 'Private bank', 'Large NBFC', 'Fintech NBFC', 'None so far'],
      },
      {
        type: 'single',
        typeLabel: 'Select one',
        text: 'Do you plan to shift your primary borrowing relationship in the next 12 months?',
        options: ['Yes, bank to NBFC', 'Yes, NBFC to bank', 'No change planned', 'Not sure'],
      },
      {
        type: 'open',
        typeLabel: 'Open-ended',
        text: 'What would a competing lender need to offer to win your primary credit wallet?',
        options: [],
      },
    ],
  },
};
