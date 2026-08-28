# MultiCardGridTemplate · sidecar

## WHAT
2/3/2 staggered segmentation card grid shell. Accepts a cards array, splits into rows automatically, renders SegmentationCard per item. Optional footer takeaways gradient card.

## WHY
The 2/3/2 stagger grid (CANON §2.8) is the canonical Segmentation section layout. Centralising the row-split logic prevents each consumer re-implementing `slice()` arithmetic and responsive class sets.

## WHEN
- Report PDP Segment Intelligence section (section 13).
- Any section with 5–7 categorised SegmentationCards in a staggered grid.

## WHEN NOT
- Fewer than 5 or more than 7 cards → uniform 3-col grid (no stagger).
- Cards with heterogeneous types → custom grid layout.

## WHERE
`core-v2/src/templates/MultiCardGridTemplate.tsx`

## HOW — API

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `id` | `string` | — | yes | Section anchor id |
| `background` | `'white' \| 'warm'` | `'white'` | no | Bg alternation |
| `label` | `string` | — | yes | Eyebrow label |
| `heading` | `string` | — | yes | h2 heading |
| `lede` | `string` | — | no | Optional lede |
| `cards` | `SegmentationCardProps[]` | — | yes | Array of card data (7 for canonical 2/3/2) |
| `takeaways` | `TakeawayItem[]` | — | no | Optional footer takeaway items |
| `className` | `string` | — | no | Extra className |

### Row split logic
- 7 items → [2, 3, 2]
- 6 items → [3, 3]
- 5 items → [2, 3]
- other → single uniform grid

### TakeawayItem shape
```ts
{ label: string; value: string; }
```

## Composition map

```
<SectionWrapper id background spacing="lg">
  <div mb-10 md:mb-12>
    <LabelHeadingPair label heading lede? />
  </div>
  <div space-y-6>                               // STAGGERED ROWS
    {rows.map row → <div grid gap-6 cols-N>
      {row.map → <SegmentationCard />}
    </div>}
  </div>
  <div? gradient-card mt-6>                     // TAKEAWAYS (optional)
    {takeaways.map → label + value}
  </div>
</SectionWrapper>
```

## Token usage

| Token | Where |
|---|---|
| `--scroll-margin-section` | scroll-margin-top |
| `--bg-card-takeaways` | takeaways footer card bg |
| `--radius-sm` | takeaways card border-radius |
| `--tracking-label-x-wide` | "Key Takeaways" eyebrow tracking |
| `--brand-red` | takeaways bullet dot + eyebrow color |

## A11y
- `aria-label="Key takeaways"` on takeaways div.
- SegmentationCard renders `<ul aria-label="${title} breakdown">` per card.
- Bullet dots `aria-hidden="true"`.
- `scroll-margin-top: 72px` prevents anchor hiding.

## Responsive
- Row grids collapse: lg:2-col → 1-col, lg:3-col → md:2-col → 1-col.
- Takeaways: md:2-col → 1-col.
- `space-y-6` between rows on all viewports.

## Code example

```tsx
import { MultiCardGridTemplate } from '@kenresearch/design-system/templates';
import { Truck, Thermometer, MapPin, Leaf, Building2, Users, ShieldCheck } from 'lucide-react';

<MultiCardGridTemplate
  id="segment-intelligence"
  background="white"
  label="CHAPTER 13 · SEGMENT INTELLIGENCE"
  heading="Cold Chain Market Segments"
  cards={[
    { icon: <Truck />, title: 'Transport', items: [...], description: 'Reefer trucks & rail' },
    { icon: <Thermometer />, title: 'Cold Storage', items: [...] },
    { icon: <MapPin />, title: 'Regional Hubs', items: [...] },
    { icon: <Leaf />, title: 'Produce', items: [...] },
    { icon: <Building2 />, title: 'Pharma', items: [...] },
    { icon: <Users />, title: 'End Users', items: [...] },
    { icon: <ShieldCheck />, title: 'Compliance', items: [...] },
  ]}
  takeaways={[
    { label: 'Fastest growing segment', value: 'Pharmaceutical cold chain +14.2% CAGR' },
    { label: 'Largest by value', value: 'Perishable produce — USD 6.1Bn (2023)' },
  ]}
/>
```
