# BodyText

**Tier:** atom
**Canonical source:** projects/V0.2 -for design system/src/app/components/ui/body-text.tsx
**Ported:** 2026-05-19 by aura-builder (Batch 3.1b)
**Status:** ready

## WHAT
Standardised paragraph wrapper. Two spacing variants for correct visual rhythm after headings.
```
[spacing=first — mt-6]  First paragraph immediately after h2
[spacing=follow — mt-4] Subsequent paragraphs in the same section
```

## WHY
V0.2 chapters repeat the same paragraph typography 20+ times. Centralising prevents:
- Font-size drift (V0.2 used `text-base` for 14px; core-v2 `--text-sm` is 16px — refactored)
- Colour drift (`text-black-500` → `var(--black-500)`)
- Spacing drift (mt-6 vs mt-4 inconsistencies)

## WHEN
Running prose paragraphs inside chapter sections: description · lede · supporting copy.

## WHEN NOT
- Headings, labels, badges, stat values → wrong atom
- Pull quotes / blockquotes → use dedicated molecule
- Navigation items → wrong atom

## WHERE
- SectionHeader `description` prop (uses same tokens internally)
- ChapterSectionTemplate body
- Case-study paragraphs

## HOW

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | **required** | Paragraph content |
| `spacing` | `'first' \| 'follow'` | `'follow'` | `'first'` = mt-6 after heading; `'follow'` = mt-4 subsequent |
| `className` | `string` | `''` | Tailwind overrides |

### Tokens used

| Token | Why |
|---|---|
| `--space-6` | `spacing="first"` top margin (24px) |
| `--space-4` | `spacing="follow"` top margin (16px) |
| `--text-sm` | Body font size 16px (refactored from V0.2 `text-base` 14px) |
| `--leading-relaxed` | Line-height 1.6 for comfortable reading |
| `--black-500` | Muted body text colour |

### A11y
Plain `<p>` element — correct semantic element for paragraphs.

### Code example
```tsx
<BodyText spacing="first">
  The Qatar Fresh Herbs Market is valued at $150 million…
</BodyText>
<BodyText>
  Doha is the dominant city in the market, accounting for 65% of total demand.
</BodyText>
<BodyText className="max-w-prose">Narrow prose column variant.</BodyText>
```
