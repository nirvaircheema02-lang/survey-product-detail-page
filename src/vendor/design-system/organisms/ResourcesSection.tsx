/**
 * ResourcesSection
 *
 * WHY · Related resources / thought leadership need a responsive Masonry grid that works on both
 *       dark cinematic and editorial light surfaces — a fixed grid breaks at uneven card heights.
 * WHAT · Masonry grid (react-responsive-masonry · 1/2/3 cols) with dark/light mode bg layers.
 *        11 `ResourceCard` variants per item. Optional variant switcher for design exploration.
 *        Props: `mode` ('dark'|'light') · `cardStyle` · `customResources[]` · `sectionLabel` · `title` · `description` · `ctaLabel`.
 * WHEN · Case-study ResourcesSection (always dark) · blog/resource-hub listing (light).
 * WHEN NOT · Featured report carousel (use `FeaturedCarousel`) · primary product grid (use `BrowseGrid`).
 * WHERE · Case-study template — penultimate section (dark cinematic bg per recipe).
 *         Report-store as secondary resource feed.
 * HOW ·
 *   ```tsx
 *   // Case-study dark mode
 *   <ResourcesSection mode="dark" cardStyle="bordered" />
 *   // Light editorial with custom data
 *   <ResourcesSection mode="light" customResources={myResources} title="Latest Insights" />
 *   ```
 *
 * @reusabilityScore 5
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom V0_lite_report
 */
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RESOURCES SECTION COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * A complete, reusable section for displaying resource cards in a responsive
 * Masonry grid layout. Supports both dark and light modes, two card styles,
 * and a built-in variant switcher for design exploration.
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * LAYOUT SYSTEM
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Container: var(--container-content) — 1000px max-width, centered
 * Grid: Responsive Masonry → 1 col (mobile) → 2 col (640px) → 3 col (1024px)
 * Gutters: 24px mobile → 32px desktop (from useResponsiveGutter hook)
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * MODE SYSTEM
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Mode     | Section Background          | Text      | Cards
 * ---------|-------------------------------|-----------|------------------
 * 'dark'   | Multi-layer dark gradient     | White     | Dark-mode cards
 * 'light'  | White / warm editorial        | Black     | Light-mode cards
 * 
 * ───────────────────────────────────────────────────────────────────────────
 * USAGE EXAMPLES
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Dark mode (case study page, original):
 * ```tsx
 * <ResourcesSection
 *   mode="dark"
 *   cardStyle="bordered"
 *   enableVariantSwitcher
 * />
 * ```
 * 
 * Light mode (blog listing, resource hub):
 * ```tsx
 * <ResourcesSection
 *   mode="light"
 *   cardStyle="bordered"
 *   title="Latest Insights"
 *   description="Explore our thought leadership..."
 *   sectionLabel="Blog"
 *   ctaLabel="View All Posts"
 * />
 * ```
 * 
 * Custom data (any project):
 * ```tsx
 * <ResourcesSection
 *   mode="light"
 *   cardStyle="default"
 *   customResources={myResources}
 *   title="Our Work"
 *   sectionLabel="Case Studies"
 * />
 * ```
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { Button } from '../atoms/Button';
import { ResourceCard, type ResourceCardVariant, type ResourceCardStyle, type ResourceContentType } from '../atoms/ResourceCard';
import { Container } from '../atoms/Container';
import { SubtleVariantSwitcher } from '../atoms/SubtleVariantSwitcher';
import { useResponsiveGutter } from '../hooks/useResponsiveGutter';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

// ── Asset URLs for default demo data ──
// These replace figma:asset/ virtual imports so the file works on GitHub.
const imgAiSupplyChain = "https://images.unsplash.com/photo-1767966769495-dbb5e14cab5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwc3VwcGx5JTIwY2hhaW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjMyNDQ0MHww&ixlib=rb-4.1.0&q=80&w=1080";
const imgResilientSupplyChains = "https://images.unsplash.com/photo-1554769944-3138b076c38a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNpbGllbnQlMjBzdXBwbHklMjBjaGFpbiUyMGxvZ2lzdGljcyUyMG5ldHdvcmt8ZW58MXx8fHwxNzcyMzI0NDQwfDA&ixlib=rb-4.1.0&q=80&w=1080";
const imgWarehouseAutomation = "https://images.unsplash.com/photo-1761195696590-3490ea770aa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBhdXRvbWF0aW9uJTIwcm9ib3RpY3N8ZW58MXx8fHwxNzcyMjcxMzU1fDA&ixlib=rb-4.1.0&q=80&w=1080";
const imgDigitalTransformation = "https://images.unsplash.com/photo-1758542113402-b46079642dc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdHJhbnNmb3JtYXRpb24lMjBsb2dpc3RpY3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3MjMyNDQ0MXww&ixlib=rb-4.1.0&q=80&w=1080";
const imgSustainableTransport = "https://images.unsplash.com/photo-1766214788250-514a7b3c0216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRyYW5zcG9ydGF0aW9uJTIwZWxlY3RyaWMlMjBmbGVldHxlbnwxfHx8fDE3NzIzMjQ0NDF8MA&ixlib=rb-4.1.0&q=80&w=1080";
const imgSmartManufacturing = "https://images.unsplash.com/photo-1730705788367-dbd288c40ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwSW9UJTIwc2Vuc29ycyUyMG1hbnVmYWN0dXJpbmclMjBwbGFudHxlbnwxfHx8fDE3NzIzMjQ0NDl8MA&ixlib=rb-4.1.0&q=80&w=1080";
const imgLastMileDelivery = "https://images.unsplash.com/photo-1758441698991-ba4ee77bfa88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXN0JTIwbWlsZSUyMGRlbGl2ZXJ5JTIwdXJiYW4lMjBsb2dpc3RpY3N8ZW58MXx8fHwxNzcyMzI0NDQyfDA&ixlib=rb-4.1.0&q=80&w=1080";
const imgLogisticsTeams = "https://images.unsplash.com/photo-1758518727707-b023e285b709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwbGVhZGVyc2hpcCUyMGJ1c2luZXNzJTIwbWVldGluZ3xlbnwxfHx8fDE3NzIzMjQ0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES (Exported for external use)
// ═══════════════════════════════════════════════════════════════════════════

/** Single resource item — pass an array of these via `customResources` */
export interface ResourceItem {
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
  type?: ResourceContentType;
  isFeatured?: boolean;
  variant?: ResourceCardVariant;
}

/** Section-level color mode */
export type ResourcesSectionMode = 'light' | 'dark';

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    image: imgAiSupplyChain,
    category: "TECHNOLOGY",
    date: "Jan 15, 2024",
    title: "The Future of AI in Supply Chain Management",
    description: "Exploring how artificial intelligence is revolutionizing logistics operations and predictive analytics.",
    type: "article",
    isFeatured: true,
    variant: 'full-featured'
  },
  {
    image: imgDigitalTransformation,
    category: "STRATEGY",
    date: "Jan 8, 2024",
    title: "Digital Transformation in Logistics",
    description: "How leading companies are leveraging digital tools to gain competitive advantages.",
    variant: 'minimal'
  },
  {
    image: imgWarehouseAutomation,
    category: "AUTOMATION",
    date: "Jan 10, 2024",
    title: "Warehouse Automation: ROI and Implementation",
    description: "A comprehensive guide to implementing robotic systems and measuring their impact on operations.",
    variant: 'standard'
  },
  {
    image: imgSustainableTransport,
    category: "SUSTAINABILITY",
    date: "Jan 5, 2024",
    title: "Sustainable Transportation Solutions",
    description: "The shift to electric and hybrid fleets: challenges, opportunities, and environmental impact.",
    variant: 'category-featured'
  },
  {
    image: imgLastMileDelivery,
    category: "OPERATIONS",
    date: "Dec 30, 2023",
    title: "Optimizing Last-Mile Delivery",
    description: "Innovative approaches to solving the most expensive part of the delivery chain.",
    variant: 'clean'
  },
  {
    image: "https://images.unsplash.com/photo-1748609160056-7b95f30041f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY5Njc0MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "ANALYTICS",
    date: "Jan 18, 2024",
    title: "Data-Driven Decision Making in Supply Chain",
    description: "Leveraging real-time analytics and business intelligence for competitive advantage.",
    variant: 'featured-focus'
  },
  {
    image: imgSmartManufacturing,
    category: "MANUFACTURING",
    date: "Jan 3, 2024",
    title: "Industry 4.0 and Smart Manufacturing",
    description: "Integrating IoT and machine learning into production and distribution processes.",
    variant: 'latest'
  },
  {
    image: imgResilientSupplyChains,
    category: "INSIGHTS",
    date: "Jan 12, 2024",
    title: "Building Resilient Supply Chains in 2024",
    description: "Key strategies for creating agile and resilient logistics networks in an uncertain global economy.",
    variant: 'minimal'
  },
  {
    image: "https://images.unsplash.com/photo-1769283431582-efdb02caf94d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG9iYWwlMjB0cmFkZSUyMHNoaXBwaW5nJTIwY29udGFpbmVycyUyMHBvcnR8ZW58MXx8fHwxNzY5NzExMTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "GLOBAL TRADE",
    date: "Jan 6, 2024",
    title: "Navigating International Logistics Challenges",
    description: "Managing cross-border complexities and regulatory requirements in global supply chains.",
    variant: 'standard'
  },
  {
    image: "https://images.unsplash.com/photo-1768224656445-33d078c250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwdGVjaG5vbG9neSUyMG5ldHdvcmslMjBzZWN1cml0eXxlbnwxfHx8fDE3Njk3MTExMjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "SECURITY",
    date: "Jan 2, 2024",
    title: "Cybersecurity in Connected Supply Chains",
    description: "Protecting digital assets and ensuring data integrity in modern logistics networks.",
    variant: 'category-featured'
  },
  {
    image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neSUyMHN1cHBseSUyMGNoYWluJTIwdHJhbnNwYXJlbmN5fGVufDF8fHx8MTc2OTcxMTIzNHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "BLOCKCHAIN",
    date: "Dec 27, 2023",
    title: "Blockchain for Supply Chain Transparency",
    description: "Exploring distributed ledger technology for end-to-end traceability and trust.",
    variant: 'clean'
  },
  {
    image: imgLogisticsTeams,
    category: "LEADERSHIP",
    date: "Dec 28, 2023",
    title: "Building High-Performance Logistics Teams",
    description: "Best practices for recruiting, training, and retaining top talent in the logistics industry.",
    variant: 'standard'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// BACKGROUND LAYERS
// ═══════════════════════════════════════════════════════════════════════════

/** Dark mode background — multi-layer gradient mesh */
function DarkBackground() {
  return (
    <>
      {/* Base Dark Gradient */}
      <div 
        className="absolute inset-0"
        style={{ background: 'var(--composition-gradient-cinematic-base)' }}
      />
      {/* Top Left - Periwinkle Blob */}
      <div 
        className="absolute top-0 left-0 w-[600px] h-[600px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top left, rgba(76, 95, 215, 0.15) 0%, rgba(76, 95, 215, 0.08) 30%, transparent 60%)',
          filter: 'blur(80px)',
          mixBlendMode: 'screen'
        }}
      />
      {/* Top Right - Purple Blob */}
      <div 
        className="absolute top-0 right-0 w-[700px] h-[700px] opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0.1) 30%, transparent 60%)',
          filter: 'blur(90px)',
          mixBlendMode: 'screen'
        }}
      />
      {/* Bottom Left - Green Blob */}
      <div 
        className="absolute bottom-0 left-0 w-[550px] h-[550px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at bottom left, rgba(5, 150, 105, 0.14) 0%, rgba(5, 150, 105, 0.07) 30%, transparent 60%)',
          filter: 'blur(75px)',
          mixBlendMode: 'screen'
        }}
      />
      {/* Bottom Right - Warm Blob */}
      <div 
        className="absolute bottom-0 right-0 w-[650px] h-[650px] pointer-events-none"
        style={{
          opacity: 0.28,
          background: 'radial-gradient(circle at bottom right, rgba(194, 65, 12, 0.16) 0%, rgba(194, 65, 12, 0.08) 30%, transparent 60%)',
          filter: 'blur(85px)',
          mixBlendMode: 'screen'
        }}
      />
      {/* Center Depth */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 60%)',
          filter: 'blur(60px)'
        }}
      />
    </>
  );
}

/** Light mode background — warm editorial with subtle blobs */
function LightBackground() {
  return (
    <div 
      className="absolute inset-0"
      style={{
        background: 'var(--bg-composition-warm-editorial)',
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════════════════════════════════

function SectionHeader({ 
  mode, sectionLabel, title, description 
}: { 
  mode: ResourcesSectionMode; 
  sectionLabel: string;
  title: string; 
  description: string;
}) {
  const isDark = mode === 'dark';
  
  return (
    <div style={{ marginBottom: 'var(--section-header-mb)' }}>
      <span 
        className="font-normal uppercase tracking-[1.8px] block" 
        style={{ 
          fontSize: '15px', 
          lineHeight: '1.6',
          color: isDark ? 'var(--label-on-black)' : 'var(--label-on-white)',
          marginBottom: 'var(--pair-label-heading)',
        }}
      >
        {sectionLabel}
      </span>
      
      <h2 
        className="leading-[1.15] font-light tracking-tight" 
        style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: 'clamp(1.5rem, 4.5vw, var(--text-2xl))',
          color: isDark ? 'rgba(255, 255, 255, 1)' : 'var(--text-primary)',
          marginBottom: 'var(--pair-heading-description)',
        }}
      >
        {title}
      </h2>
      
      <p 
        className="leading-[1.7]" 
        style={{ 
          fontSize: 'var(--text-sm)',
          color: isDark ? 'rgba(255, 255, 255, 0.60)' : 'var(--text-secondary)',
          maxWidth: 'var(--text-measure)',
        }}
      >
        {description}
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ResourcesSectionProps {
  /**
   * Color mode — controls section background & card coloring.
   * @default 'dark'
   */
  mode?: ResourcesSectionMode;

  /** Card visual style: 'default' or 'bordered' @default 'default' */
  cardStyle?: ResourceCardStyle;

  /** Show variant switcher for card style toggling @default false */
  enableVariantSwitcher?: boolean;

  /** Section eyebrow label @default 'Related Resources' */
  sectionLabel?: string;

  /** Section heading @default 'Industry Insights & Resources' */
  title?: string;

  /** Section description paragraph */
  description?: string;

  /** CTA button label @default 'View All Resources' */
  ctaLabel?: string;

  /** CTA click handler (if provided, renders as button) */
  onCtaClick?: () => void;

  /** Custom resources array (replaces default demo data) */
  customResources?: ResourceItem[];

  /** Custom Masonry column breakpoints @default { 350: 1, 640: 2, 1024: 3 } */
  customColumns?: Record<number, number>;

  /** HTML id for the section element @default 'resources' */
  sectionId?: string;
}

export function ResourcesSection({
  mode = 'dark',
  cardStyle: initialCardStyle = 'default',
  enableVariantSwitcher = false,
  sectionLabel = 'Related Resources',
  title = 'Industry Insights & Resources',
  description = 'Expert perspectives and thought leadership on market intelligence, strategic consulting, and transformative business solutions',
  ctaLabel = 'View All Resources',
  onCtaClick,
  customResources,
  customColumns,
  sectionId = 'resources',
}: ResourcesSectionProps) {
  
  const [cardStyle, setCardStyle] = useState<ResourceCardStyle>(initialCardStyle);
  const isDark = mode === 'dark';

  const cardStyleVariants = [
    { id: 'default', label: 'Default', description: 'No border, transparent background' },
    { id: 'bordered', label: 'Bordered', description: 'Light border with frosted card' }
  ];

  const displayResources = customResources || DEFAULT_RESOURCES;
  const responsiveGutter = useResponsiveGutter();
  
  return (
    <section
      data-component="ResourcesSection"
      id={sectionId}
      className="relative overflow-hidden"
      style={{
        paddingTop: 'var(--section-py-standard)', 
        paddingBottom: 'var(--section-py-standard)' 
      }}
    >
      {/* ── Background Layer ── */}
      {isDark ? <DarkBackground /> : <LightBackground />}
      
      {/* ── Content Layer ── */}
      <Container className="relative z-10">

        {/* Section Header */}
        <SectionHeader 
          mode={mode}
          sectionLabel={sectionLabel}
          title={title}
          description={description}
        />

        {/* Masonry Grid */}
        <div style={{ marginTop: 0, marginLeft: `-${responsiveGutter / 2}px`, marginRight: `-${responsiveGutter / 2}px`, marginBottom: '80px' }}>
          <ResponsiveMasonry
            columnsCountBreakPoints={customColumns || { 350: 1, 640: 2, 1024: 3 }}
          >
            <Masonry gutter="0px">
              {displayResources.map((resource, index) => (
                <div 
                  key={`${resource.title}-${index}`} 
                  style={{ 
                    padding: `0 ${responsiveGutter / 2}px ${responsiveGutter}px ${responsiveGutter / 2}px` 
                  }}
                >
                  <ResourceCard
                    image={resource.image}
                    category={resource.category}
                    date={resource.date}
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    isFeatured={resource.isFeatured}
                    variant={resource.variant || 'standard'}
                    cardStyle={cardStyle}
                    mode={mode}
                  />
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="md"
            animatedArrow
            onClick={onCtaClick}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </Button>
        </div>
      </Container>

      {/* Variant Switcher */}
      {enableVariantSwitcher && (
        <SubtleVariantSwitcher
          sectionName="Resources"
          currentVariant={cardStyle}
          variants={cardStyleVariants}
          onVariantChange={(variantId) => setCardStyle(variantId as ResourceCardStyle)}
          position="top-right"
          theme={isDark ? 'dark' : 'light'}
        />
      )}
    </section>
  );
}