'use client';

/**
 * CodeBlockWithCopy — tokenized syntax-display block with copy-to-clipboard.
 *
 * WHY: DS documentation pages need a consistent code display surface with
 *      one-click copy — reduces friction for devs consuming component recipes
 *      and token references. Avoids re-implementing clipboard logic per page.
 *
 * WHAT: Monospace code container with language label, optional title, optional
 *       line numbers, collapsible toggle, and a copy button that provides 2s
 *       "Copied!" feedback. Zero external syntax-highlighting dep — plain text
 *       display is intentional (syntax coloring is a consumer concern; import
 *       Prism/shiki at app level and wrap if needed).
 *
 * WHEN: Code snippet display in DS documentation, recipe pages, token
 *       reference pages, or any consumer page showing code samples.
 *
 * WHEN NOT: Do not use for user-editable input — this is display-only.
 *           Do not use for non-code content; use `<pre>` or `<blockquote>` instead.
 *
 * WHERE: `design-system/core-v2/src/atoms/CodeBlockWithCopy.tsx`
 *        Consumer: DS doc pages, recipe viewers, token reference.
 *
 * HOW:
 * ```tsx
 * <CodeBlockWithCopy
 *   code={`const x = 1;`}
 *   language="typescript"
 *   title="Example"
 *   showLineNumbers
 * />
 * ```
 *
 * @promotedFrom Design_system_vs_26 OG src/app/components/CodeBlockWithCopy.tsx
 * @reusabilityScore 5/5 — fully data-independent · pure display atom
 * @a11y_status pass — copy button has descriptive accessible label · focus-visible
 *              on all interactive elements · collapse toggle keyboard accessible
 * @lifecycle stable · v2 addition 2026-05-15
 */

import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

/** Supported language identifiers for the label display. */
export type CodeLanguage = 'tsx' | 'css' | 'typescript' | 'javascript' | 'bash' | 'json' | 'html';

/** Props for the CodeBlockWithCopy component. */
export interface CodeBlockWithCopyProps {
  /** The raw code string to display. */
  code: string;
  /**
   * Language identifier shown as label in the header bar.
   * @default "tsx"
   */
  language?: CodeLanguage;
  /** Show line numbers in the left gutter. @default false */
  showLineNumbers?: boolean;
  /**
   * Whether the block can be collapsed/expanded.
   * @default false
   */
  collapsible?: boolean;
  /**
   * Initial collapsed state (only relevant when `collapsible` is true).
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Optional title shown instead of (or alongside) the language label.
   * When provided, replaces the language text in the header.
   */
  title?: string;
  /**
   * Additional CSS class names applied to the outer wrapper.
   */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Displays a code block with a header bar containing language/title label
 * and a copy-to-clipboard button. Supports collapsible mode and line numbers.
 *
 * Exported under both `CodeBlockWithCopy` and `CodeBlock` for backward compat.
 */
export function CodeBlockWithCopy({
  code,
  language = 'tsx',
  showLineNumbers = false,
  collapsible = false,
  defaultCollapsed = false,
  title,
  className = '',
}: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (non-https or blocked) — silent fail
    }
  }

  function handleToggleCollapse() {
    setIsExpanded(prev => !prev);
  }

  const lines = code.split('\n');
  const headerLabel = title || language;

  return (
    <div
      data-component="CodeBlockWithCopy"
      className={`rounded-[5px] overflow-hidden ${className}`}
      style={{
        background: 'rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.10)',
      }}
    >
      {/* ── Header bar ────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-2) var(--space-4)',
          borderBottom: '1px solid rgba(0,0,0,0.10)',
          background: 'rgba(0,0,0,0.02)',
        }}
      >
        {/* Left: collapse toggle + label */}
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              onClick={handleToggleCollapse}
              aria-label={isExpanded ? 'Collapse code block' : 'Expand code block'}
              aria-expanded={isExpanded}
              className="focus-visible:outline-none focus-visible:ring-2 rounded"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(0,0,0,0.60)',
                '--tw-ring-color': 'var(--black)',
              } as React.CSSProperties}
            >
              {isExpanded ? (
                <ChevronDown size={12} aria-hidden="true" />
              ) : (
                <ChevronRight size={12} aria-hidden="true" />
              )}
            </button>
          )}

          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'monospace',
              color: 'rgba(0,0,0,0.60)',
            }}
          >
            {headerLabel}
          </span>
        </div>

        {/* Right: copy button */}
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
          className="flex items-center gap-1.5 rounded-[5px] transition-all focus-visible:outline-none focus-visible:ring-2"
          style={{
            padding: 'var(--space-1) var(--space-3)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-sans)',
            color: copied ? 'var(--black)' : 'rgba(0,0,0,0.70)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            '--tw-ring-color': 'var(--black)',
          } as React.CSSProperties}
        >
          {copied ? (
            <>
              <Check size={12} aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* ── Code content ──────────────────────────────────────── */}
      {isExpanded && (
        <div className="overflow-x-auto">
          <pre style={{ padding: 'var(--space-4)' }}>
            <code
              style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'monospace',
                color: 'rgba(0,0,0,0.80)',
              }}
            >
              {showLineNumbers ? (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <tbody>
                    {lines.map((line, index) => (
                      <tr key={index}>
                        <td
                          aria-hidden="true"
                          style={{
                            paddingRight: 'var(--space-4)',
                            color: 'rgba(0,0,0,0.40)',
                            textAlign: 'right',
                            userSelect: 'none',
                            minWidth: '2rem',
                          }}
                        >
                          {index + 1}
                        </td>
                        <td>{line}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                code
              )}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

/** @alias CodeBlockWithCopy — legacy alias for OG compat. */
export { CodeBlockWithCopy as CodeBlock };
