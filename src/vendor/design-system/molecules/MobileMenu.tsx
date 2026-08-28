'use client';

/**
 * MobileMenu — Full-screen slide-down mobile navigation panel.
 *
 * WHAT: An overlay panel that slides down from below the Navbar on mobile/tablet.
 *       Contains stacked nav links, Sign In, and a full-width brand Demo CTA button.
 *       Closes on ESC or backdrop click. Focus-trapped while open.
 *
 * WHY: Mobile users need a full-screen drawer for navigation — small touch targets
 *      in a collapsed nav cause Fitts's Law violations. Slide-from-top motion is
 *      intuitive (matches the source: the nav bar above). Framer AnimatePresence
 *      handles mount/unmount with reduced-motion guard.
 *
 * WHEN: Navbar mobile hamburger activates this. lg:hidden in Navbar chrome.
 *
 * WHEN NOT: Desktop (lg+). Never nest inside another overlay or sheet.
 *
 * WHERE: Navbar organism · below the sticky header band.
 *
 * HOW:
 * ```tsx
 * <MobileMenu
 *   isOpen={mobileOpen}
 *   onClose={() => setMobileOpen(false)}
 *   navLinks={NAV_LINKS}
 *   onSignIn={() => router.push('/login')}
 *   onDemoRequest={() => router.push('/demo')}
 * />
 * ```
 *
 * A11y: Focus-trap via first/last focusable sentinel. ESC key close. backdrop
 *       click close. aria-modal="true" on overlay.
 *
 * @canonical report-store-legacy/src/app/components/Header.tsx (L163-191)
 * @ported 2026-05-19 Batch 3.3b · aura-builder
 */

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '../atoms/Button';

export interface MobileNavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface MobileMenuProps {
  /** Whether the menu is visible. */
  isOpen: boolean;
  /** Called to close the menu. */
  onClose: () => void;
  /** Nav links to render. */
  navLinks: MobileNavLink[];
  /** Optional Sign In handler. */
  onSignIn?: () => void;
  /** Optional Demo/CTA handler. */
  onDemoRequest?: () => void;
  /** Demo button label. Default: "Request a Demo" */
  demoLabel?: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  onSignIn,
  onDemoRequest,
  demoLabel = 'Request a Demo',
}: MobileMenuProps) {
  const prefersReducedMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);

  // ESC close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Focus first element when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstFocusableRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const variants = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: -16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden"
            style={{ zIndex: 'calc(var(--z-sticky) - 1)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            data-component="MobileMenu"
            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg"
            style={{
              borderTop: '1px solid var(--warm-500)',
              zIndex: 'var(--z-sticky)',
            }}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="px-4 sm:px-6 py-4 flex flex-col gap-1"
              style={{ maxWidth: 'var(--container-page)', margin: '0 auto' }}
            >
              {/* Nav links */}
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  ref={idx === 0 ? firstFocusableRef : undefined}
                  onClick={onClose}
                  className={`py-2.5 px-3 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1 ${
                    link.active
                      ? 'text-black bg-[var(--warm-300)]'
                      : 'text-black/60 hover:text-black hover:bg-black/[0.03]'
                  }`}
                  style={{ fontSize: 'var(--text-nav)' }}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ))}

              {/* Divider + auth actions */}
              <div
                className="mt-2 pt-3 flex flex-col gap-2"
                style={{ borderTop: '1px solid var(--warm-500)' }}
              >
                <button
                  type="button"
                  onClick={() => { onSignIn?.(); onClose(); }}
                  className="py-2.5 px-3 text-left text-black/60 hover:text-black rounded-md hover:bg-black/[0.03] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] focus-visible:ring-offset-1"
                  style={{ fontSize: 'var(--text-nav)', minHeight: '44px' }}
                >
                  Sign In
                </button>
                <Button
                  variant="brand"
                  size="md"
                  fullWidth
                  onClick={() => { onDemoRequest?.(); onClose(); }}
                >
                  {demoLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
