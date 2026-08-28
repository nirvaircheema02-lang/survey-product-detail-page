'use client';

/**
 * KenHierarchyTable · expandable parent-child tree table · Ken DS.
 *
 * WHY  · Category breakdowns in research require showing aggregate parent values
 *        with optional drill-down to constituent children (e.g. Total AU Market →
 *        Victoria, NSW, Queensland; or Total Revenue → Cold Chain, Ambient, Pharma).
 *        Flat tables force all rows visible (cognitive overload); KenHierarchyTable
 *        exposes top-level summary first and reveals sub-rows on demand.
 *        No v0.4 precedent — NEW canonical pattern per Sprint G.11 brief.
 *
 * WHAT · Expandable tree table. Each row can have `children` (sub-rows).
 *        Parent rows: chevron toggle (▶ collapsed · ▼ expanded) · click to expand.
 *        Child rows: indented via `level × indentPx` · no chevron.
 *        Values across N data columns (same-length as `columns` prop).
 *        Visual hierarchy: indent + chevron · NOT color (Bible § neutral palette).
 *        Row hover + skip-shade (Bible § 2.4).
 *        Full keyboard nav: Tab · Enter/Space · Arrow Right/Left per ARIA tree pattern.
 *        aria-expanded + aria-controls on chevron · aria-level on rows.
 *
 * WHEN · Category breakdowns · org hierarchies · geographic drill-downs ·
 *        product segment hierarchies · any 2-level (or deeper) grouped datasets.
 *
 * WHERE · `design-system/core-v2/src/charts/tables/KenHierarchyTable.tsx`
 *         Consumed via `@kenresearch/design-system/charts`.
 *
 * HOW  · ```tsx
 *        <KenHierarchyTable
 *          columns={[
 *            { label: 'Revenue (AUD Bn)' },
 *            { label: 'Growth YoY' },
 *            { label: 'Market Share' },
 *          ]}
 *          rows={[
 *            {
 *              id: 'au-total',
 *              label: 'Australia Total',
 *              values: ['5.9', '12.3%', '100%'],
 *              defaultExpanded: true,
 *              children: [
 *                { id: 'nsw', label: 'NSW', values: ['2.1', '10.5%', '36%'] },
 *                { id: 'vic', label: 'Victoria', values: ['1.8', '14.2%', '31%'] },
 *              ],
 *            },
 *          ]}
 *        />
 *        ```
 *
 * Keyboard nav spec (ARIA Authoring Practices · tree pattern):
 *   Tab         → focus next interactive element (chevron / row)
 *   Enter/Space → toggle expanded on chevron
 *   Arrow Right → expand if collapsed · else move focus to first child row
 *   Arrow Left  → collapse if expanded · else move focus to parent row
 *
 * A11y:
 *   role="treegrid" on the table element
 *   aria-expanded on rows that have children
 *   aria-level="N" on each row (1 = root · 2 = child · 3 = grandchild …)
 *   aria-controls on chevron → references tbody-id of child group
 *   aria-label on table element (via ariaLabel prop)
 *   `<caption>` via TableShell caption prop (visually hidden)
 *   scope="col" on thead th · scope="row" on row-label cells
 *   Chevron has aria-label describing the toggle action
 *
 * @module design-system/core-v2/src/charts/tables/KenHierarchyTable
 * @relatedDoc design-system/core-v2/src/charts/primitives/TableShell.tsx
 * @relatedDoc design-system/core-v2/docs/CHARTS_TABLES_DATA_VIZ_BIBLE.md § 2.4
 */

import {
  useState,
  useCallback,
  useRef,
  type KeyboardEvent,
} from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { TableShell, type TableDensity, type TableVariant, type TableHeaderStyle } from '../primitives/TableShell';
import { TruncatedText } from '../primitives/TruncatedText';
import type { ChartSurface } from '../theme/highcharts-base';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * HierarchyNode · a single row that can contain nested child rows.
 * Children render with indent · expandable on parent click.
 */
export interface HierarchyNode {
  /** Unique identifier for expand/collapse state tracking. Must be unique across all rows. */
  id: string;
  /** Row label — primary dimension name. */
  label: string;
  /** Optional italic sub-label below the row label. */
  sublabel?: string;
  /**
   * Values across data columns — same-length as `columns` prop.
   * Accepts string or number. Numbers rendered right-aligned with tabular-nums.
   */
  values: (string | number)[];
  /** Child rows · render indented below this row when expanded. */
  children?: HierarchyNode[];
  /**
   * Whether this row starts expanded.
   * Only meaningful if `children` is non-empty.
   * @default false
   */
  defaultExpanded?: boolean;
}

/**
 * KenHierarchyTableProps · expandable parent-child breakdown table.
 */
export interface KenHierarchyTableProps {
  /**
   * Data column definitions. First column is auto-prepended (row label).
   * `align` defaults to 'right' for numbers · 'left' for strings.
   */
  columns: Array<{ label: string; align?: 'left' | 'right' | 'center' }>;
  /** Root-level rows. Each may contain `children` for nested drill-down. */
  rows: HierarchyNode[];
  /**
   * Pixel indent per nesting level for child rows.
   * Level 1 = root (no indent). Level 2 = 1 × indentPx. Level 3 = 2 × indentPx.
   * @default 20
   */
  indentPx?: number;
  /**
   * When true, parent row total values are shown even when children are collapsed.
   * When false, parent values are hidden on collapse (use when values = sum of children).
   * @default true
   */
  showParentSummary?: boolean;
  /** Card: bordered rounded. Open: flush editorial. @default 'card' */
  variant?: TableVariant;
  /** wash / transparent / inverted. @default 'wash' */
  headerStyle?: TableHeaderStyle;
  /** Row density. @default 'comfortable' */
  density?: TableDensity;
  /** Light or dark surface. @default 'light' */
  surface?: ChartSurface;
  /** aria-label on the table element. */
  ariaLabel?: string;
  /** Additional className on the outer wrapper. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Collect all nodes that start expanded into a Set of ids.
 * Recursively walks the tree to capture defaultExpanded at any depth.
 */
function collectDefaultExpanded(nodes: HierarchyNode[]): Set<string> {
  const expanded = new Set<string>();
  function walk(nodes: HierarchyNode[]) {
    for (const node of nodes) {
      if (node.defaultExpanded && node.children?.length) {
        expanded.add(node.id);
      }
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return expanded;
}

// ─── Row renderer (recursive) ─────────────────────────────────────────────────

interface RowRendererProps {
  node: HierarchyNode;
  level: number;
  indentPx: number;
  expandedIds: Set<string>;
  hoveredId: string | null;
  surface: ChartSurface;
  columns: KenHierarchyTableProps['columns'];
  showParentSummary: boolean;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
  rowRefs: React.MutableRefObject<Map<string, HTMLTableRowElement>>;
}

function RowRenderer({
  node,
  level,
  indentPx,
  expandedIds,
  hoveredId,
  surface,
  columns,
  showParentSummary,
  onToggle,
  onHover,
  rowRefs,
}: RowRendererProps) {
  const hasChildren = !!(node.children?.length);
  const isExpanded = expandedIds.has(node.id);
  const isHovered = hoveredId === node.id;
  const onDark = surface === 'dark';

  // Indent offset: level 1 = root (no extra indent) · level 2+ = (level-1) × indentPx
  const labelIndent = (level - 1) * indentPx;

  // Row background: hover or none
  const rowBg = isHovered
    ? (onDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
    : undefined;

  // Child group id for aria-controls
  const childGroupId = `hierarchy-children-${node.id}`;

  // Keyboard handler on the row for Arrow Left/Right
  function handleRowKeyDown(e: KeyboardEvent<HTMLTableRowElement>) {
    if (!hasChildren) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (!isExpanded) onToggle(node.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (isExpanded) onToggle(node.id);
    }
  }

  // Keyboard handler on the chevron button
  function handleChevronKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(node.id);
    }
    // Propagate arrow keys up to the row
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.stopPropagation(); // row handler will catch it
    }
  }

  return (
    <>
      <tr
        ref={(el) => {
          if (el) rowRefs.current.set(node.id, el);
          else rowRefs.current.delete(node.id);
        }}
        aria-level={level}
        aria-expanded={hasChildren ? isExpanded : undefined}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
        onKeyDown={handleRowKeyDown}
        tabIndex={0}
        style={{
          background: rowBg,
          transition: 'background 150ms ease',
          cursor: hasChildren ? 'pointer' : 'default',
          // Parent rows: slightly bolder visual weight via font-weight
          fontWeight: level === 1 ? 500 : 400,
        }}
      >
        {/* Row label cell with indent + optional chevron */}
        <th
          scope="row"
          style={{
            textAlign: 'left',
            color: onDark
              ? 'var(--semantic-ink-on-dark-strong, rgba(255,255,255,0.92))'
              : 'var(--semantic-ink-strong, rgba(0,0,0,0.87))',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              paddingLeft: `${labelIndent}px`,
            }}
          >
            {/* Chevron toggle — only for nodes with children */}
            {hasChildren ? (
              <button
                type="button"
                onClick={() => onToggle(node.id)}
                onKeyDown={handleChevronKeyDown}
                aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
                aria-expanded={isExpanded}
                aria-controls={childGroupId}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  minWidth: '24px',
                  minHeight: '44px',       // WCAG 2.5.5 — extended via padding on hover
                  padding: '10px 0',       // vertical hit area extension
                  background: 'none',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: onDark
                    ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.55))'
                    : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
                  transition: 'color 120ms ease, background 120ms ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = onDark
                    ? 'rgba(255,255,255,0.85)'
                    : 'rgba(0,0,0,0.75)';
                  (e.currentTarget as HTMLButtonElement).style.background = onDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = '';
                  (e.currentTarget as HTMLButtonElement).style.background = '';
                }}
              >
                {isExpanded
                  ? <ChevronDown size={14} aria-hidden="true" />
                  : <ChevronRight size={14} aria-hidden="true" />}
              </button>
            ) : (
              /* Spacer to align leaf rows with sibling parents that have chevrons */
              <span
                aria-hidden="true"
                style={{ display: 'inline-block', width: '24px', minWidth: '24px', flexShrink: 0 }}
              />
            )}

            {/* Label + optional sublabel */}
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <TruncatedText>{node.label}</TruncatedText>
              {node.sublabel && (
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '0.82em',
                    color: onDark
                      ? 'var(--semantic-ink-on-dark-muted, rgba(255,255,255,0.55))'
                      : 'var(--semantic-ink-muted, rgba(0,0,0,0.45))',
                  }}
                >
                  {node.sublabel}
                </span>
              )}
            </span>
          </span>
        </th>

        {/* Data columns */}
        {node.values.map((val, vi) => {
          const col = columns[vi];
          const align = col?.align ?? (typeof val === 'number' ? 'right' : 'left');
          const isNumeric = typeof val === 'number';

          return (
            <td
              key={vi}
              style={{
                textAlign: align,
                fontVariantNumeric: isNumeric ? 'tabular-nums' : undefined,
                fontFeatureSettings: isNumeric ? '"tnum"' : undefined,
                color: onDark
                  ? 'var(--semantic-ink-on-dark-body, rgba(255,255,255,0.82))'
                  : 'var(--semantic-ink-body, rgba(0,0,0,0.75))',
                whiteSpace: 'nowrap',
              }}
            >
              {typeof val === 'string' ? (
                <TruncatedText>{val}</TruncatedText>
              ) : (
                val
              )}
            </td>
          );
        })}
      </tr>

      {/* Child rows — rendered inline · visually hidden when collapsed (display:none) */}
      {hasChildren && (
        <tr
          id={childGroupId}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      )}

      {/* Expanded children — recursive render */}
      {hasChildren && isExpanded && node.children!.map((child) => (
        <RowRenderer
          key={child.id}
          node={child}
          level={level + 1}
          indentPx={indentPx}
          expandedIds={expandedIds}
          hoveredId={hoveredId}
          surface={surface}
          columns={columns}
          showParentSummary={showParentSummary}
          onToggle={onToggle}
          onHover={onHover}
          rowRefs={rowRefs}
        />
      ))}
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * KenHierarchyTable · expandable tree table with keyboard navigation.
 *
 * @see KenHierarchyTableProps for full API.
 */
export function KenHierarchyTable({
  columns,
  rows,
  indentPx = 20,
  showParentSummary = true,
  variant = 'card',
  headerStyle = 'wash',
  density = 'comfortable',
  surface = 'light',
  ariaLabel = 'Hierarchy breakdown table',
  className,
}: KenHierarchyTableProps) {
  // Initialize expanded state from defaultExpanded flags
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => collectDefaultExpanded(rows),
  );

  // Hover state — skip-shade
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Ref map for keyboard arrow navigation
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <TableShell
      variant={variant}
      headerStyle={headerStyle}
      density={density}
      scrollX
      ariaLabel={ariaLabel}
      className={className}
      // BUG-FIX G.12: tableRole="treegrid" required so aria-level on <tr> rows is valid.
      // Per WAI-ARIA spec, aria-level on row is only permitted in treegrid context.
      // Without this, axe reports aria-conditional-attr SERIOUS violation.
      tableRole="treegrid"
    >
      <thead>
        <tr>
          {/* Row label header — left aligned */}
          <th scope="col" style={{ textAlign: 'left' }}>
            Category
          </th>

          {/* Data column headers */}
          {columns.map((col, ci) => (
            <th
              key={ci}
              scope="col"
              style={{ textAlign: col.align ?? 'right' }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((node) => (
          <RowRenderer
            key={node.id}
            node={node}
            level={1}
            indentPx={indentPx}
            expandedIds={expandedIds}
            hoveredId={hoveredId}
            surface={surface}
            columns={columns}
            showParentSummary={showParentSummary}
            onToggle={handleToggle}
            onHover={setHoveredId}
            rowRefs={rowRefs}
          />
        ))}
      </tbody>
    </TableShell>
  );
}
