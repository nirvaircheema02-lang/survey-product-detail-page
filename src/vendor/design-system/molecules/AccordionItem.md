# AccordionItem

**Tier:** molecule
**Canonical source:** projects/V0_lite_report-legacy/src/app/components/FAQSection.tsx:81-127
**Ported:** 2026-05-19 by aura-builder · Batch 3.1c
**Status:** ready

## WHAT
Single bordered accordion card: question trigger button + animated answer panel.
Per-item card chrome: `border border-black/10 rounded-[--radius-sm]`. Hover darkens border.
ChevronDown rotates 180° on open. Answer reveals via Framer height animation.

```
┌──────────────────────────────────────────────────┐
│ What format do I receive the report in?    [v]   │
│                                                  │  ← closed
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ What format do I receive the report in?    [^]   │
│                                                  │
│ You receive PDF, Excel, and PowerPoint.          │  ← open
│ All formats are fully editable.                  │
└──────────────────────────────────────────────────┘
```

## WHY
V0_lite FAQ uses individually-bordered cards (NOT a connected strip). Each question is
a discrete scannable unit — Gestalt proximity: gap-4 between cards = separate items.
Framer height animation avoids CSS clip-path shimmy on variable-length answers.

## WHEN
FAQ sections, help pages, expand-collapse report details.
Compose multiple in `<div className="space-y-4">`.

## WHEN NOT
- Navigation menus → DropdownPanel.
- Filter categories → FilterAccordion molecule.
- No nested AccordionItems.

## WHERE
FAQSection organism · HelpCenter page · any question-answer list.

## HOW

### API
| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique ID for ARIA wiring |
| `question` | `string` | — | Trigger text |
| `answer` | `ReactNode` | — | Answer content (string or rich) |
| `isOpen` | `boolean` | `undefined` | Controlled open state |
| `onToggle` | `() => void` | — | Toggle callback (controlled mode) |
| `defaultOpen` | `boolean` | `false` | Default for uncontrolled mode |
| `className` | `string` | — | Root card className |

### Tokens used
- `--radius-sm` (10px) border radius
- `--text-sm` (16px) question + answer font
- `--black-900` question color
- `--black-500` answer color
- `--black-200` divider color

### A11y
- Trigger: `<button>` with `aria-expanded` + `aria-controls`
- Panel: `role="region"` + `aria-labelledby`
- Focus ring on trigger
- ChevronDown: `aria-hidden`

### Motion
- Framer AnimatePresence: height 0→auto, opacity 0→1
- `useReducedMotion()` guard: instant transition when reduced

### Code example
```tsx
const [openId, setOpenId] = useState<string | null>(null);

<div className="space-y-4">
  {faqs.map(faq => (
    <AccordionItem
      key={faq.id}
      id={faq.id}
      question={faq.question}
      answer={faq.answer}
      isOpen={openId === faq.id}
      onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
    />
  ))}
</div>
```
