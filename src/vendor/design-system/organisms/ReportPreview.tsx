/**
 * ReportPreview — Organism (DS v4.3)
 *
 * WHAT: Single report preview/detail section showing table of contents + metadata.
 * WHY:  Gives users a detailed look at report contents before downloading/purchasing.
 * WHEN: Report detail page or expanded view from listing.
 * HOW:  Split layout: left (TOC + metadata), right (cover image + action buttons).
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity.
 */
import { FileText, Download, Share2, BookOpen, Globe, Calendar, Layers } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { IconBadge } from '../atoms/IconBadge';
import { ImageWithFallback } from '../atoms/ImageWithFallback';
import type { ReportItem } from '../types';

const DEFAULT_TOC = [
  'Executive Summary',
  'Market Overview & Definitions',
  'Market Sizing & Forecast (2026-2032)',
  'Competitive Landscape',
  'Technology Analysis',
  'Regional Breakdown',
  'Company Profiles (25 Companies)',
  'Strategic Recommendations',
  'Methodology & Data Sources',
];

export interface ReportPreviewProps {
  report: ReportItem;
  /** Table-of-contents entries · defaults to generic 9-section TOC */
  toc?: string[];
}

export function ReportPreview({ report, toc = DEFAULT_TOC }: ReportPreviewProps) {
  return (
    <SectionWrapper data-component="ReportPreview" background="white" spacing="lg" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: TOC + Metadata (3 cols) */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 mb-4">
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
                Report Store
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.2)' }}>/</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
                {report.industry}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.2)' }}>/</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.55)' }}>
                {report.subcat}
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'var(--text-2xl)',
                color: 'rgba(0,0,0,0.9)',
                lineHeight: 1.25,
              }}
            >
              {report.title}
            </h2>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="pill" size="sm" theme="neutral">{report.format || 'Full Report'}</Badge>
              <Badge variant="pill" size="sm" theme="neutral">{report.region}</Badge>
              <Badge variant="pill" size="sm" theme="neutral">{report.date}</Badge>
            </div>

            {/* Description */}
            {report.description && (
              <p
                className="mt-4"
                style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.55)', lineHeight: 1.6 }}
              >
                {report.description}
              </p>
            )}

            {/* Projection */}
            <div
              className="mt-6 p-4"
              style={{
                borderRadius: 'var(--radius-element)',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(0,0,0,0.06)',
              }}
            >
              <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
                Market Projection
              </span>
              <p
                className="mt-1 tabular-nums"
                style={{ fontSize: 'var(--text-lg)', color: 'rgba(0,0,0,0.85)' }}
              >
                {report.projection}
              </p>
            </div>

            {/* Table of Contents */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <IconBadge icon={BookOpen} size="xs" />
                <h4 style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.7)' }}>
                  Table of Contents
                </h4>
              </div>
              <div className="space-y-0">
                {toc.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 py-2.5 px-3"
                    style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'rgba(0,0,0,0.04)' }}
                  >
                    <span
                      className="tabular-nums flex-shrink-0"
                      style={{
                        fontSize: 'var(--text-xs)',
                        color: 'rgba(0,0,0,0.2)',
                        width: '20px',
                        textAlign: 'right',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(0,0,0,0.6)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image + Actions (2 cols) */}
          <div className="lg:col-span-2">
            <div className="sticky" style={{ top: '80px' }}>
              {/* Cover image */}
              <div
                className="overflow-hidden mb-4"
                style={{
                  borderRadius: 'var(--radius-element)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
              >
                <ImageWithFallback
                  src={report.image}
                  alt={report.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <Button variant="primary" size="md" className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2" icon={<Download size={16} />}>
                  Download Report
                </Button>
                <Button variant="secondary" size="md" className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2" icon={<FileText size={16} />}>
                  Request Sample
                </Button>
                <Button variant="ghost" size="sm" className="w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2" icon={<Share2 size={14} />}>
                  Share
                </Button>
              </div>

              {/* Quick meta */}
              <div
                className="mt-4 p-3 space-y-2"
                style={{
                  borderRadius: 'var(--radius-inner)',
                  backgroundColor: 'rgba(0,0,0,0.02)',
                }}
              >
                <div className="flex items-center gap-2">
                  <Globe size={12} style={{ color: 'rgba(0,0,0,0.3)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.5)' }}>
                    {report.region}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} style={{ color: 'rgba(0,0,0,0.3)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.5)' }}>
                    Published {report.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers size={12} style={{ color: 'rgba(0,0,0,0.3)' }} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.5)' }}>
                    {report.format || 'Full Report'} · 180 pages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}