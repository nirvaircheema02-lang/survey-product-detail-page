/**
 * ResourceCard Component
 * 
 * WHY: The Resources section needs cards with varying visual treatments
 * to create Masonry-style visual interest. Different content types
 * (featured articles, quick reads, category highlights) need distinct
 * visual emphasis — a single card style creates monotony.
 * 
 * WHAT: A versatile resource card with 7 layout variants, 2 card styles
 * (default/bordered), and 2 color modes (light/dark). Each variant
 * controls image size, text emphasis, and metadata visibility.
 * 
 * WHEN:
 * - Use in ResourcesSection Masonry grid
 * - Use for blog listings, article grids, case study collections
 * - Mix variants within a grid for visual rhythm
 * 
 * WHEN NOT:
 * - Don't use for product cards (use Card component instead)
 * - Don't use all cards as 'full-featured' — creates visual overload
 * - Don't mix more than 3-4 variant types in one grid
 * 
 * VARIANTS:
 * 1. 'standard'         — Default balanced card (image + meta + title + desc)
 * 2. 'full-featured'    — Large image, all metadata, type badge, featured indicator
 * 3. 'minimal'          — Compact: small image, title + category only
 * 4. 'category-featured'— Category emphasis with colored accent bar
 * 5. 'clean'            — No image, text-only with subtle background
 * 6. 'featured-focus'   — Oversized image with overlaid gradient text
 * 7. 'latest'           — Time-stamped card with "NEW" indicator
 * 
 * CARD STYLES:
 * - 'default'  — No border, transparent background (blends into section)
 * - 'bordered' — Light border with frosted glass background
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ResourceCardVariant =
  | 'standard'
  | 'full-featured'
  | 'minimal'
  | 'category-featured'
  | 'clean'
  | 'featured-focus'
  | 'latest';

export type ResourceCardStyle = 'default' | 'bordered';
export type ResourceCardMode = 'light' | 'dark';
export type ResourceContentType = 'article' | 'report' | 'whitepaper' | 'video' | 'podcast';

interface ResourceCardProps {
  image: string;
  category: string;
  date: string;
  title: string;
  description: string;
  type?: ResourceContentType;
  isFeatured?: boolean;
  variant?: ResourceCardVariant;
  cardStyle?: ResourceCardStyle;
  mode?: ResourceCardMode;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function TypeBadge({ type, mode }: { type: ResourceContentType; mode: ResourceCardMode }) {
  const isDark = mode === 'dark';
  const labels: Record<ResourceContentType, string> = {
    article: 'Article',
    report: 'Report',
    whitepaper: 'Whitepaper',
    video: 'Video',
    podcast: 'Podcast',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider
        ${isDark
          ? 'bg-white/10 text-white/70 border border-white/10'
          : 'bg-black/5 text-black/50 border border-black/10'
        }
      `}
      style={{ fontSize: 'var(--text-card-micro)', letterSpacing: '1px' }}
    >
      {labels[type]}
    </span>
  );
}

function FeaturedIndicator({ mode }: { mode: ResourceCardMode }) {
  const isDark = mode === 'dark';
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
        ${isDark
          ? 'bg-[var(--brand-red)] text-white'
          : 'bg-[var(--brand-red)] text-white'
        }
      `}
      style={{ fontSize: 'var(--text-card-micro)' }}
    >
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Featured
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function ResourceCard({
  image,
  category,
  date,
  title,
  description,
  type,
  isFeatured = false,
  variant = 'standard',
  cardStyle = 'default',
  mode = 'dark',
}: ResourceCardProps) {
  const isDark = mode === 'dark';

  // Card wrapper styling based on cardStyle
  const cardWrapperClass = cardStyle === 'bordered'
    ? isDark
      ? 'border border-white/10 bg-white/[0.03] backdrop-blur-sm rounded-[5px]'
      : 'border border-black/8 bg-white/80 backdrop-blur-sm rounded-[5px]'
    : '';

  const textPrimary = isDark ? 'text-white' : 'text-black';
  const textSecondary = isDark ? 'text-white/60' : 'text-black/60';
  const textMuted = isDark ? 'text-white/40' : 'text-black/40';

  // ── VARIANT: full-featured ──
  if (variant === 'full-featured') {
    return (
      <a data-component="ResourceCard" href="#" className={`group block cursor-pointer ${cardWrapperClass} overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2`}>
        <article>
          <div className="relative overflow-hidden rounded-t-[5px] aspect-[16/10]">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute top-3 left-3 flex gap-2">
              {type && <TypeBadge type={type} mode="dark" />}
              {isFeatured && <FeaturedIndicator mode="dark" />}
            </div>
          </div>
          <div className={`p-4 ${cardStyle === 'bordered' ? '' : 'pt-4'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-medium uppercase tracking-[1.5px] ${textMuted}`} style={{ fontSize: 'var(--text-xs)' }}>{category}</span>
              <span className={textMuted}>-</span>
              <span className={textMuted} style={{ fontSize: 'var(--text-xs)' }}>{date}</span>
            </div>
            <h3 className={`font-normal leading-[1.35] tracking-tight mb-2 group-hover:opacity-80 transition-opacity ${textPrimary}`} style={{ fontSize: 'var(--text-sm)' }}>
              {title}
            </h3>
            <p className={`leading-[1.6] ${textSecondary}`} style={{ fontSize: 'var(--text-xs)' }}>
              {description}
            </p>
          </div>
        </article>
      </a>
    );
  }

  // ── VARIANT: minimal ──
  if (variant === 'minimal') {
    return (
      <a data-component="ResourceCard" href="#" className={`group block cursor-pointer ${cardWrapperClass} overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2`}>
        <article className={cardStyle === 'bordered' ? 'p-3' : ''}>
          <div className="relative overflow-hidden rounded-[3px] aspect-[3/2] mb-3">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <span className={`font-medium uppercase tracking-[1.5px] block mb-1.5 ${textMuted}`} style={{ fontSize: 'var(--text-card-micro)' }}>{category}</span>
          <h3 className={`font-normal leading-[1.35] tracking-tight group-hover:opacity-80 transition-opacity ${textPrimary}`} style={{ fontSize: 'var(--text-sm)' }}>
            {title}
          </h3>
        </article>
      </a>
    );
  }

  // ── VARIANT: category-featured ──
  if (variant === 'category-featured') {
    return (
      <a data-component="ResourceCard" href="#" className={`group block cursor-pointer ${cardWrapperClass} overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2`}>
        <article>
          <div className="relative overflow-hidden rounded-t-[5px] aspect-[4/3]">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
          <div className={`${cardStyle === 'bordered' ? 'p-4' : 'pt-4'}`}>
            <div className={`w-8 h-0.5 mb-3 ${isDark ? 'bg-white/30' : 'bg-black/20'}`} />
            <span className={`font-medium uppercase tracking-[2px] block mb-2 ${textMuted}`} style={{ fontSize: 'var(--text-card-micro)' }}>{category}</span>
            <h3 className={`font-normal leading-[1.35] tracking-tight mb-2 group-hover:opacity-80 transition-opacity ${textPrimary}`} style={{ fontSize: 'var(--text-sm)' }}>
              {title}
            </h3>
            <p className={`leading-[1.6] ${textSecondary}`} style={{ fontSize: 'var(--text-xs)' }}>
              {description}
            </p>
          </div>
        </article>
      </a>
    );
  }

  // ── VARIANT: clean (no image) ──
  if (variant === 'clean') {
    return (
      <a
        data-component="ResourceCard"
        href="#"
        className={`group block cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 ${
          cardStyle === 'bordered'
            ? cardWrapperClass
            : isDark
              ? 'bg-white/[0.03] rounded-[5px]'
              : 'bg-black/[0.02] rounded-[5px]'
        }`}
      >
        <article className="p-5">
          <span className={`font-medium uppercase tracking-[1.5px] block mb-2 ${textMuted}`} style={{ fontSize: 'var(--text-card-micro)' }}>{category}</span>
          <h3 className={`font-normal leading-[1.35] tracking-tight mb-3 group-hover:opacity-80 transition-opacity ${textPrimary}`} style={{ fontSize: 'var(--text-sm)' }}>
            {title}
          </h3>
          <p className={`leading-[1.6] ${textSecondary}`} style={{ fontSize: 'var(--text-xs)' }}>
            {description}
          </p>
          <div className={`mt-4 text-xs font-medium ${textMuted}`}>{date}</div>
        </article>
      </a>
    );
  }

  // ── VARIANT: featured-focus ──
  if (variant === 'featured-focus') {
    return (
      <a data-component="ResourceCard" href="#" className={`group block cursor-pointer ${cardWrapperClass} overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2`}>
        <article className="relative">
          <div className="relative overflow-hidden rounded-[5px] aspect-[4/5]">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="font-medium uppercase tracking-[1.5px] text-white/50 block mb-2" style={{ fontSize: 'var(--text-card-micro)' }}>{category}</span>
              <h3 className="font-normal text-white leading-[1.35] tracking-tight group-hover:opacity-90 transition-opacity" style={{ fontSize: 'var(--text-sm)' }}>
                {title}
              </h3>
            </div>
          </div>
        </article>
      </a>
    );
  }

  // ── VARIANT: latest ──
  if (variant === 'latest') {
    return (
      <a data-component="ResourceCard" href="#" className={`group block cursor-pointer ${cardWrapperClass} overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2`}>
        <article>
          <div className="relative overflow-hidden rounded-t-[5px] aspect-[16/9]">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-black text-xs font-medium" style={{ fontSize: 'var(--text-card-micro)' }}>
                NEW
              </span>
            </div>
          </div>
          <div className={`${cardStyle === 'bordered' ? 'p-4' : 'pt-4'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-medium uppercase tracking-[1.5px] ${textMuted}`} style={{ fontSize: 'var(--text-card-micro)' }}>{category}</span>
              <span className={textMuted} style={{ fontSize: 'var(--text-card-micro)' }}>{date}</span>
            </div>
            <h3 className={`font-normal leading-[1.35] tracking-tight mb-2 group-hover:opacity-80 transition-opacity ${textPrimary}`} style={{ fontSize: 'var(--text-sm)' }}>
              {title}
            </h3>
            <p className={`leading-[1.6] ${textSecondary}`} style={{ fontSize: 'var(--text-xs)' }}>
              {description}
            </p>
          </div>
        </article>
      </a>
    );
  }

  // ── VARIANT: standard (default) ──
  return (
    <a data-component="ResourceCard" href="#" className={`group block cursor-pointer ${cardWrapperClass} overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2`}>
      <article>
        <div className="relative overflow-hidden rounded-[3px] mb-4 aspect-[4/3]">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <div className={cardStyle === 'bordered' ? 'px-4 pb-4' : ''}>
          <div className="mb-2">
            <span className={`font-medium uppercase tracking-[1.5px] block mb-1 ${textMuted}`} style={{ fontSize: 'var(--text-xs)' }}>{category}</span>
            <span className={textMuted} style={{ fontSize: 'var(--text-xs)' }}>{date}</span>
          </div>
          <h3 className={`font-normal leading-[1.35] tracking-tight mb-2 group-hover:opacity-80 transition-opacity ${textPrimary}`} style={{ fontSize: 'var(--text-sm)' }}>
            {title}
          </h3>
          <p className={`leading-[1.6] ${textSecondary}`} style={{ fontSize: 'var(--text-xs)' }}>
            {description}
          </p>
        </div>
      </article>
    </a>
  );
}