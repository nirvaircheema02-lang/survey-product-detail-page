# Button

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/Button.tsx:36-315
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a)
**Status:** ready

## WHAT
Primary interactive CTA atom. 4 variants (primary / brand / secondary / ghost) × 5 sizes (xs / sm / md / lg / xl). Always-on shimmer sweep (700ms). Optional AnimatedArrow via `animatedArrow` prop. Material ripple effect. Loading spinner state. Icon left / right / iconOnly modes.

```
[  shimmer layer  ]
[ left-icon ] [ label ] [ right-icon / AnimatedArrow ]
[  ripple layer  ]
[ focus ring — 2px brand-red ]
```

## WHY
Conversion CTAs need brand-locked shimmer + consistent affordance across every surface. Inline `<button>` drifts — no shimmer, no ripple, no reduced-motion, no size tokens. Centralizing here closes drift.

## WHEN
- Primary actions: form submit, hero CTAs, conversion moments
- `brand` variant: max 1-2 per screen (high prominence)
- `md` default; `sm` for nav; `xs` for card footer CTAs only (Cat 5.2)
- `animatedArrow` for urgency / form-redirect

## WHEN NOT
- Inline text links → `InlineLink`
- Exploratory nav ("View all →") → `CTALink`
- Decorative red — never (Cat 2.1: brand-red = CTAs only)

## WHERE
Organisms: ResourcesSection, NewsletterSignup, CardListing, HeroSection CTA row.
Molecules: ReportCard footer, SurveyCard CTA, AnalystPickCardB CTA.

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary'|'secondary'|'ghost'|'brand'` | `'primary'` | Visual style |
| `size` | `'xs'|'sm'|'md'|'lg'|'xl'` | `'md'` | Height + padding driven by tokens |
| `background` | `'light'|'dark'` | `'light'` | Surface context for secondary/ghost |
| `fullWidth` | `boolean` | `false` | Stretches to container width |
| `icon` | `ReactNode` | — | Lucide icon passed to left/right slot |
| `iconPosition` | `'left'|'right'` | `'right'` | Icon slot placement |
| `iconOnly` | `boolean` | `false` | Hides label, shows icon centered |
| `loading` | `boolean` | `false` | Replaces icon with Loader2 spinner |
| `disabled` | `boolean` | `false` | opacity-50, blocks click |
| `ripple` | `boolean` | `true` | Material ripple on click |
| `shimmerDuration` | `number` | `700` | Shimmer sweep duration in ms |
| `animatedArrow` | `boolean` | `false` | Shows AnimatedArrow via `showArrow` prop |
| `ariaLabel` | `string` | — | Required for icon-only buttons |
| `type` | `'button'|'submit'|'reset'` | `'button'` | Native button type |

### Tokens used
| Token | Why |
|---|---|
| `--button-height-sm/md/lg/xl` | Canonical heights (40/48/56/64px) |
| `--button-px-sm/md/lg/xl` | Horizontal padding per size |
| `--button-min-width-sm/md/lg/xl` | Minimum touch target width |
| `--button-font-sm/md/lg` | Font size per size |
| `--text-xs` | Font size for xs (12.8px) |
| `--radius-element` | 5px corner radius |
| `--color-brand-red` | Focus ring + brand variant background |
| `--composition-gradient-brand-red-shimmer` | brand shimmer gradient |
| `--composition-gradient-brand-dark-shimmer` | primary shimmer gradient |

### A11y
- Semantic `<button>` — keyboard activatable (Enter/Space)
- `aria-label` required for `iconOnly`; defaults to string children for screen readers
- Focus-visible: 2px brand-red ring with 2px offset
- `disabled` attribute blocks all interaction + AT announces state
- Loading state: spinner is `aria-hidden`; parent must communicate loading via `aria-busy` if needed

### Motion
- Shimmer: always-on 700ms sweep slide on hover (200% width div, translate-x -50% on hover)
- Ripple: Material circle expand 600ms ease-out, removed after animation
- Reduced-motion: `motion-reduce:transition-none` on shimmer layer; ripple size still animates (color only, not motion)

### Responsive
- Mobile: `w-full` (stretches to container) unless `fullWidth=false` AND `iconOnly`
- sm+: `w-auto` (natural width)

### Code example
```tsx
// Primary CTA
<Button variant="primary" size="md" animatedArrow>Get the Report</Button>

// Brand CTA (max 1-2 per screen)
<Button variant="brand" size="lg">Request a Demo</Button>

// Ghost on dark background
<Button variant="ghost" background="dark" size="sm">Learn More</Button>

// Icon-only (accessible)
<Button variant="ghost" iconOnly ariaLabel="Search" icon={<Search />} size="md" />

// Loading state
<Button variant="primary" loading>Submitting...</Button>
```
