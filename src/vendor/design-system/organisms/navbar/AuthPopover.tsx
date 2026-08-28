'use client';

import { forwardRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Divider } from '../../atoms/Divider';
import { MenuItem } from '../../atoms/MenuItem';
import {
  PersonIcon,
  BookmarkIcon,
  SettingsIcon,
  LogoutIcon,
  SignInIcon,
  SignUpIcon,
} from './popover-icons';
import type { NavUser } from './types';

export interface AuthPopoverProps {
  isOpen: boolean;
  user?: NavUser | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

/**
 * AuthPopover — floating auth card w/ authenticated/unauthenticated states.
 *
 * 220px card w/ spring animation (scale+fade). Backdrop closes on click.
 * Authed: user header → My Account / Saved / Settings / Sign-out (danger).
 * Unauthed: Welcome → Sign-in / Sign-up (icon-bg, subtitle).
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/organisms/AuthPopover.tsx
 */
export const AuthPopover = forwardRef<HTMLDivElement, AuthPopoverProps>(
  ({ isOpen, user, onClose, onNavigate, onSignOut }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const isAuthenticated = !!user;

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
              className="fixed inset-0 z-[98]"
              onClick={onClose}
              aria-hidden="true"
            />

            <motion.div
              ref={ref}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 25 }}
              className="
                absolute top-[calc(100%+8px)] right-0 z-[99]
                w-[220px] bg-[var(--color-foundation-white)] rounded-[12px]
                border border-[var(--border-soft)]
                shadow-[0px_8px_24px_-4px_rgba(20,16,22,0.12),0px_2px_8px_-2px_rgba(20,16,22,0.08)]
                overflow-hidden
              "
              role="menu"
              aria-label="Account options"
            >
              {isAuthenticated && user ? (
                <>
                  <div className="px-4 pt-4 pb-3">
                    <p className="font-[var(--typography-family-body)] font-medium text-[13px] text-[var(--surface-text)] truncate">
                      {user.name}
                    </p>
                    <p className="font-[var(--typography-family-body)] text-[11px] text-[var(--surface-text-subtle)] mt-0.5 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Divider />
                  <div className="p-2 space-y-0.5">
                    <MenuItem icon={<PersonIcon />} label="My Account" onClick={onClose} />
                    <MenuItem icon={<BookmarkIcon />} label="Saved Reports" onClick={onClose} />
                    <MenuItem icon={<SettingsIcon />} label="Settings" onClick={onClose} />
                  </div>
                  <Divider />
                  <div className="p-2">
                    <MenuItem icon={<LogoutIcon />} label="Sign out" danger onClick={onSignOut} />
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 pt-4 pb-3">
                    <p className="font-[var(--typography-family-body)] font-medium text-[13px] text-[var(--surface-text)]">
                      Welcome
                    </p>
                    <p className="font-[var(--typography-family-body)] text-[11px] text-[var(--surface-text-subtle)] mt-0.5">
                      Access your account
                    </p>
                  </div>
                  <Divider />
                  <div className="p-2 space-y-1">
                    <MenuItem
                      icon={<SignInIcon />}
                      label="Sign in"
                      subtitle="Existing account"
                      iconBg
                      minHeight={44}
                      onClick={() => onNavigate('/auth?mode=signin')}
                    />
                    <MenuItem
                      icon={<SignUpIcon />}
                      label="Sign up"
                      subtitle="Create free account"
                      iconBg
                      minHeight={44}
                      onClick={() => onNavigate('/auth?mode=signup')}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

AuthPopover.displayName = 'AuthPopover';
