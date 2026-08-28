'use client';

import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from 'react';

const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * useNavDropdown — navbar dropdown state manager.
 *
 * Handles: activeDropdown state · 100ms hover-leave debounce · keyboard nav
 * (Enter/Space toggle, Escape close) · touch detection (suppresses hover) ·
 * ARIA live announcements.
 *
 * Used by: SecondaryBar (Company), DesktopNavItems (5 main items), TopNavigation.
 *
 * @promotedFrom topnav-v32/src/app/components/navbar/hooks/useNavDropdown.ts
 */
export function useNavDropdown() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => { setIsTouch(isTouchDevice()); }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (activeDropdown && !activeDropdown.includes('mobile') && activeDropdown !== 'company') {
      const menuName = activeDropdown.charAt(0).toUpperCase() + activeDropdown.slice(1);
      setAnnouncement(`${menuName} menu opened`);
    } else if (!activeDropdown) {
      setAnnouncement('Menu closed');
    }
  }, [activeDropdown]);

  const handleMouseEnter = useCallback((menu: string) => {
    if (isTouch) return;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  }, [isTouch]);

  const handleMouseLeave = useCallback(() => {
    if (isTouch) return;
    hoverTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 100);
  }, [isTouch]);

  const toggleDropdown = useCallback((menu: string) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  }, []);

  const closeAll = useCallback(() => setActiveDropdown(null), []);

  const handleKeyDown = useCallback((e: KeyboardEvent, menu: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown(menu);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
    }
  }, [toggleDropdown]);

  return {
    activeDropdown,
    setActiveDropdown,
    handleMouseEnter,
    handleMouseLeave,
    toggleDropdown,
    closeAll,
    handleKeyDown,
    announcement,
    isTouch,
  };
}
