# AnimatedArrow

**Tier:** atom
**Canonical source:** projects/report-store-legacy/src/app/components/AnimatedArrow.tsx:13-61
**Ported:** 2026-05-19 by aura-builder (Batch 3.1a — VERIFIED · no rewrite needed)
**Status:** ready

## WHAT
Two stacked `ArrowUpRight` icons that swap on hover: first arrow flies out ↗ (translate + fade), second arrives from below-left ↙. Creates "the arrow leaves → a new one arrives" momentum signal.

```
[rest]:    arrow1 visible at origin | arrow2 hidden at (-150%, +150%)
[hovered]: arrow1 hidden at (+150%, -150%) | arrow2 visible at origin
```

## WHY
Static arrow feels inert next to shimmer CTAs — momentum mismatch. 2-arrow swap adds urgency without extra DOM weight. ↗ direction = forward/upward progress metaphor (vs → or ↑).

## WHEN
- Urgency CTAs paired with shimmer (form submit · checkout · conversion redirects)
- Inside `CTALink` for exploratory nav arrows
- Lead-form primary submit buttons

## WHEN NOT
- Standard `<Button>` icons → Button has its own `icon` prop + `animatedArrow` prop
- Static nav links → use plain Lucide `ArrowUpRight` directly
- Pages with heavy motion budget already spent

## WHERE
Atoms: consumed by `CTALink`. Organisms: anywhere a CTA link or urgency redirect appears.

## HOW

### API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `number` | `20` | px dimensions for both arrows |
| `color` | `'white'|'black'|'brand'` | `'white'` | Token-locked color palette |
| `isHovered` | `boolean` | `false` | Controlled by parent hover state |
| `duration` | `number` | `300` | Transition duration in ms (default = --duration-normal) |

### Tokens used
| Token | Why |
|---|---|
| `--color-foundation-white` | white arrow color |
| `--color-foundation-black` | black arrow color |
| `--color-brand-red` | brand arrow color |

### A11y
Decorative — `aria-hidden` implicit. Parent button/link MUST carry the semantic label.
Color tokens ensure ≥4.5:1 contrast on intended surfaces.

### Motion
300ms (default) or custom `duration` prop. ease-out. Two-arrow opacity + translate swap.
`motion-reduce:transition-none` disables animation entirely when user prefers reduced motion.

### Responsive
No responsive behavior — size determined by parent context (Button passes `iconSizeMap[size]`).

### Code example
```tsx
const [hovered, setHovered] = useState(false);

<button
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  className="flex items-center gap-2"
>
  <span>Book a call</span>
  <AnimatedArrow size={18} color="brand" isHovered={hovered} />
</button>

// CTALink uses duration={250} for slightly snappier feel:
<AnimatedArrow size={16} color="white" isHovered={hovered} duration={250} />
```
