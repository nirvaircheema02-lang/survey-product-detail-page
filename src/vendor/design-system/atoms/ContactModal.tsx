import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ContactModal — full-screen overlay form for lead capture.
 *
 * WHY: FinalCTASection and high-intent CTAs need lightweight contact-form modal w/o full route navigation.
 * WHAT: Backdrop overlay + centered form card · name/email/company/message fields · close button.
 * WHEN: Final CTA · "Talk to analyst" CTAs · custom-research triggers.
 * WHEN NOT: Multi-step lead capture (use full route + react-hook-form + zod) · contact-info display (use static block).
 * HOW: Controlled by parent (`isOpen` + `onClose`) · uses native HTML form · accessible via Escape + focus trap (basic).
 *
 * @promotedFrom Design_system_vs_26 OG (DS Port Batch 8, 2026-05-13)
 */
export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Replace with actual API call
    // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSuccess(true);
    setIsSubmitting(false);
    
    // Reset form and close modal after success
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', message: '' });
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      data-component="ContactModal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-[10px] max-w-[500px] w-full p-6 md:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-black/40 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 rounded"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 id="modal-title" className="text-2xl font-medium mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Thank you!
            </h3>
            <p className="text-black/70" style={{ fontSize: 'var(--text-sm)' }}>
              We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          /* Form State */
          <>
            <h3 id="modal-title" className="text-2xl font-medium mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Get in Touch
            </h3>
            <p className="text-black/70 mb-6" style={{ fontSize: 'var(--text-sm)' }}>
              Tell us about your project and we'll respond within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-black font-medium mb-2" 
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus-visible:border-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 transition-colors duration-150"
                  placeholder="Your name"
                  style={{ fontSize: 'var(--text-sm)' }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-black font-medium mb-2"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus-visible:border-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 transition-colors duration-150"
                  placeholder="your@email.com"
                  style={{ fontSize: 'var(--text-sm)' }}
                />
              </div>

              {/* Company Field */}
              <div>
                <label 
                  htmlFor="company" 
                  className="block text-black font-medium mb-2"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus-visible:border-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 transition-colors duration-150"
                  placeholder="Your company"
                  style={{ fontSize: 'var(--text-sm)' }}
                />
              </div>

              {/* Message Field */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block text-black font-medium mb-2"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-black/10 rounded-[5px] bg-white text-black/90 placeholder:text-black/30 hover:border-black/25 focus-visible:border-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-1 resize-none transition-colors duration-150"
                  placeholder="Tell us about your project..."
                  style={{ fontSize: 'var(--text-sm)' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3.5 bg-black text-white rounded-[5px] font-medium hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontSize: 'var(--text-sm)' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="none" 
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}