/**
 * AnimatedArrowQuickRef — design-time copy-paste reference card for AnimatedArrow.
 *
 * WHY:
 * - Designers + engineers adopting AnimatedArrow need ready-made code snippets
 * - Single-page reference reduces churn vs reading source / props inline
 * - Lives in DS for discoverability (not docs/ MDX) — devs grep here first
 * - Keeps usage examples in-sync w/ atom source (co-located)
 * - Doc-helper atom — NOT mounted in production pages
 *
 * WHAT: Static React component that renders code blocks + usage examples
 * for AnimatedArrow (basic · in buttons · with shimmer · color variants).
 * Renders only formatted `<pre>` blocks — no live interaction.
 *
 * WHEN:
 * - Internal design-system browse pages (`/design-system/atoms`)
 * - Storybook/docs MDX where you want a self-contained reference
 * - Onboarding new contributors who need quick visual + code together
 *
 * WHEN NOT:
 * - Never mount in user-facing production pages (zero end-user value)
 * - Never use as a real CTA (only renders code samples, no behavior)
 * - Never link to from production navigation
 * - Not a substitute for the atom's JSDoc — read JSDoc first
 *
 * HOW:
 * ```tsx
 * // Inside DS-browse page only
 * import { AnimatedArrowQuickRef } from '@/atoms/AnimatedArrowQuickRef';
 * <AnimatedArrowQuickRef />
 * ```
 *
 * A11y: Decorative reference page · no interactive controls · `<pre>` blocks are AT-readable.
 * Motion: None — static doc page.
 * Anti-patterns:
 *  - ❌ Never bundle into prod page build (dead weight · increases JS payload)
 *  - ❌ Never edit examples to diverge from atom source (drift)
 *  - ❌ Never duplicate this pattern for other atoms w/o discussion (sprawls quickly)
 *
 * @lifecycle beta (doc-helper · may be replaced by Storybook later)
 * @a11y_status reviewed-AA (static text content)
 * @reusabilityScore 1/5 ⭐ (single-purpose · DS-internal)
 * @promotedFrom V0_lite_report developer-docs scaffolding
 */

export function AnimatedArrowQuickRef() {
  return (
    <div data-component="AnimatedArrowQuickRef" className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-normal mb-6">AnimatedArrow - Quick Reference</h1>
      
      {/* Basic Usage */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">1. Basic Usage</h2>
        <div className="bg-black/5 rounded-[5px] p-4 font-mono text-sm">
          <pre>{`import { AnimatedArrow } from './AnimatedArrow';

// Default
<AnimatedArrow />

// Custom size
<AnimatedArrow size={24} />

// Brand red
<AnimatedArrow color="brand" />

// Inherit parent color
<AnimatedArrow color="black" />`}</pre>
        </div>
      </div>

      {/* In Buttons */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">2. In Buttons</h2>
        <div className="bg-black/5 rounded-[5px] p-4 font-mono text-sm">
          <pre>{`<button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md">
  <span>Learn More</span>
  <AnimatedArrow size={18} color="white" />
</button>`}</pre>
        </div>
      </div>

      {/* In Links */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">3. In Links</h2>
        <div className="bg-black/5 rounded-[5px] p-4 font-mono text-sm">
          <pre>{`<a 
  href="/case-study" 
  className="inline-flex items-center gap-2 text-brand-red hover:underline"
>
  <span>View case study</span>
  <AnimatedArrow size={16} color="brand" />
</a>`}</pre>
        </div>
      </div>

      {/* In Cards */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">4. In Cards</h2>
        <div className="bg-black/5 rounded-[5px] p-4 font-mono text-sm">
          <pre>{`<div className="border rounded-lg p-6">
  <h3 className="text-xl font-semibold mb-2">Project Title</h3>
  <p className="text-black/70 mb-4">Description...</p>
  <a 
    href="#" 
    className="inline-flex items-center gap-2 text-sm font-medium text-brand-red"
  >
    <span>Read more</span>
    <AnimatedArrow size={14} color="brand" />
  </a>
</div>`}</pre>
        </div>
      </div>

      {/* On Dark Background */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">5. On Dark Backgrounds</h2>
        <div className="bg-black/5 rounded-[5px] p-4 font-mono text-sm">
          <pre>{`<div className="bg-black p-8">
  <a 
    href="#" 
    className="inline-flex items-center gap-2 text-white hover:underline"
  >
    <span>Explore services</span>
    <AnimatedArrow size={18} color="white" />
  </a>
</div>`}</pre>
        </div>
      </div>

      {/* Props Table */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">Props Reference</h2>
        <table className="w-full text-sm">
          <thead className="border-b border-black/10">
            <tr className="text-left">
              <th className="py-2 font-semibold">Prop</th>
              <th className="py-2 font-semibold">Type</th>
              <th className="py-2 font-semibold">Default</th>
              <th className="py-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            <tr>
              <td className="py-2 font-mono text-xs">size</td>
              <td className="py-2 text-black/60">number</td>
              <td className="py-2 font-mono text-xs">20</td>
              <td className="py-2 text-black/60">Icon size in pixels</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">color</td>
              <td className="py-2 text-black/60">string</td>
              <td className="py-2 font-mono text-xs">"currentColor"</td>
              <td className="py-2 text-black/60">Icon color</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">strokeWidth</td>
              <td className="py-2 text-black/60">number</td>
              <td className="py-2 font-mono text-xs">2</td>
              <td className="py-2 text-black/60">Icon stroke width</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">duration</td>
              <td className="py-2 text-black/60">number</td>
              <td className="py-2 font-mono text-xs">300</td>
              <td className="py-2 text-black/60">Animation duration (ms)</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">className</td>
              <td className="py-2 text-black/60">string</td>
              <td className="py-2 font-mono text-xs">""</td>
              <td className="py-2 text-black/60">Additional CSS classes</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Common Sizes */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">Common Sizes</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-black/60">Small text / footnotes:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">size={'{14}'}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Body text / links:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">size={'{16}'}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Buttons / cards:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">size={'{18}'}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Large CTAs:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">size={'{20}'}</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Hero sections:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">size={'{24}'}</code>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="border border-black/8 rounded-[5px] p-6 bg-white">
        <h2 className="text-lg font-semibold mb-3">Brand Colors</h2>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-black/60">Ken Bold Red:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">color=&quot;brand&quot;</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Purple:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">color=&quot;purple&quot;</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Coral:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">color=&quot;coral&quot;</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">Black:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">color=&quot;black&quot;</code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/60">White:</span>
            <code className="bg-black/5 px-2 py-1 rounded-[5px] font-mono text-xs">color=&quot;white&quot;</code>
          </div>
        </div>
      </div>
    </div>
  );
}
