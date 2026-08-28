/**
 * Public type registry — core-v2 data shapes (DS Port Phase 3, 2026-05-13).
 *
 * WHY: Organisms ported via adapter pattern need shared types that consumers
 *      can re-use for their own data shape. Lifting these from OG data.ts
 *      keeps DS organism props strict + decouples DS from consumer mock data.
 * WHAT: Report · Industry · Region · Stat · DataHighlight · AnalystPick types
 *      mirror OG names verbatim · adds ReportFilters subset (data-coupled
 *      fields excluded — consumer owns those).
 * WHEN: Importing into organisms · consumer adapter components.
 * WHEN NOT: Don't add UI-state types here (those belong w/ component file).
 * HOW: All types use `export` · no enums (string literal unions instead).
 *
 * @promotedFrom Design_system_vs_26 OG components/data.ts (DS Port Phase 3, 2026-05-13)
 */

// ═══════════════════════════════════════════════════════════════
// REPORT
// ═══════════════════════════════════════════════════════════════

export interface ReportItem {
  id: string;
  image: string;
  title: string;
  industry: string;
  subcat: string;
  projection: string;
  region: string;
  date: string;
  format?: string;
  description?: string;
}

// ═══════════════════════════════════════════════════════════════
// INDUSTRY / REGION / TAG
// ═══════════════════════════════════════════════════════════════

export interface IndustryData {
  label: string;
  count: number;
  subs: string[];
}

export interface RegionData {
  label: string;
  count: number;
}

export interface SectorItem {
  name: string;
  count: number;
}

// ═══════════════════════════════════════════════════════════════
// STAT / DATA HIGHLIGHT
// ═══════════════════════════════════════════════════════════════

export interface StatData {
  category: string;
  value: string;
  label: string;
  description: string;
  growth: string;
  metric: string;
}

export interface DataHighlight {
  value: string;
  title: string;
  source: string;
  growth: string;
  time: string;
}

// ═══════════════════════════════════════════════════════════════
// ANALYST PICK
// ═══════════════════════════════════════════════════════════════

export interface AnalystPick {
  id: string;
  image: string;
  title: string;
  industry: string;
  region: string;
  date: string;
  quote: string;
  analystName: string;
  analystRole: string;
  analystInitials: string;
}

// ═══════════════════════════════════════════════════════════════
// SORT
// ═══════════════════════════════════════════════════════════════

export type SortKey = 'date' | 'title' | 'industry';

export interface SortOption {
  label: string;
  value: SortKey;
}

// ═══════════════════════════════════════════════════════════════
// FILTERS (state shape for FiltersPanel/IndustrySidebar adapters)
// ═══════════════════════════════════════════════════════════════

export interface ActiveChip {
  label: string;
  category?: string;
  onRemove: () => void;
}

/**
 * ReportFilters — public contract for filter state passed into FiltersPanel,
 * IndustrySidebar, ListingToolbar etc. Consumer owns the hook implementation
 * (e.g. `useReportFilters`) · DS components only consume the shape.
 *
 * Note: `filteredSidebarIndustries` typed as `IndustryData[]` here (was
 * `typeof FULL_INDUSTRIES` in OG — data-coupled). Otherwise verbatim.
 */
export interface ReportFilters {
  // ── State values ──
  searchQuery: string;
  sortBy: SortKey;
  currentPage: number;
  sidebarSearch: string;
  selectedIndustry: string | null;
  selectedSubIndustries: string[];
  selectedTags: string[];
  selectedRegions: string[];
  selectedYears: string[];
  selectedFormats: string[];

  // ── Section open/close ──
  industriesOpen: boolean;
  tagsOpen: boolean;
  regionsOpen: boolean;
  publishYearOpen: boolean;

  // ── Setters ──
  setSearchQuery: (q: string) => void;
  setSortBy: (key: SortKey) => void;
  setCurrentPage: (page: number) => void;
  setSidebarSearch: (q: string) => void;
  setSelectedIndustry: (industry: string | null) => void;
  setSelectedSubIndustries: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedYears: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedFormats: React.Dispatch<React.SetStateAction<string[]>>;
  setIndustriesOpen: (open: boolean) => void;
  setTagsOpen: (open: boolean) => void;
  setRegionsOpen: (open: boolean) => void;
  setPublishYearOpen: (open: boolean) => void;

  // ── Derived ──
  filteredSidebarIndustries: IndustryData[];
  availableTags: string[];
  activeFilterCount: number;
  filtered: ReportItem[];
  totalPages: number;
  paginated: ReportItem[];
  activeChips: ActiveChip[];

  // ── Actions ──
  clearAllFilters: () => void;
  applyFilter: () => void;
  handlePageChange: (page: number) => void;
  selectIndustry: (label: string) => void;
  toggleSubIndustry: (sub: string) => void;
  toggleTag: (tag: string) => void;
  toggleRegion: (region: string) => void;
  toggleYear: (year: string) => void;
  toggleFormat: (format: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// CTA CONFIG (CustomResearchCTA · ReportStoreHero)
// ═══════════════════════════════════════════════════════════════

export interface CTAConfig {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface HeroConfig {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
}
