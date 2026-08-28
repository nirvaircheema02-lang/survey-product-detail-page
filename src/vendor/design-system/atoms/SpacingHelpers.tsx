// ============================================================================
// SPACING HELPER COMPONENTS
// ============================================================================

/**
 * SpacingScaleVisualization — design-time visualizer of the DS spacing scale.
 *
 * WHY:
 * - Designers + engineers need a single canonical view of every spacing token + its intended use
 * - Co-locating visualization w/ the DS prevents drift between docs and lived tokens
 * - Marker `⭐` calls out the most-used values (8 · 16 · 24 · 48 · 96 px) — guides decisions
 * - Visual square rendering makes "what 24px feels like" tangible vs an abstract number
 * - Doc-helper only — NOT a production component
 *
 * WHAT: Static grid of cards. Each card renders a brand-red square sized to the token value
 * (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px) with token label + intended usage text.
 *
 * WHEN:
 * - DS docs / browse page (`/design-system/spacing`)
 * - Onboarding new contributors to the spacing system
 * - Storybook spacing tokens story
 *
 * WHEN NOT:
 * - Production user-facing pages (zero end-user value)
 * - Inline inside Card or section content (visual chrome conflict)
 * - Mobile-first design review (desktop grid layout)
 *
 * HOW:
 * ```tsx
 * import { SpacingScaleVisualization } from '@/atoms/SpacingHelpers';
 * <SpacingScaleVisualization />
 * ```
 *
 * A11y: Static content · readable text on light bg. Decorative squares (no AT label needed).
 * Motion: None — static layout.
 * Anti-patterns:
 *  - ❌ Never bundle into prod page builds (dead weight)
 *  - ❌ Never edit values to diverge from `design-system/tokens/` (single source of truth)
 *  - ❌ Never use the brand-red squares as actual visual elements (they're size demonstrators)
 *
 * @lifecycle beta (doc-helper)
 * @a11y_status reviewed-AA (static text content)
 * @reusabilityScore 1/5 ⭐ (DS-internal docs only)
 * @promotedFrom Design_system_vs_26 OG (DS browse · spacing tokens visualizer)
 */
export function SpacingScaleVisualization() {
  const spacingScale = [
    { token: '4px', value: 4, usage: 'Minimal spacing' },
    { token: '8px', value: 8, usage: 'Dense content ⭐' },
    { token: '12px', value: 12, usage: 'Typography micro-spacing' },
    { token: '16px', value: 16, usage: 'Standard gap ⭐' },
    { token: '24px', value: 24, usage: 'Section internal ⭐' },
    { token: '32px', value: 32, usage: 'Component separation' },
    { token: '48px', value: 48, usage: 'Section padding mobile ⭐' },
    { token: '64px', value: 64, usage: 'Section spacing mobile' },
    { token: '96px', value: 96, usage: 'Section spacing desktop ⭐' },
    { token: '128px', value: 128, usage: 'Major separation' },
  ];

  return (
    <div data-component="SpacingScaleVisualization" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spacingScale.map((item) => (
          <div key={item.token} className="border border-black/8 rounded-[10px] p-4">
            <div className="flex items-center gap-4 mb-3">
              <div 
                className="bg-[var(--brand-red)] rounded-[3px]"
                style={{ width: `${item.value}px`, height: `${item.value}px` }}
              />
              <div>
                <p className="font-mono font-bold text-sm">{item.token}</p>
              </div>
            </div>
            <p className="text-xs text-black/70">{item.usage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarginPaddingGuide() {
  return (
    <div data-component="MarginPaddingGuide" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-black/8 rounded-[10px] p-6">
        <h4 className="font-semibold mb-3">Use MARGIN when:</h4>
        <ul className="space-y-2 text-sm">
          <li>✓ Creating space BETWEEN elements</li>
          <li>✓ Separating components</li>
          <li>✓ Controlling external spacing</li>
        </ul>
      </div>

      <div className="border border-black/8 rounded-[10px] p-6">
        <h4 className="font-semibold mb-3">Use PADDING when:</h4>
        <ul className="space-y-2 text-sm">
          <li>✓ Creating space INSIDE elements</li>
          <li>✓ Increasing clickable area</li>
          <li>✓ Space within backgrounds</li>
        </ul>
      </div>
    </div>
  );
}

export function ComponentSpacingExamples() {
  return (
    <div data-component="ComponentSpacingExamples" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border border-black/8 rounded-[10px] p-6">
        <p className="font-mono text-xs mb-3">Button Spacing</p>
        <div className="bg-[var(--brand-red)] text-white px-7 py-3 text-sm inline-block rounded-[5px]">
          Button
        </div>
        <p className="text-xs text-black/60 mt-3">Padding: 12px × 28px</p>
      </div>

      <div className="border border-black/8 rounded-[10px] p-6">
        <p className="font-mono text-xs mb-3">Card Spacing</p>
        <div className="bg-blue-50 p-6 rounded-[5px]">
          <p className="text-sm font-semibold">Card Title</p>
        </div>
        <p className="text-xs text-black/60 mt-3">Padding: 24px</p>
      </div>

      <div className="border border-black/8 rounded-[10px] p-6">
        <p className="font-mono text-xs mb-3">Input Spacing</p>
        <input 
          type="text" 
          placeholder="Input"
          className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus:border-black/90 focus:outline-none transition-colors duration-150"
        />
        <p className="text-xs text-black/60 mt-3">Padding: 12px × 16px</p>
      </div>
    </div>
  );
}

export function ListFormSpacingDemo() {
  return (
    <div data-component="ListFormSpacingDemo" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="border border-black/8 rounded-[10px] p-6">
        <h4 className="font-semibold mb-4">List Items</h4>
        <div className="space-y-3">
          <div className="bg-black/[0.02] p-3 rounded-[5px]">Item 1</div>
          <div className="bg-black/[0.02] p-3 rounded-[5px]">Item 2</div>
          <div className="bg-black/[0.02] p-3 rounded-[5px]">Item 3</div>
        </div>
        <p className="text-xs text-black/60 mt-3">Gap: 12px</p>
      </div>

      <div className="border border-black/8 rounded-[10px] p-6">
        <h4 className="font-semibold mb-4">Form Fields</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Label</label>
            <input type="text" className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus:border-black/90 focus:outline-none transition-colors duration-150" />
          </div>
          <div>
            <label className="block text-sm mb-2">Label</label>
            <input type="text" className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus:border-black/90 focus:outline-none transition-colors duration-150" />
          </div>
        </div>
        <p className="text-xs text-black/60 mt-3">Gap: 16px</p>
      </div>
    </div>
  );
}

export function ResponsiveSpacingDemo() {
  return (
    <div data-component="ResponsiveSpacingDemo" className="bg-black/[0.02] rounded-[10px] p-6">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-black/20">
            <th className="text-left p-3 text-sm font-bold">Screen</th>
            <th className="text-left p-3 text-sm font-bold">Padding</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-black/8">
            <td className="p-3">Mobile</td>
            <td className="p-3">24px</td>
          </tr>
          <tr className="border-b border-black/8">
            <td className="p-3">Tablet</td>
            <td className="p-3">48px</td>
          </tr>
          <tr>
            <td className="p-3">Desktop</td>
            <td className="p-3">96px ⭐</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function VisualRhythmDemo() {
  return (
    <div data-component="VisualRhythmDemo" className="border border-black/8 rounded-[10px] p-8">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-mono text-black/40 mb-2">Section Label</p>
        <h2 className="text-3xl mb-4">Section Heading</h2>
        <p className="text-sm text-black/70 mb-6">
          Demonstrates vertical rhythm with consistent spacing.
        </p>
        <h3 className="text-xl mb-3">Subsection</h3>
        <p className="text-sm text-black/70">
          Tighter spacing creates visual relationship.
        </p>
      </div>
    </div>
  );
}
