'use client';

/**
 * MindMap — Interactive D3 hierarchy tree organism
 *
 * WHAT: SVG-based interactive mind map powered by d3-hierarchy + d3-zoom + d3-transition.
 *       Renders a collapsible, expandable node tree with animated transitions. Supports two
 *       interaction modes: 'full' (pan/zoom/click) and 'preview' (static view, click fires
 *       onNodeClick callback).
 *
 * WHY: Report PDP Scope + Taxonomy chapters require a visual D3 hierarchy instead of
 *      flat bullet lists. V0.3 regression was invented flat-list substitutes — this
 *      organism prevents regression by shipping the canonical D3 engine.
 *
 * WHEN: Use inside ScopeOfReport (interactionMode="preview") or MindMapModal
 *       (interactionMode="full"). Also used by TaxonomyTree organism.
 *
 * WHEN NOT: Not for simple navigation trees or static outlines. Do not use for
 *           <5 total nodes (plain list is clearer). Do not use inside modals smaller
 *           than 80vw × 80vh — needs space to pan/zoom.
 *
 * WHERE: core-v2/src/organisms/MindMap.tsx
 *        Canonical source: V0.2-for-ds MindMap.tsx:1-386
 *
 * HOW: Renders an <svg> containing a <g> element. d3.hierarchy() computes layout.
 *      d3-zoom wires pan+zoom in 'full' mode. Nodes animate enter/update/exit via
 *      D3 transitions (800ms easeCubicInOut). Each node pill: white rect + label text
 *      + optional child-count badge. Bezier curve links connect parent→child edges.
 *      Reduced motion: useReducedMotion() shortens D3 transition to 0ms.
 *
 * A11Y: role="img" + aria-label on <svg>. <title> + <desc> children for screen
 *       readers. Each node <g> gets tabIndex + role="button" + aria-label via D3
 *       selection. Tab moves between nodes; Enter/Space activates click handler.
 *
 * MOTION: D3 transitions (800ms → 0ms reduced). Zoom transitions in 'full' mode.
 *         Framer useReducedMotion() controls duration. No CSS animation.
 *
 * D3 DEPS: d3-hierarchy · d3-zoom · d3-selection · d3-transition · d3-ease
 *          (all installed in core-v2 package.json as of Batch 3.2c 2026-05-19)
 *
 * @promotedFrom V0.2-for-ds src/app/components/MindMap.tsx (DS Port Batch 3.2c · 2026-05-19)
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { hierarchy, tree, type HierarchyNode, type HierarchyLink } from 'd3-hierarchy';
import { zoom, zoomIdentity, type ZoomBehavior } from 'd3-zoom';
import { select, type Selection } from 'd3-selection';
import 'd3-transition'; // augments Selection with .transition()
import { easeCubicInOut } from 'd3-ease';
import { useReducedMotion } from 'framer-motion';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Tree node shape — recursive. Children hidden in _children when collapsed. */
export interface MindMapNode {
  /** Display label for the node */
  name: string;
  /** Visible children (expanded state) */
  children?: MindMapNode[];
  /** Hidden children (collapsed state) */
  _children?: MindMapNode[];
}

/**
 * Extended D3 HierarchyNode with collapse state + position cache.
 * Uses type assertion approach (not interface extends) to avoid TS covariance issue
 * with `children?: this[]` in HierarchyNode<T>.
 */
export type MindMapHierarchyNode = HierarchyNode<MindMapNode> & {
  x0?: number;
  y0?: number;
  _children?: MindMapHierarchyNode[];
  children?: MindMapHierarchyNode[];
  id?: string;
};

export interface MindMapProps {
  /**
   * Root node data — hierarchical tree structure.
   * The root name becomes the dark "start" node.
   */
  data: MindMapNode;
  /**
   * Current search term — matching node labels get highlight fill.
   * Pass empty string to disable search highlight.
   */
  searchTerm: string;
  /**
   * Callback when any node is clicked. Receives the node's display name.
   */
  onNodeClick: (name: string) => void;
  /**
   * Interaction mode:
   * - 'full'    — pan+zoom enabled via d3-zoom · nodes animate to center on click
   * - 'preview' — zoom disabled · click callback fires for parent (e.g. open modal)
   * @default 'full'
   */
  interactionMode?: 'full' | 'preview';
  /**
   * Accessible label for the SVG root element.
   * @default 'Interactive mind map'
   */
  ariaLabel?: string;
  /**
   * Optional accessible description for screen readers (<desc> element).
   */
  ariaDescription?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate stable unique ID from node ancestry path */
function getNodeId(d: MindMapHierarchyNode): string {
  let id = d.data.name;
  let curr: MindMapHierarchyNode = d;
  while (curr.parent) {
    curr = curr.parent as MindMapHierarchyNode;
    id = `${curr.data.name} > ${id}`;
  }
  return id;
}

/** Count visible or hidden children */
function getChildCount(d: MindMapHierarchyNode): number {
  const children = d.children || d._children;
  return children ? children.length : 0;
}

/** Bezier curve path from source right-edge to target left-edge */
function diagonal(
  s: { x: number; y: number; data: MindMapNode },
  t: { x: number; y: number },
): string {
  const count = s.data.children
    ? s.data.children.length
    : (s.data._children ? s.data._children.length : 0);
  const badgeWidth = count > 0 ? String(count).length * 7 + 25 : 0;
  const gapBadge = count > 0 ? 8 : 0;
  const startXOffset = s.data.name.length * 7.5 + 32 + gapBadge + badgeWidth;

  const sx = s.y + startXOffset;
  const sy = s.x;
  const tx = t.y - 16;
  const ty = t.x;
  const midX = (sx + tx) / 2;

  return `M ${sx},${sy} C ${midX},${sy} ${midX},${ty} ${tx},${ty}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function MindMap({
  data,
  searchTerm,
  onNodeClick,
  interactionMode = 'full',
  ariaLabel = 'Interactive mind map',
  ariaDescription,
}: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const rootRef = useRef<MindMapHierarchyNode | null>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Honour system reduced-motion — shorten D3 transitions to 0ms
  const prefersReducedMotion = useReducedMotion();
  const DURATION = prefersReducedMotion ? 0 : 800;

  // ── Build hierarchy once when data changes ───────────────────────────────
  useEffect(() => {
    const root = hierarchy(data) as MindMapHierarchyNode;
    root.x0 = 0;
    root.y0 = 0;

    function collapse(d: MindMapHierarchyNode) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = undefined;
      }
    }

    // Collapse all except root children
    if (root.children) {
      root.children.forEach(collapse);
    }

    rootRef.current = root;
  }, [data]);

  // ── Core D3 render + update ──────────────────────────────────────────────
  const renderUpdate = useCallback(() => {
    if (!svgRef.current || !rootRef.current) return;

    const svgEl = svgRef.current;
    const width = svgEl.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800);
    const height = svgEl.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 600);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svgSel: Selection<SVGSVGElement, unknown, null, undefined> = select(svgEl) as any;
    let g: Selection<SVGGElement, unknown, null, undefined>;

    if (gRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      g = select(gRef.current) as any;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      g = (svgSel as any).append('g');
      gRef.current = (g as unknown as { node(): SVGGElement }).node();

      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (g as any).attr('transform', event.transform);
        });

      zoomRef.current = zoomBehavior;

      if (interactionMode === 'full') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (svgSel as any).call(zoomBehavior);
      }

      const initialTransform = interactionMode === 'preview'
        ? zoomIdentity.translate(width / 2 - 300, height / 2).scale(0.85)
        : zoomIdentity.translate(width / 5, height / 2).scale(0.8);

      if (interactionMode === 'full') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (svgSel as any).call(zoomBehavior.transform, initialTransform);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (g as any).attr('transform', initialTransform.toString());
      }
    }

    const treeLayout = tree<MindMapNode>().nodeSize([66, 360]);

    function focusNode(d: MindMapHierarchyNode) {
      if (!zoomRef.current || !svgEl || interactionMode !== 'full') return;
      const targetScale = d.depth === 0 ? 0.7 : 0.85;
      const targetX = svgEl.clientWidth / 4;
      const targetY = svgEl.clientHeight / 2;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (select(svgEl) as any)
        .transition()
        .duration(DURATION)
        .ease(easeCubicInOut)
        .call(
          zoomRef.current.transform,
          zoomIdentity
            .translate(targetX, targetY)
            .scale(targetScale)
            .translate(-(d.y ?? 0), -(d.x ?? 0)),
        );
    }

    function update(source: MindMapHierarchyNode) {
      const root = rootRef.current!;
      const treeData = treeLayout(root);
      const nodes = treeData.descendants() as MindMapHierarchyNode[];
      const links = treeData.links() as HierarchyLink<MindMapNode>[];

      // Custom depth→y spacing
      nodes.forEach((d) => {
        if (d.depth === 0) d.y = 0;
        else if (d.depth === 1) d.y = 360;
        else if (d.depth === 2) d.y = 720;
        else d.y = 720 + (d.depth - 2) * 360 + 60;
      });

      // ── NODES ──────────────────────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodesSel = (g as any).selectAll('g.node')
        .data(nodes, (d: MindMapHierarchyNode) => d.id ?? (d.id = getNodeId(d)));

      const nodeEnter = nodesSel.enter().append('g')
        .attr('class', 'node')
        .attr('role', 'button')
        .attr('tabindex', '0')
        .attr('aria-label', (d: MindMapHierarchyNode) =>
          `${d.data.name}${getChildCount(d) > 0 ? `, ${getChildCount(d)} subcategories` : ''}`)
        .attr('transform', () =>
          `translate(${source.y0 ?? source.y ?? 0},${source.x0 ?? source.x ?? 0})`)
        .style('cursor', (d: MindMapHierarchyNode) =>
          (d.children || d._children) ? 'pointer' : 'default')
        .on('click', (_event: MouseEvent, d: MindMapHierarchyNode) => {
          const id = getNodeId(d);
          setActiveNodeId(id);
          onNodeClick(d.data.name);

          if (d.children || d._children) {
            if (d.parent) {
              (d.parent as MindMapHierarchyNode).children?.forEach((sibling) => {
                if (sibling !== d && sibling.children) {
                  sibling._children = sibling.children;
                  sibling.children = undefined;
                }
              });
            }
            if (d.depth === 0) {
              if (d._children) { d.children = d._children; d._children = undefined; }
            } else {
              if (d.children) { d._children = d.children; d.children = undefined; }
              else if (d._children) { d.children = d._children; d._children = undefined; }
            }
          }

          update(d);
          focusNode(d);
        })
        .on('keydown', (event: KeyboardEvent, d: MindMapHierarchyNode) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // Re-trigger click logic
            const id = getNodeId(d);
            setActiveNodeId(id);
            onNodeClick(d.data.name);

            if (d.children || d._children) {
              if (d.parent) {
                (d.parent as MindMapHierarchyNode).children?.forEach((sibling) => {
                  if (sibling !== d && sibling.children) {
                    sibling._children = sibling.children;
                    sibling.children = undefined;
                  }
                });
              }
              if (d.depth === 0) {
                if (d._children) { d.children = d._children; d._children = undefined; }
              } else {
                if (d.children) { d._children = d.children; d.children = undefined; }
                else if (d._children) { d.children = d._children; d._children = undefined; }
              }
            }

            update(d);
            focusNode(d);
          }
        });

      // Node background pill
      nodeEnter.append('rect')
        .attr('class', 'pill')
        .attr('rx', 10).attr('ry', 10)
        .attr('y', -18).attr('x', -16)
        .attr('height', 36)
        .style('fill', '#ffffff')
        .style('stroke', 'var(--black-200)');

      // Label text
      nodeEnter.append('text')
        .attr('class', 'node-label')
        .attr('dy', '4').attr('x', 0)
        .attr('text-anchor', 'start')
        .text((d: MindMapHierarchyNode) => d.data.name)
        .style('font-size', '13px')
        .style('font-family', 'var(--font-sans)')
        .style('fill', 'var(--black-900)');

      // Badge group
      const badge = nodeEnter.append('g')
        .attr('class', 'badge-group')
        .style('display', (d: MindMapHierarchyNode) => getChildCount(d) > 0 ? 'block' : 'none');

      badge.append('rect')
        .attr('class', 'badge-bg')
        .attr('rx', 10).attr('ry', 10)
        .attr('height', 20).attr('y', -10);

      badge.append('text')
        .attr('class', 'badge-text')
        .attr('dy', '4')
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', '700');

      const nodeUpdate = nodeEnter.merge(nodesSel);

      nodeUpdate.transition()
        .duration(DURATION)
        .ease(easeCubicInOut)
        .attr('transform', (d: MindMapHierarchyNode) =>
          `translate(${d.y ?? 0},${d.x ?? 0})`);

      nodeUpdate.select('rect.pill')
        .attr('width', (d: MindMapHierarchyNode) => {
          const count = getChildCount(d);
          const badgeW = count > 0 ? 35 : 0;
          const gap = count > 0 ? 8 : 0;
          return d.data.name.length * 7.5 + 32 + gap + badgeW;
        })
        .style('fill', (d: MindMapHierarchyNode) => {
          if (d.depth === 0) return 'var(--black-900)';
          const isMatch = searchTerm && d.data.name.toLowerCase().includes(searchTerm.toLowerCase());
          return isMatch ? 'var(--black-100)' : '#ffffff';
        })
        .style('stroke', (d: MindMapHierarchyNode) => {
          const isMatch = searchTerm && d.data.name.toLowerCase().includes(searchTerm.toLowerCase());
          const id = getNodeId(d);
          if (isMatch || id === activeNodeId) return 'var(--black-900)';
          return d.children ? 'var(--black-600)' : 'var(--black-200)';
        })
        .style('stroke-width', (d: MindMapHierarchyNode) =>
          getNodeId(d) === activeNodeId ? '2px' : '1px');

      nodeUpdate.select('text.node-label')
        .style('fill', (d: MindMapHierarchyNode) =>
          d.depth === 0 ? '#ffffff' : 'var(--black-900)')
        .style('font-weight', (d: MindMapHierarchyNode) =>
          (d.depth === 0 || d.children || getNodeId(d) === activeNodeId) ? '600' : '500');

      nodeUpdate.select('g.badge-group')
        .attr('transform', (d: MindMapHierarchyNode) =>
          `translate(${d.data.name.length * 7.5 + 16}, 0)`)
        .style('display', (d: MindMapHierarchyNode) =>
          getChildCount(d) > 0 ? 'block' : 'none');

      nodeUpdate.select('rect.badge-bg')
        .attr('width', (d: MindMapHierarchyNode) =>
          String(getChildCount(d)).length * 7 + 16)
        .style('fill', (d: MindMapHierarchyNode) => {
          if (d.depth === 0) return 'rgba(255,255,255,0.2)';
          if (getNodeId(d) === activeNodeId) return 'var(--black-900)';
          return 'var(--black-100)';
        });

      nodeUpdate.select('text.badge-text')
        .attr('x', (d: MindMapHierarchyNode) =>
          (String(getChildCount(d)).length * 7 + 16) / 2)
        .text((d: MindMapHierarchyNode) => getChildCount(d))
        .style('fill', (d: MindMapHierarchyNode) =>
          (d.depth === 0 || getNodeId(d) === activeNodeId) ? '#ffffff' : 'var(--black-500)');

      // Exit
      const nodeExit = nodesSel.exit()
        .transition()
        .duration(DURATION)
        .ease(easeCubicInOut)
        .attr('transform', () =>
          `translate(${source.y ?? 0},${source.x ?? 0})`)
        .remove();

      nodeExit.select('rect').attr('width', 0);

      // ── LINKS ──────────────────────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const linkSel = (g as any).selectAll('path.link')
        .data(links, (d: HierarchyLink<MindMapNode> & { target?: MindMapHierarchyNode }) =>
          (d.target as MindMapHierarchyNode).id ?? getNodeId(d.target as MindMapHierarchyNode)
        );

      const linkEnter = linkSel.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', 'var(--black-300)')
        .attr('stroke-width', '2')
        .attr('d', () => {
          const sx = source.y0 ?? source.y ?? 0;
          const sy = source.x0 ?? source.x ?? 0;
          const o = { x: sy, y: sx, data: source.data };
          return diagonal(o, o);
        });

      linkEnter.merge(linkSel)
        .attr('fill', 'none')
        .attr('stroke', 'var(--black-300)')
        .attr('stroke-width', '2')
        .transition()
        .duration(DURATION)
        .ease(easeCubicInOut)
        .attr('d', (d: HierarchyLink<MindMapNode>) => diagonal(
          d.source as { x: number; y: number; data: MindMapNode },
          d.target as { x: number; y: number },
        ));

      linkSel.exit()
        .transition()
        .duration(DURATION)
        .ease(easeCubicInOut)
        .attr('d', () => {
          const sx = source.y ?? 0;
          const sy = source.x ?? 0;
          const o = { x: sy, y: sx, data: source.data };
          return diagonal(o, o);
        })
        .attr('fill', 'none')
        .remove();

      // Cache positions
      nodes.forEach((d) => { d.x0 = d.x; d.y0 = d.y; });
    }

    update(rootRef.current!);
  }, [searchTerm, activeNodeId, interactionMode, DURATION, onNodeClick]);

  useEffect(() => {
    renderUpdate();
  }, [renderUpdate]);

  return (
    <div
      className={[
        'w-full h-full bg-white',
        interactionMode === 'full' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
      ].join(' ')}
    >
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible"
        role="img"
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? 'mindmap-desc' : undefined}
      >
        <title>{ariaLabel}</title>
        {ariaDescription && (
          <desc id="mindmap-desc">{ariaDescription}</desc>
        )}
      </svg>
    </div>
  );
}

export default MindMap;
