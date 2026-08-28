'use client';

/**
 * CmdKSearchTrigger — Search trigger button that opens a command-palette menu.
 *
 * WHAT: A button with Search icon + placeholder text + ⌘K keyboard hint.
 *       Clicking it calls `onOpen` — the consumer wires the actual command menu.
 *       This component is the TRIGGER ONLY, not the menu.
 *
 * WHY: Separating the trigger from the command palette implementation means
 *      the DS can ship the chrome piece without mandating a specific cmdk
 *      library choice. The trigger is purely presentational and interaction-routing.
 *
 * WHEN: Inside Navbar right-action cluster · desktop lg+ only (hidden on mobile).
 *
 * WHEN NOT: Mobile nav (not needed — mobile has minimal affordance). Do not use
 *            outside Navbar without careful z-index + layout consideration.
 *
 * WHERE: Navbar organism right cluster.
 *
 * HOW:
 * ```tsx
 * <CmdKSearchTrigger onOpen={() => setCommandOpen(true)} />
 * ```
 *
 * @canonical report-store-legacy/src/app/components/Header.tsx search button (L134-139)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { Search } from 'lucide-react';

export interface CmdKSearchTriggerProps {
  /** Called when trigger is clicked · consumer opens command menu. */
  onOpen: () => void;
  /** Placeholder text. Default: "Search reports…" */
  placeholder?: string;
  /** Whether to show the keyboard hint. Default true. */
  showKbdHint?: boolean;
  className?: string;
}

export function CmdKSearchTrigger({
  onOpen,
  placeholder = 'Search reports…',
  showKbdHint = true,
  className = '',
}: CmdKSearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open search (Command K)"
      aria-keyshortcuts="Meta+k"
      data-component="CmdKSearchTrigger"
      className={`hidden lg:flex items-center gap-2 whitespace-nowrap transition-colors hover:bg-black/[0.03] rounded-md h-8 px-3 text-black/50 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 ${className}`}
      style={{ fontSize: 'var(--text-nav)' }}
    >
      <Search
        className="h-3.5 w-3.5 flex-shrink-0"
        aria-hidden="true"
        color="currentColor"
      />
      <span className="hidden xl:inline text-black/40">{placeholder}</span>
      {showKbdHint && (
        <kbd
          className="pointer-events-none hidden sm:flex items-center gap-1 h-5 px-1.5 select-none font-mono opacity-80"
          aria-hidden="true"
          style={{
            border: '1px solid var(--warm-500)',
            background: 'var(--warm-300)',
            borderRadius: 'var(--radius-element)',
            fontSize: 'var(--text-2xs)',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)' }}>⌘</span>K
        </kbd>
      )}
    </button>
  );
}
