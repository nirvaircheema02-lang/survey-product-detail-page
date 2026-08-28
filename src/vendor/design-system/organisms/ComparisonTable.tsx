/**
 * ComparisonTable — Organism (DS v4.3)
 *
 * WHAT: Report format comparison table (Full Report vs Market Brief vs Data Pack).
 * WHY:  Helps users understand what each report format includes before purchasing.
 * WHEN: Report Store home page or report detail page.
 * HOW:  SectionWrapper(warm) + responsive comparison table.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity. Check marks use green.
 */
import { Check, Minus } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { SectionHeading } from '../atoms/SectionHeading';
import { Badge } from '../atoms/Badge';

interface Feature {
  label: string;
  fullReport: boolean;
  marketBrief: boolean;
  dataPack: boolean;
}

const FEATURES: Feature[] = [
  { label: 'Executive Summary', fullReport: true, marketBrief: true, dataPack: false },
  { label: 'Market Sizing & Forecast', fullReport: true, marketBrief: true, dataPack: true },
  { label: 'Competitive Landscape', fullReport: true, marketBrief: false, dataPack: false },
  { label: 'Company Profiles (20+)', fullReport: true, marketBrief: false, dataPack: false },
  { label: 'Raw Data Tables (Excel)', fullReport: true, marketBrief: false, dataPack: true },
  { label: 'Methodology Appendix', fullReport: true, marketBrief: true, dataPack: false },
  { label: 'Regional Breakdown', fullReport: true, marketBrief: false, dataPack: true },
  { label: 'Analyst Consultation (1hr)', fullReport: true, marketBrief: false, dataPack: false },
];

const FORMATS = [
  { key: 'fullReport' as const, name: 'Full Report', price: '$4,500', recommended: true },
  { key: 'marketBrief' as const, name: 'Market Brief', price: '$1,200', recommended: false },
  { key: 'dataPack' as const, name: 'Data Pack', price: '$2,800', recommended: false },
];

export function ComparisonTable() {
  return (
    <SectionWrapper data-component="ComparisonTable" background="warm" spacing="lg" maxWidth="wide">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8">
        <SectionHeading
          label="Formats"
          title="Compare Report Types"
          subtitle="Choose the format that fits your research needs"
        />

        <div
          className="mt-8 overflow-x-auto"
          style={{ borderRadius: 'var(--radius-element)' }}
        >
          <table className="w-full" style={{ minWidth: '600px' }}>
            {/* Header */}
            <thead>
              <tr>
                <th
                  className="text-left px-4 py-3"
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'rgba(0,0,0,0.4)',
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: 'rgba(0,0,0,0.08)',
                  }}
                >
                  Feature
                </th>
                {FORMATS.map((fmt) => (
                  <th
                    key={fmt.key}
                    className="text-center px-4 py-3"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(0,0,0,0.8)',
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                      borderBottomColor: 'rgba(0,0,0,0.08)',
                      backgroundColor: fmt.recommended ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0)',
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{fmt.name}</span>
                      {fmt.recommended && (
                        <Badge variant="pill" size="xs" theme="purple">
                          Popular
                        </Badge>
                      )}
                      <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(0,0,0,0.35)' }}>
                        from {fmt.price}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {FEATURES.map((feature, idx) => (
                <tr key={idx}>
                  <td
                    className="px-4 py-3 text-left"
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'rgba(0,0,0,0.6)',
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                      borderBottomColor: 'rgba(0,0,0,0.04)',
                    }}
                  >
                    {feature.label}
                  </td>
                  {FORMATS.map((fmt) => {
                    const included = feature[fmt.key];
                    return (
                      <td
                        key={fmt.key}
                        className="px-4 py-3 text-center"
                        style={{
                          borderBottomWidth: '1px',
                          borderBottomStyle: 'solid',
                          borderBottomColor: 'rgba(0,0,0,0.04)',
                          backgroundColor: fmt.recommended ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0)',
                        }}
                      >
                        {included ? (
                          <Check size={16} style={{ color: 'rgba(34,139,34,0.7)' }} className="mx-auto" />
                        ) : (
                          <Minus size={16} style={{ color: 'rgba(0,0,0,0.15)' }} className="mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionWrapper>
  );
}