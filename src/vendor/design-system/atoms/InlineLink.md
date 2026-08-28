# InlineLink

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/InlineLink.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — VERIFIED · deliberate improvement)
**Status:** ready

## WHAT
Lowest tier in the 3-tier link hierarchy: Button → CTALink → InlineLink. Inline `<a>` with always-visible 1px brand-red underline at 2px offset. Hover: text → brand-red + warm-100 bg wash.

```
Read the [full methodology](link) for details.
              ~~~~~~~~~~~~~~  ← brand-red underline always visible
```

## WHY
Paragraph cross-references need a "link" signal without hover dependency (a11y: color-blind users can't rely on hover color change alone). Always-visible underline satisfies WCAG 1.4.1 (use of color). Hover wash adds discoverability without breaking reading rhythm.

**Deliberate improvement over canonical:** Canonical source used conditional border-bottom (transparent at rest, brand-red on hover). Core-v2 uses always-visible underline — better a11y per WCAG 1.4.1.

## WHEN
- Paragraph cross-references: "see our [methodology](/methodology)"
- Doc / footnote links within long-form text
- Bio bylines, author profile links
- Subtle in-line nav from prose

## WHEN NOT
- Primary CTAs → `Button` (button affordance + shimmer)
- Standalone nav links → `CTALink` (text + arrow)
- Urgency moments → `Button variant="brand"`
- Filter / toggle → `FilterChip`

## WHERE
Long-form report sections, FAQ answer text, article body, methodology descriptions.

## HOW

### API
Extends `AnchorHTMLAttributes<HTMLAnchorElement>` — all anchor props pass through (href, target, rel, etc).

| Prop | Type | Notes |
|---|---|---|
| `children` | `ReactNode` | Link text |
| `href` | `string` | Required — semantic `<a>` needs destination |
| `className` | `string` | Additional classes |
| `...rest` | anchor attrs | target, rel, etc. all pass through |

### Tokens used
| Token | Why |
|---|---|
| `--surface-text` | Default text color (adapts to surface variant) |
| `--color-brand-red` | Underline color + hover text color + focus ring |
| `--color-ramp-warm-100` | Hover background wash |

### A11y
Semantic `<a>` — keyboard navigable, right-click "open in new tab".
Always-visible underline (does NOT rely on hover for link affordance — WCAG 1.4.1).
Focus-visible: 2px brand-red ring at 2px offset.

### Motion
200ms transition on all properties. Color change is not motion — no reduced-motion handling needed.

### Responsive
Inline element — inherits parent font-size. No responsive behavior.

### Code example
```tsx
<p>
  Read more in our{' '}
  <InlineLink href="/methodology">methodology guide</InlineLink>
  {' '}or{' '}
  <InlineLink href="/contact" target="_blank" rel="noopener">contact us</InlineLink>.
</p>
```
