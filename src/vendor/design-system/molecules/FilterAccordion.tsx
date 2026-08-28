/**
 * FilterAccordion
 *
 * WHY · Desktop sidebar and mobile sheet previously duplicated the filter-section heading +
 *        checkbox-list pattern. This molecule unifies both into one component with a
 *        `variant` prop, eliminating drift between desktop and mobile filter UX.
 * WHAT · Renders a section heading + list of FilterCheckbox atoms. `static` variant:
 *        heading always visible, list always open. `collapsible` variant: heading is a
 *        button that toggles the list with a ChevronDown icon. Props: title, options
 *        ({label, count?, disabled?}[]), selectedValue, onSelect, variant, defaultOpen,
 *        disabled.
 * WHEN · Inside SidebarPanel (desktop) or MobileFilterSheet (mobile) for each filter
 *        dimension (industry, region, year, price, etc.).
 * WHEN NOT · Don't use as a standalone page section accordion — use a shadcn Accordion
 *             for general content collapse. Don't use when options exceed 20 items without
 *             a search input above it.
 * WHERE · report-store-legacy IndustrySidebar.tsx + MobileFilterSheet.tsx ·
 *          competition-benchmarking-listing-v02 IndustrySidebar.tsx + MobileFilterSheet.tsx +
 *          BenchmarkFilterSidebar.tsx + BenchmarkMobileFilterSheet.tsx ·
 *          Design_system_vs_26 FiltersDocumentation.tsx
 * HOW ·
 *   ```tsx
 *   <FilterAccordion
 *     title="Industry"
 *     options={[{ label: "Automotive", count: 42 }, { label: "Healthcare", count: 31 }]}
 *     selectedValue={selectedIndustry}
 *     onSelect={setSelectedIndustry}
 *     variant="collapsible"
 *   />
 *   ```
 *
 * @reusabilityScore 4     // every listing page with filters · 4+ projects
 * @a11y_status pending-review
 * @lifecycle stable
 * @promotedFrom core-v2 native
 */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterCheckbox } from '../atoms/FilterCheckbox';

type FilterAccordionVariant = 'static' | 'collapsible';

interface FilterOption {
  label: string;
  count?: number;
  disabled?: boolean;
}

interface FilterAccordionProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  variant?: FilterAccordionVariant;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export function FilterAccordion({
  title,
  options,
  selectedValue,
  onSelect,
  variant = 'static',
  defaultOpen = true,
  disabled = false,
}: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);

  const showContent = variant === 'static' || isOpen;

  return (
    <div data-component="FilterAccordion" style={{ opacity: disabled ? 0.4 : 1 }}>
      {variant === 'collapsible' ? (
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
          }`}
          aria-expanded={isOpen}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h3
            className="uppercase transition-colors"
            style={{
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.1em',
              color: hovered && !disabled ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </h3>
          <ChevronDown
            size={12}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'rgba(0,0,0,0.3)' }}
          />
        </button>
      ) : (
        <h3
          className="uppercase mb-3"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.1em',
            color: 'rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h3>
      )}

      {showContent && (
        <div className="space-y-0">
          {options.map((opt) => (
            <FilterCheckbox
              key={opt.label}
              label={opt.label}
              count={opt.count}
              checked={selectedValue === opt.label}
              disabled={disabled || opt.disabled}
              onToggle={() => onSelect(opt.label)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
