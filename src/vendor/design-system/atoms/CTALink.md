# CTALink

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/CTALink.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — VERIFIED · no rewrite · adds variant='brand')
**Status:** ready

## WHAT
Middle-tier link in the 3-tier hierarchy: Button → CTALink → InlineLink. Text + animated arrow with unified hover zone. Available as `<a>` (with href) or `<button>` (with onClick).

```
[ label text ] [ AnimatedArrow ↗ ]
               ^ unified hover zone changes both simultaneously
```

## WHY
Forms, page redirects, and high-priority lightweight actions need a text+arrow affordance that's lighter than Button (no shimmer background) but stronger than InlineLink (arrow + hover transition). The unified hover zone (text + arrow together) avoids the jarring effect of text-only hover.

## WHEN
- Exploratory navigation: "Learn more →", "View all reports →", "Explore methodology →"
- Section CTAs that don't need the visual weight of a full Button
- List footer CTAs in card grids ("View collection →")

## WHEN NOT
- Paragraph cross-references → `InlineLink` (simpler, in-text)
- Primary conversion CTAs → `Button variant="brand"` (needs shimmer + full button affordance)
- Low-priority nav items → plain `<a>` tag

## WHERE
Report card footer, section headers, Related Reports "View All", FAQ contact row.

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | required | Link label text |
| `href` | `string` | — | Renders as `<a>` when provided |
| `onClick` | `Function` | — | Renders as `<button>` when no href |
| `variant` | `'default'|'brand'` | `'default'` | `brand` = always brand-red text + arrow |
| `size` | `'sm'|'md'|'lg'` | `'md'` | Font size: 16/20/25px |
| `onDark` | `boolean` | `false` | White text on dark surfaces |
| `className` | `string` | — | Additional classes |

### Tokens used
| Token | Why |
|---|---|
| `--typography-size-sm` | sm font (1rem = 16px) |
| `--typography-size-base` | md font (1.25rem = 20px) |
| `--typography-size-lg` | lg font (1.563rem = 25px) |
| `--brand-red` | hover text + arrow color |
| `--color-brand-red` | focus ring |

### A11y
Semantic `<a>` or `<button>` depending on href presence. Keyboard activatable.
Focus-visible: 2px brand-red ring. `rounded-sm` provides ring radius.

### Motion
`useShimmer` hook drives `isHovering` state. 300ms transition on text color.
AnimatedArrow gets `isHovered` from same state — synchronized.

### Responsive
No responsive size switching — size is explicit via prop.

### Code example
```tsx
// As link
<CTALink href="/reports/healthcare">Explore Healthcare reports</CTALink>

// As button (callback)
<CTALink onClick={handleViewAll} size="sm">View all</CTALink>

// On dark surface
<CTALink href="/methodology" onDark>Read the methodology</CTALink>

// Always brand-red
<CTALink href="/contact" variant="brand">Get in touch</CTALink>
```
