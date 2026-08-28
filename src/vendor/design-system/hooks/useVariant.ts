'use client';

/**
 * useVariant — read + toggle the active DS variant.
 *
 * The variant is persisted via cookie `ds-variant` and read by RSC at first paint
 * (no FOUC). This hook reads the data-variant attribute from <html> and exposes
 * a setter that updates DOM + cookie.
 *
 * USAGE
 *   const { variant, setVariant } = useVariant();
 *   // variant: 'editorial-light' | 'cinematic-dark'
 *
 * RSC (server) read pattern (in app/layout.tsx):
 *   import { cookies } from 'next/headers';
 *   const variant = cookies().get('ds-variant')?.value ?? 'editorial-light';
 *   return <html data-variant={variant}>...</html>;
 *
 * @promotedFrom design-system/core-v2 (net new in v2; no v1 equivalent)
 */

import { useCallback, useEffect, useState } from 'react';

export type DSVariant = 'editorial-light' | 'cinematic-dark';

const COOKIE_NAME = 'ds-variant';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readVariantFromDOM(): DSVariant {
  if (typeof document === 'undefined') return 'editorial-light';
  const v = document.documentElement.dataset.variant;
  return v === 'cinematic-dark' ? 'cinematic-dark' : 'editorial-light';
}

function writeCookie(value: DSVariant): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function useVariant() {
  const [variant, setVariantState] = useState<DSVariant>(() => readVariantFromDOM());

  // Re-sync if SSR/CSR variant differs (rare, but possible mid-stream cookie change)
  useEffect(() => {
    const current = readVariantFromDOM();
    if (current !== variant) setVariantState(current);
  }, [variant]);

  const setVariant = useCallback((next: DSVariant) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.variant = next;
    }
    writeCookie(next);
    setVariantState(next);
  }, []);

  const toggle = useCallback(() => {
    setVariant(variant === 'cinematic-dark' ? 'editorial-light' : 'cinematic-dark');
  }, [variant, setVariant]);

  return { variant, setVariant, toggle };
}
