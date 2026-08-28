/**
 * ReadingProgressBar
 *
 * WHY · Long-form case-study pages need a reading progress signal — users lose orientation in 8-section docs.
 *       A 3px fixed bar at viewport top communicates progress without interrupting content.
 * WHAT · Fixed top bar (3px · Ken red fill · `--brand-red`). Hidden while hero visible (`useHeroVisibility`).
 *        Fill % driven by `useSectionProgress('client-context', 'final-cta')` — tracks scroll between anchors.
 *        Fade transition (300ms) on hero enter/exit.
 * WHEN · Any long-form case-study or report page with multiple scroll sections and a distinct hero.
 * WHEN NOT · Landing pages · listing pages · pages < 3 sections (no meaningful "progress" to show).
 * WHERE · Case-study template — fixed layer, consumed alongside the full organism stack.
 * HOW ·
 *   ```tsx
 *   // Place in layout or page — no props required
 *   <ReadingProgressBar />
 *   ```
 *
 * @reusabilityScore 3
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom casestudy-templates/template-v3
 */
import { useSectionProgress } from '../hooks/useSectionProgress';
import { useHeroVisibility } from '../hooks/useHeroVisibility';

export function ReadingProgressBar() {
  const progress = useSectionProgress('client-context', 'final-cta');
  const isHeroVisible = useHeroVisibility();
  
  return (
    <div
      data-component="ReadingProgressBar"
      className={`fixed top-0 left-0 right-0 h-[3px] z-40 transition-opacity duration-300 ${
        isHeroVisible ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Track (background) */}
      <div className="absolute inset-0 bg-black/5" />
      
      {/* Progress Fill */}
      <div 
        className="absolute left-0 top-0 bottom-0 transition-all duration-150 ease-out"
        style={{ width: `${progress}%`, background: 'var(--brand-red)' }}
      />
    </div>
  );
}