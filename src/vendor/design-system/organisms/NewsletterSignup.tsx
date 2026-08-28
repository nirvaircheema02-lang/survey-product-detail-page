/**
 * NewsletterSignup — Organism (DS v4.3)
 *
 * WHAT: Newsletter/email subscription banner section.
 * WHY:  Lead capture — invites users to subscribe for weekly research digests.
 * WHEN: Report Store home page, near the bottom before final CTA.
 * HOW:  SectionWrapper(white) + centered form with email input + submit button.
 *
 * COLOR SYSTEM: Pure monochromatic black/opacity. Submit button uses CTA red.
 */
import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { SectionWrapper } from '../atoms/SectionWrapper';
import { Button } from '../atoms/Button';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setEmail(''); }, 3000);
    }
  };

  return (
    <SectionWrapper data-component="NewsletterSignup" background="white" spacing="lg" maxWidth="wide">
      <div
        className="max-w-[600px] mx-auto px-4 sm:px-6 md:px-8 text-center"
      >
        {/* Icon */}
        <div
          className="mx-auto mb-4 flex items-center justify-center"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.04)',
          }}
        >
          <Mail size={22} style={{ color: 'rgba(0,0,0,0.35)' }} />
        </div>

        {/* Heading */}
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--text-xl)',
            color: 'rgba(0,0,0,0.9)',
          }}
        >
          Weekly Research Digest
        </h3>
        <p
          className="mt-2 mx-auto"
          style={{
            fontSize: 'var(--text-sm)',
            color: 'rgba(0,0,0,0.45)',
            maxWidth: '400px',
            lineHeight: 1.5,
          }}
        >
          Get our top research picks, new report alerts, and market data highlights delivered every Tuesday.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex items-center gap-2 mx-auto"
          style={{ maxWidth: '420px' }}
        >
          <div
            className="flex-1 flex items-center gap-2 px-4 py-2.5"
            style={{
              borderRadius: 'var(--radius-element)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
          >
            <Mail size={14} style={{ color: 'rgba(0,0,0,0.25)', flexShrink: 0 }} />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 rounded-sm"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'rgba(0,0,0,0.8)',
              }}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            {...(submitted ? { icon: <Check size={14} /> } : { showArrow: true })}
            type="submit"
          >
            {submitted ? 'Subscribed' : 'Subscribe'}
          </Button>
        </form>

        {/* Privacy note */}
        <p
          className="mt-3"
          style={{ fontSize: '10px', color: 'rgba(0,0,0,0.25)' }}
        >
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </SectionWrapper>
  );
}