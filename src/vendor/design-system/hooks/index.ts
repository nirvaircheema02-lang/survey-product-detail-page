// Hooks barrel — populated in Phase C (promoted from V0_lite_report + OG Design_system_vs_26)

// Variant management (Phase B3 step 3 — net new in v2)
export { useVariant, type DSVariant } from './useVariant';

// Promoted from V0_lite_report (Phase C step 2a, 2026-05-08)
export { useDebounce } from './useDebounce';
export { useFocusTrap } from './useFocusTrap';
export { useKeyboardNavigation, type KeyboardNavigationOptions } from './useKeyboardNavigation';
export { useShimmer, type UseShimmerReturn } from './useShimmer';

// Promoted from topnav-v32 (Phase C step 4b, 2026-05-08)
export { useNavDropdown } from './useNavDropdown';
export { useMobileMenu } from './useMobileMenu';
export { useAuthPopover } from './useAuthPopover';

// Promoted from V0_lite_report (Phase C step 6, 2026-05-08)
export { useAnimatedCounter } from './useAnimatedCounter';

// Promoted from Design_system_vs_26 OG (DS Port Phase 1, 2026-05-13)
export { useActiveSection } from './useActiveSection';
export { useScrollDirection, type ScrollDirection } from './useScrollDirection';
export { useHeroVisibility } from './useHeroVisibility';
export { useSectionProgress } from './useSectionProgress';
export { useScrollAnimation, type UseScrollAnimationOptions } from './useScrollAnimation';
export { useResponsiveGutter } from './useResponsiveGutter';
export { useReadingProgress } from './useReadingProgress';
export { useMagneticEffect, type MagneticEffectOptions } from './useMagneticEffect';
export { useCrossfade, type CrossfadeResult } from './useCrossfade';
export { useMountTransition, type MountTransitionResult } from './useMountTransition';
export { useProgressiveLoad, type ProgressiveLoadResult } from './useProgressiveLoad';
export { useCounter, type UseCounterOptions } from './useCounter';

// Promoted from Design_system_vs_26 OG (DS Port Phase 6, 2026-05-15 · parameterized on port)
export { useReportFilters, type UseReportFiltersArgs } from './useReportFilters';

// Promoted from V0.2-for-design-system (DS Port Batch 3.2b · 2026-05-19 · scroll-spy for TOC sidebar)
export { useScrollSpy } from './useScrollSpy';

// LCP perf: deferred render gate for heavy dynamic imports (2026-05-19 · P1 Highcharts fix)
export { useDeferredRender, type UseDeferredRenderOptions } from './useDeferredRender';
