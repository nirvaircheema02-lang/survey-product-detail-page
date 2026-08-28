/**
 * Label — Atom (form-only)
 *
 * WHY: Semantic, accessible <label> element exclusively for form inputs.
 *      Provides programmatic association via htmlFor, required-field
 *      indication, and optional helper-text below the label.
 * WHAT: Renders a <label> w/ optional asterisk + helper text. 3 variants.
 * WHEN: Form fields requiring label-input association.
 * WHEN NOT: Section headers (use SectionLabel from Badge) · chapter labels.
 *
 * HOW:
 * ```tsx
 * <Label htmlFor="email" required>Email Address</Label>
 * <input id="email" type="email" />
 *
 * <Label htmlFor="bio" variant="secondary" helperText="Optional">Bio</Label>
 * <textarea id="bio" />
 * ```
 *
 * ACCESSIBILITY:
 * - Semantic <label> element (not <span>)
 * - htmlFor creates programmatic link to input
 * - Required fields marked with aria-label="required" on asterisk
 * - Helper text provides additional context for screen readers
 *
 * @promotedFrom Design_system_vs_26/src/app/components/Label.tsx
 * @portedDate 2026-05-12 — DS Port Batch 1
 */
import React from 'react';

export type LabelVariant = 'default' | 'secondary' | 'required';

export interface LabelProps {
  children: React.ReactNode;
  /** Associates label with a form input via id */
  htmlFor?: string;
  /** Visual variant (default: 'default') */
  variant?: LabelVariant;
  /** Shows red asterisk for mandatory fields */
  required?: boolean;
  /** Descriptive text below the label */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
}

const variantStyles: Record<LabelVariant, string> = {
  default: 'text-black font-medium',
  secondary: 'text-black/70 font-normal',
  required: 'text-black font-medium',
};

export function Label({
  children,
  htmlFor,
  variant = 'default',
  required = false,
  helperText,
  className = '',
}: LabelProps) {
  const variantClass = variantStyles[variant];
  const isRequired = required || variant === 'required';

  return (
    <div data-component="Label" className={`mb-2 ${className}`}>
      <label
        htmlFor={htmlFor}
        className={`block mb-1.5 select-none ${variantClass}`}
        style={{ fontSize: 'var(--typography-size-sm, 1rem)' }}
      >
        {children}
        {isRequired && (
          <span
            className="ml-1"
            style={{ color: 'var(--brand-red)' }}
            aria-label="required"
          >
            *
          </span>
        )}
      </label>
      {helperText && (
        <p className="text-xs text-black/60 mt-1">{helperText}</p>
      )}
    </div>
  );
}
