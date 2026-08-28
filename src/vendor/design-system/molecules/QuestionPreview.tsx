/**
 * QuestionPreview
 *
 * WHY · Survey builder and survey detail pages need a live-interactive card that previews
 *        exactly how a question will appear to respondents. Static mockups mislead — this
 *        molecule renders real interactive controls (radio, checkbox, text, rating, number,
 *        dropdown) so designers and admins see true respondent UX.
 * WHAT · Card with question number + text + required indicator → question type badge →
 *        type-specific interactive input (radio | checkbox | text | rating stars | number
 *        | dropdown). All inputs are locally stateful. Props: number, question, type
 *        (QuestionType), options (string[]), required, className.
 * WHEN · In survey detail views, survey builder preview panels, and the DS component
 *        sample page for the Surveys pillar. One QuestionPreview per question.
 * WHEN NOT · Don't use in the actual survey submission form — this is a preview/admin UI.
 *             Don't use when question type is unknown; it must be one of the 6 supported types.
 * WHERE · Surveys pillar (no current project consumer · DS sample page only)
 * HOW ·
 *   ```tsx
 *   <QuestionPreview
 *     number={1}
 *     question="Which region are you purchasing for?"
 *     type="multiple-choice"
 *     options={["Asia Pacific", "North America", "Europe", "Other"]}
 *     required
 *   />
 *   ```
 *
 * @reusabilityScore 2     // Surveys pillar only
 * @a11y_status pending-review  // star buttons have aria-label; radio/checkbox are buttons not inputs
 * @lifecycle beta
 * @promotedFrom core-v2 native
 */
import { useState } from 'react';
import { CircleDot, CheckSquare, AlignLeft, Star, Hash, ChevronDown, Check } from 'lucide-react';
import { Card } from '../atoms/Card';
import { iconColors } from '../atoms/iconColors';
import type { ReactNode } from 'react';

export type QuestionType = 'multiple-choice' | 'checkbox' | 'text' | 'rating' | 'number' | 'dropdown';

export interface QuestionPreviewProps {
  number: number;
  question: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
  className?: string;
}

const TYPE_CONFIG: Record<QuestionType, { icon: ReactNode; label: string }> = {
  'multiple-choice': { icon: <CircleDot size={12} />, label: 'Multiple Choice' },
  'checkbox': { icon: <CheckSquare size={12} />, label: 'Checkbox' },
  'text': { icon: <AlignLeft size={12} />, label: 'Free Text' },
  'rating': { icon: <Star size={12} />, label: 'Rating Scale' },
  'number': { icon: <Hash size={12} />, label: 'Numeric' },
  'dropdown': { icon: <ChevronDown size={12} />, label: 'Dropdown' },
};

export function QuestionPreview({ number, question, type, options, required, className }: QuestionPreviewProps) {
  const config = TYPE_CONFIG[type];

  // Interactive state
  const [selectedRadio, setSelectedRadio] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [textValue, setTextValue] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [numberValue, setNumberValue] = useState('');
  const [selectedDropdown, setSelectedDropdown] = useState<number | null>(null);

  const toggleCheckbox = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <Card data-component="QuestionPreview" padding="sm" className={`group ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-2">
        {/* Question number */}
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded"
          style={{
            backgroundColor: 'rgba(128, 108, 224, 0.08)',
            color: 'rgba(128, 108, 224, 1)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-black leading-snug" style={{ fontSize: 'var(--text-sm)' }}>
            {question}
            {required && (
              <span className="ml-0.5" style={{ color: 'rgba(176, 31, 36, 1)' }} aria-label="required">*</span>
            )}
          </p>
        </div>
      </div>

      {/* Type badge */}
      <div className="flex items-center gap-1.5 mb-2 ml-7" style={{ fontSize: 'var(--text-xs)', color: iconColors.utility }}>
        {config.icon}
        <span>{config.label}</span>
      </div>

      {/* Options preview — Multiple Choice (radio) */}
      {type === 'multiple-choice' && options && options.length > 0 && (
        <div className="ml-7 space-y-1">
          {options.map((opt, i) => {
            const isSelected = selectedRadio === i;
            return (
              <button
                key={i}
                type="button"
                className="flex items-center gap-2 w-full text-left cursor-pointer px-1.5 py-1 rounded transition-colors hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                style={{ fontSize: 'var(--text-xs)' }}
                onClick={() => setSelectedRadio(i)}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderColor: isSelected ? 'rgba(128, 108, 224, 1)' : 'rgba(0, 0, 0, 0.15)',
                    backgroundColor: isSelected ? 'rgba(128, 108, 224, 0.08)' : 'rgba(0, 0, 0, 0)',
                  }}
                >
                  {isSelected && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(128, 108, 224, 1)' }}
                    />
                  )}
                </span>
                <span style={{ color: isSelected ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)' }}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Options preview — Checkbox */}
      {type === 'checkbox' && options && options.length > 0 && (
        <div className="ml-7 space-y-1">
          {options.map((opt, i) => {
            const isChecked = checkedItems.has(i);
            return (
              <button
                key={i}
                type="button"
                className="flex items-center gap-2 w-full text-left cursor-pointer px-1.5 py-1 rounded transition-colors hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                style={{ fontSize: 'var(--text-xs)' }}
                onClick={() => toggleCheckbox(i)}
              >
                <span
                  className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center transition-colors"
                  style={{
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                    borderColor: isChecked ? 'rgba(128, 108, 224, 1)' : 'rgba(0, 0, 0, 0.15)',
                    borderRadius: 'var(--radius-inner, 2.5px)',
                    backgroundColor: isChecked ? 'rgba(128, 108, 224, 1)' : 'rgba(0, 0, 0, 0)',
                  }}
                >
                  {isChecked && (
                    <Check size={9} strokeWidth={3} style={{ color: 'rgba(255, 255, 255, 1)' }} />
                  )}
                </span>
                <span style={{ color: isChecked ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)' }}>
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Options preview — Dropdown */}
      {type === 'dropdown' && options && options.length > 0 && (
        <div className="ml-7 space-y-1">
          {options.map((opt, i) => {
            const isSelected = selectedDropdown === i;
            return (
              <button
                key={i}
                type="button"
                className="flex items-center gap-2 w-full text-left cursor-pointer px-1.5 py-1 rounded transition-colors hover:bg-black/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1"
                style={{ fontSize: 'var(--text-xs)' }}
                onClick={() => setSelectedDropdown(isSelected ? null : i)}
              >
                <span style={{ color: isSelected ? 'rgba(128, 108, 224, 1)' : 'rgba(0, 0, 0, 0.2)', fontSize: 'var(--text-xs)' }}>
                  {i + 1}.
                </span>
                <span style={{ color: isSelected ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.6)' }}>
                  {opt}
                </span>
                {isSelected && (
                  <Check size={10} strokeWidth={2.5} style={{ color: 'rgba(128, 108, 224, 1)', marginLeft: 'auto' }} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Text input — live editable */}
      {type === 'text' && (
        <textarea
          className="ml-7 mt-1 px-3 py-2 rounded w-[calc(100%-1.75rem)] resize-none transition-colors"
          style={{
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: textValue ? 'rgba(128, 108, 224, 0.4)' : 'rgba(0, 0, 0, 0.08)',
            backgroundColor: textValue ? 'rgba(128, 108, 224, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            fontSize: 'var(--text-xs)',
            color: 'rgba(0, 0, 0, 0.8)',
            outline: 'none',
            minHeight: '60px',
          }}
          placeholder="Type your answer here..."
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(128, 108, 224, 0.6)';
            e.currentTarget.style.backgroundColor = 'rgba(128, 108, 224, 0.03)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = textValue ? 'rgba(128, 108, 224, 0.4)' : 'rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.backgroundColor = textValue ? 'rgba(128, 108, 224, 0.02)' : 'rgba(0, 0, 0, 0.02)';
          }}
        />
      )}

      {/* Rating scale — clickable stars */}
      {type === 'rating' && (
        <div className="ml-7 flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoverRating || rating);
            return (
              <button
                key={star}
                type="button"
                className="cursor-pointer p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
                style={{ background: 'rgba(0, 0, 0, 0)' }}
                onClick={() => setRating(star === rating ? 0 : star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  size={18}
                  strokeWidth={1.5}
                  style={{
                    color: isFilled ? 'rgba(234, 179, 8, 1)' : 'rgba(0, 0, 0, 0.15)',
                    fill: isFilled ? 'rgba(234, 179, 8, 1)' : 'rgba(0, 0, 0, 0)',
                  }}
                  className="transition-colors"
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2" style={{ fontSize: 'var(--text-xs)', color: 'rgba(0, 0, 0, 0.4)' }}>
              {rating}/5
            </span>
          )}
        </div>
      )}

      {/* Number input — live editable */}
      {type === 'number' && (
        <div className="ml-7 mt-1 inline-flex items-center gap-1">
          <input
            type="number"
            className="px-3 py-1.5 rounded transition-colors"
            style={{
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: numberValue ? 'rgba(128, 108, 224, 0.4)' : 'rgba(0, 0, 0, 0.08)',
              backgroundColor: numberValue ? 'rgba(128, 108, 224, 0.02)' : 'rgba(0, 0, 0, 0.02)',
              fontSize: 'var(--text-xs)',
              color: 'rgba(0, 0, 0, 0.8)',
              outline: 'none',
              minWidth: '80px',
              maxWidth: '120px',
            }}
            placeholder="0"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(128, 108, 224, 0.6)';
              e.currentTarget.style.backgroundColor = 'rgba(128, 108, 224, 0.03)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = numberValue ? 'rgba(128, 108, 224, 0.4)' : 'rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.backgroundColor = numberValue ? 'rgba(128, 108, 224, 0.02)' : 'rgba(0, 0, 0, 0.02)';
            }}
          />
        </div>
      )}
    </Card>
  );
}
