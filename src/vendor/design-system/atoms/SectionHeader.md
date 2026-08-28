# SectionHeader

**Tier:** atom
**Canonical source:** projects/V0.2 -for design system/src/app/components/SectionHeader.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
4-prop composite: brand-red chapter eyebrow + serif h2 + optional lede.
```
[brand-red uppercase] CHAPTER 2: MARKET OVERVIEW
[serif h2]           The Cold Chain Opportunity in Australia
[lede paragraph]     The Australian cold chain market reached AUD 4.5B…
```

## WHY
Every chapter section opens with eyebrow → h2 → description. Without this atom, consumers import 3 separate atoms and drift from canonical spacing. Single atom locks the sequence, margins, and token usage.

## WHEN
- Top of any chapter section (Scope · Methodology · Drivers · FAQ · CTA)
- When you need eyebrow + heading + optional body in the standard rhythm

## WHEN NOT
- Eyebrow only → use OverheadText
- Heading only → use SectionHeading
- Need full section with content → compose inside SectionWrapper organism

## WHERE
- Report PDP chapter sections
- Case-study section tops
- ChapterSectionTemplate Tier 4

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `chapter` | `string` | — | Chapter prefix (e.g. "Chapter 2"). Combined with title as "Chapter 2: Market Overview" |
| `title` | `string` | **required** | Section label in brand-red uppercase |
| `heading` | `ReactNode` | — | Rich JSX h2. Precedence over `subtitle` |
| `subtitle` | `string` | — | Plain-text h2 with `\n` newline support |
| `description` | `string` | — | Lede paragraph in --text-sm / --black-500 |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used

| Token | Why |
|---|---|
| `--brand-red` | Chapter eyebrow colour — brand canon |
| `--text-xs` | Eyebrow font size (12.8px) — refactored from V0.2 text-sm (13px) |
| `--font-weight-bold` | Eyebrow weight 700 |
| `--tracking-label-wide` | Eyebrow letter-spacing 0.15em |
| `--text-30` | h2 font size (30px) — refactored from V0.2 text-3xl (30px) |
| `--leading-snug` | h2 line-height 1.3 (core-v2 canonical; V0.2 used leading-tight=1.25) |
| `--tracking-display-tight` | h2 letter-spacing -0.02em |
| `--black-900` | h2 colour |
| `--space-4` | Description top margin |
| `--text-sm` | Description font size 16px |
| `--leading-relaxed` | Description line-height 1.6 |
| `--black-500` | Description muted colour |
| `--section-header-mb` | Root margin-bottom 2.5rem |

### A11y
- Chapter eyebrow is a `<span>` (decorative label, not a heading level)
- h2 renders semantic heading element — correct for section structure
- No interactive elements — no keyboard/focus handling needed

### Motion
- Static — no animation on this atom
- Consumer (StatPairRow organism) may wrap with Framer `motion.div` for entrance

### Responsive
- `max-w-3xl` on description caps at 768px for comfortable line length
- h2 wraps naturally — no truncation

### Code example
```tsx
<SectionHeader
  chapter="Chapter 2"
  title="Market Overview"
  heading="The Cold Chain Opportunity in Australia"
  description="The Australian cold chain market reached AUD 4.5B in 2024, driven by pharmaceutical demand and e-grocery growth."
/>
```
