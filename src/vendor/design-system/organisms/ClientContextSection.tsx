/**
 * ClientContextSection
 *
 * WHY · Case-study pages need a structured "who is the client" opening — logo · industry · company overview ·
 *       market context · capabilities list · strategic challenge. Inline assembly drifts per project.
 * WHAT · Renders a 12-col split layout: left sticky sidebar (logo · company name · industry) + right editorial column
 *        (lead paragraph · market narrative · capabilities stacked cards · strategic challenge highlight).
 *        Props: `logo?` image URL · `contentBlocks[]` typed union (heading/paragraph/list) · `showLink?` CTA toggle.
 * WHEN · First content section of every case-study page (after HeroSection).
 * WHEN NOT · Product pages (use `ProductHero` + stats) · blog posts · listing pages.
 * WHERE · Case-study template — section 1 (white bg · immediately after HeroSection).
 * HOW ·
 *   ```tsx
 *   // Default (backward-compat · Yash hardcoded)
 *   <ClientContextSection />
 *
 *   // Full propification (new case studies · 2026-05-15)
 *   <ClientContextSection
 *     logo="/logos/acme.svg"
 *     companyName="Acme Corp"
 *     industry="SaaS & Enterprise Software"
 *     eyebrow="Client Context"
 *     contentBlocks={[
 *       { type: 'heading', text: 'A vertically integrated SaaS company...' },
 *       { type: 'paragraph', text: 'B2B SaaS context...' },
 *       { type: 'list', items: ['Cap 1', 'Cap 2'] }
 *     ]}
 *     ctaHref="/profile/acme"
 *     ctaLabel="View Full Profile"
 *   />
 *   ```
 *
 * @reusabilityScore 4
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom casestudy-templates/template-v3
 */
import { AnimatedArrow } from '../atoms/AnimatedArrow';

// Content block types
type ContentBlock = 
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] };

interface ClientContextSectionProps {
  /** Company logo image URL. Falls back to a styled letter-mark when not provided. */
  logo?: string;
  /** Letter shown in fallback logo box when `logo` URL missing. Default = 'Y' (Yash compat). */
  logoFallback?: string;
  /** Alt text for logo image. Default = "Client logo". */
  logoAlt?: string;
  /** Company name shown in sidebar identity block. Default = "Yash Highvoltage Insulators" (backward-compat). */
  companyName?: string;
  /** Industry label shown in sidebar. Default = "Power Transmission & Electrical Equipment". */
  industry?: string;
  /** Section eyebrow label. Default = "Client Context". */
  eyebrow?: string;
  contentBlocks?: ContentBlock[];
  /** Show the bottom CTA link. Default true. */
  showLink?: boolean;
  /** CTA href. Default "#". */
  ctaHref?: string;
  /** CTA label. Default "View Full Profile". */
  ctaLabel?: string;
  /** CTA description. Default = "Want to learn more?" intro. */
  ctaDescription?: string;
}

export function ClientContextSection({
  logo,
  logoFallback = 'Y',
  logoAlt = 'Client logo',
  companyName = 'Yash Highvoltage Insulators',
  industry = 'Power Transmission & Electrical Equipment',
  eyebrow = 'Client Context',
  contentBlocks = [
    {
      type: 'heading',
      text: 'A vertically integrated manufacturer of high-voltage condenser and non-condenser bushings serving utilities, transformer OEMs, and EPC companies across India.'
    },
    {
      type: 'paragraph',
      text: "India's power transmission sector is undergoing accelerated modernization, driven by utility expansions, renewable energy integration, and grid reliability mandates. In this environment, the demand for transformer bushings—especially high-voltage and condenser variants—has become increasingly strategic."
    },
    {
      type: 'paragraph',
      text: 'Yash Highvoltage Insulators is positioned as one of the few domestic players with:'
    },
    {
      type: 'list',
      items: [
        'Deep engineering capability in HV condenser bushings',
        'Vertical integration across ceramic, insulation, and assembly processes',
        'Faster turnaround relative to imported alternatives, especially from Europe',
        'Ability to deliver fully customized and retrofit-grade products'
      ]
    },
    {
      type: 'paragraph',
      text: 'Despite strong product and technical maturity, the leadership faced strategic blind spots around market sizing, competitive positioning, supply chain risks, and investor narrative development.'
    }
  ],
  showLink = true,
  ctaHref = '#',
  ctaLabel = 'View Full Profile',
  ctaDescription = 'Explore the complete company profile and industry insights',
}: ClientContextSectionProps) {
  return (
    <section data-component="ClientContextSection" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Label */}
        <div className="mb-8 md:mb-10">
          <span className="font-medium text-black/40 uppercase tracking-[3px]" style={{ fontSize: 'var(--text-nav)' }}>
            {eyebrow}
          </span>
        </div>
        
        {/* Company Header - Split Layout on Desktop */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-14 pb-10 md:pb-12 border-b border-black/10">
          {/* Left: Logo & Identity */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-8">
              {logo ? (
                <img src={logo} alt={logoAlt} className="h-11 md:h-12 mb-6" style={{ borderRadius: 'var(--radius-inner)' }} />
              ) : (
                <div className="h-11 md:h-12 mb-6 bg-black/10 flex items-center justify-center text-black/40 font-medium" style={{ borderRadius: 'var(--radius-inner)' }} aria-hidden="true">
                  {logoFallback}
                </div>
              )}
              
              <div className="space-y-3">
                <div>
                  {/* 
                    TYPOGRAPHY RATIONALE: Sidebar Micro Labels
                    - fontSize: var(--text-card-micro) = 10px (standardized from 11px)
                    
                    WHY 10px (--text-card-micro):
                    1. Sidebar Spatial Constraint: This column is only 33% width (md:col-span-4)
                    2. Snapped to standard scale: 11px was a rogue value between 10px and 12px
                    3. Creates clean hierarchy: 10px labels → 12.8px secondary → 16px primary
                    4. Same token used by ResourceCard micro-labels for consistency
                    
                    VERDICT: --text-card-micro provides optimal sidebar balance
                  */}
                  <span className="font-medium text-black/40 uppercase tracking-[2px] block mb-1" style={{ fontSize: 'var(--text-card-micro)' }}>
                    Client Company
                  </span>
                  
                  {/* 
                    TYPOGRAPHY RATIONALE: Company Name
                    - fontSize: var(--text-sm) = 16px (standardized from 17px)
                    
                    WHY 16px (--text-sm):
                    1. Snapped to standard scale: 17px was a rogue value between 16px and 20px
                    2. Standard body text size maintains emphasis without custom token
                    3. Font-weight: medium provides visual separation from 12.8px industry text
                    4. Prevents wrapping: 16px handles "Yash Highvoltage Insulators" at sidebar width
                    
                    VERDICT: --text-sm is the standard body size, works for sidebar titles
                  */}
                  <h3 className="font-medium text-black leading-[1.3]" style={{ fontSize: 'var(--text-sm)' }}>
                    {companyName}
                  </h3>
                </div>
                
                <div className="h-px w-12 bg-black/20"></div>
                
                <div>
                  <span className="font-medium text-black/40 uppercase tracking-[2px] block mb-1" style={{ fontSize: 'var(--text-card-micro)' }}>
                    Industry
                  </span>
                  
                  {/* 
                    TYPOGRAPHY RATIONALE: Industry Text
                    - fontSize: var(--text-xs) = 12.8px (standardized from 13px)
                    
                    WHY 12.8px (--text-xs):
                    1. Snapped to Major Third scale: 13px was 0.2px off from --text-xs
                    2. Creates clean hierarchy: 10px labels → 12.8px secondary → 16px primary
                    3. Same token used across all card metadata and step badges
                    4. Visually identical to 13px — no perceptible difference
                    
                    VERDICT: --text-xs is the standard small text token
                  */}
                  <p className="text-black/70 leading-[1.5]" style={{ fontSize: 'var(--text-xs)' }}>
                    {industry}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Company Overview */}
          <div className="md:col-span-8">
            {contentBlocks.map((block, index) => {
              if (block.type === 'heading' && index === 0) {
                return (
                  <div key={index}>
                    <span className="font-medium text-black/40 uppercase tracking-[2px] block mb-4" style={{ fontSize: 'var(--text-card-micro)' }}>
                      Company Overview
                    </span>
                    {/* 
                      TYPOGRAPHY RATIONALE: Lead Paragraph (Editorial Treatment)
                      - fontSize: clamp(19px, 2.8vw, 24px) - Responsive range
                      
                      WHY HARDCODED:
                      1. Responsive Typography: Needs to scale smoothly from mobile to desktop
                      2. Editorial "Lead Paragraph": Larger than body (16px), smaller than heading (25px)
                      3. Precise Range Control:
                         - Minimum 19px: Readable on mobile without being too small
                         - Maximum 24px: Impactful on desktop without overwhelming
                         - 2.8vw: Smooth viewport-based scaling
                      4. Hierarchical Position: Sits between body text and subheadings
                      
                      ALTERNATIVE CONSIDERED:
                      - var(--text-base) (20px): Fixed size, no responsive scaling
                      - clamp(1rem, 2.5vw, var(--text-lg)): Range too wide (16px-25px)
                      
                      WHY THIS SPECIFIC RANGE:
                      Testing showed:
                      - 16px-25px: Too jarring on mobile-to-desktop transition
                      - 18px-22px: Not enough visual impact
                      - 19px-24px: Perfect balance of readability and prominence
                      
                      VERDICT: Keep clamp() for editorial lead paragraph treatment
                      Note: This is a "featured paragraph" pattern common in editorial design
                    */}
                    <p 
                      className="leading-[1.45] font-normal text-black" 
                      style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(19px, 2.8vw, 24px)' }}
                    >
                      {block.text}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Market Context - Narrative Flow */}
        <div className="mb-12 md:mb-14">
          <div className="mb-6 md:mb-8">
            <span className="font-medium text-black/40 uppercase tracking-[2px]" style={{ fontSize: 'var(--text-card-micro)' }}>
              Market Context
            </span>
          </div>
          
          <div className="space-y-5 md:space-y-6">
            {contentBlocks.map((block, index) => {
              if (block.type === 'paragraph') {
                return (
                  <p 
                    key={index} 
                    className="leading-[1.7] text-black/70 max-w-[780px]" 
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    {block.text}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Key Capabilities - Feature Grid */}
        <div className="mb-12 md:mb-14">
          {contentBlocks.map((block, index) => {
            if (block.type === 'list') {
              return (
                <div key={index}>
                  <div className="mb-6 md:mb-8">
                    <span className="font-medium text-black/40 uppercase tracking-[2px] block mb-2" style={{ fontSize: 'var(--text-card-micro)' }}>
                      Competitive Advantages
                    </span>
                    <h4 className="font-normal text-black leading-[1.3]" style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-base)' }}>
                      Key Capabilities & Differentiators
                    </h4>
                  </div>
                  
                  {/* Capabilities as stacked cards with better visual hierarchy */}
                  <div className="space-y-3 md:space-y-4">
                    {block.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="group relative bg-black/[0.015] hover:bg-black/[0.03] border-l-2 border-black/10 hover:border-black/30 pl-5 pr-4 py-4 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          {/* Minimal Number Prefix */}
                          <span 
                            className="font-medium text-black/30 group-hover:text-black/50 transition-colors duration-300 flex-shrink-0 pt-0.5" 
                            style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-serif)', minWidth: '24px' }}
                          >
                            {String(itemIndex + 1).padStart(2, '0')}
                          </span>
                          
                          {/* Content */}
                          <p 
                            className="leading-[1.6] text-black/70 group-hover:text-black/90 transition-colors duration-300 flex-1" 
                            style={{ fontSize: 'var(--text-sm)' }}
                          >
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Strategic Challenge - Highlighted */}
        <div className="relative">
          {contentBlocks.map((block, index) => {
            if (block.type === 'paragraph' && index === contentBlocks.length - 1) {
              return (
                <div key={index}>
                  <div className="mb-4 md:mb-6">
                    <span className="font-medium text-black/40 uppercase tracking-[2px]" style={{ fontSize: 'var(--text-card-micro)' }}>
                      Strategic Challenge
                    </span>
                  </div>
                  
                  <div className="relative bg-[var(--bg-warm)] text-black p-8 md:p-10 overflow-hidden" style={{ borderRadius: 'var(--radius-element)' }}>
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    
                    <div className="relative">
                      <p 
                        className="leading-[1.6] text-black/70 max-w-[var(--container-prose)]" 
                        style={{ fontSize: 'var(--text-sm)' }}
                      >
                        {block.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* CTA - Refined */}
        {showLink && (
          <div className="mt-12 md:mt-14 pt-10 md:pt-12 border-t border-black/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="font-medium text-black/40 mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                  Want to learn more?
                </p>
                <p className="text-black/70 leading-[1.6]" style={{ fontSize: 'var(--text-xs)' }}>
                  {ctaDescription}
                </p>
              </div>

              <a
                href={ctaHref}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-black text-white font-medium hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-2 transition-all duration-300 whitespace-nowrap overflow-hidden"
                style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.3px', borderRadius: 'var(--radius-element)' }}
              >
                <span>{ctaLabel}</span>
                <AnimatedArrow size={16} color="white" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}