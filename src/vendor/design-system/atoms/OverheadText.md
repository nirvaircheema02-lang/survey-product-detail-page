# OverheadText

**Tier:** atom
**Canonical source:** projects/V0.2 -for design system/src/app/components/ui/overhead-text.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
Brand-red uppercase eyebrow span. `inline-flex` with optional gap-2 for leading icon/sibling.
```
CHAPTER 1 - INDUSTRY ANALYSIS
```

## WHY
Recurring across all V0.2 chapter sections. Standalone atom allows molecules to compose it without re-implementing `brand-red + uppercase + tracking-widest`. Token: `--tracking-label-wide` 0.15em (V0.2 used `tracking-widest` which maps here).

## WHEN
- First element in a section header block, before the h2
- Direct use when SectionHeader composite is too heavy

## WHEN NOT
- Use SectionHeader when you need eyebrow + h2 + lede as a unit
- Use SectionLabel for non-chapter section labels (it has light/dark variant logic)

## WHERE
- Chapter section tops
- SectionHeader atom (composes OverheadText internally via inline span)
- ChapterSectionTemplate

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | **required** | Text or inline content |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used

| Token | Why |
|---|---|
| `--brand-red` | Brand-canonical eyebrow colour |
| `--text-xs` | 12.8px — refactored from V0.2 `text-sm` (13px) |
| `--font-weight-bold` | 700 — matches V0.2 `font-bold` |
| `--tracking-label-wide` | 0.15em — canonical for chapter eyebrow labels |

### A11y
Inline `<span>` — purely presentational. Surrounding h2 carries heading semantics.

### Code example
```tsx
<OverheadText>CHAPTER 1 - INDUSTRY ANALYSIS</OverheadText>
<OverheadText className="mb-2">KEY METRICS</OverheadText>
```
