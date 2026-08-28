/**
 * ChallengesSection
 *
 * WHY · Case-study "key problem statements" need a horizontally scrollable card carousel that adapts
 *       to 1-5+ challenge count — static grid breaks or wastes space at edge counts.
 * WHAT · Horizontal scroll container with dynamic card widths (1→xl, 2→lg, 3→md, 4→4-fit, 5+→peek).
 *        Arrow-key keyboard nav · dot indicator navigation · scroll-to-card snap · fade gradients on edges.
 *        Props: `challenges[]` — each with number, title, questions[].
 * WHEN · Case-study pages displaying client problem statements / key challenge questions.
 * WHEN NOT · Listing pages (use `BrowseGrid`) · single challenge (use `Card` + text block) ·
 *            non-question content (use `ValuePillarsSection`).
 * WHERE · Case-study template — section 2 (warm bg · after ClientContextSection).
 * HOW ·
 *   ```tsx
 *   <ChallengesSection challenges={[
 *     { number: "01", title: "Market Sizing", questions: ["What is the TAM?", "..."] },
 *     { number: "02", title: "Competitive Gaps", questions: ["Who are tier-1 rivals?"] }
 *   ]} />
 *   ```
 *
 * @reusabilityScore 4
 * @a11y_status reviewed-AA
 * @lifecycle stable
 * @promotedFrom casestudy-templates/template-v3
 */
import { useRef, useEffect, useState } from 'react';

interface Challenge {
  number: string;
  title: string;
  questions: string[];
}

interface ChallengesSectionProps {
  challenges: Challenge[];
}

export function ChallengesSection({ challenges }: ChallengesSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Keyboard navigation for horizontal scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const cardWidth = container.firstElementChild?.clientWidth || 0;
      const gap = 24; // gap-6 = 24px
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  
  // Track scroll position for dot navigation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.firstElementChild?.clientWidth || 0;
      const gap = 24;
      const currentIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveCardIndex(Math.min(currentIndex, challenges.length - 1));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [challenges.length]);

  // Scroll to specific card
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 0;
    const gap = 24;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  };
  
  // Dynamic card width calculation
  const cardCount = challenges.length;
  let cardWidthClass = 'w-[85vw] sm:w-[380px]'; // Default for mobile
  let desktopCardWidth = 'lg:w-[380px]'; // Default
  
  // Desktop logic: Calculate based on number of cards
  if (cardCount <= 3) {
    // For 1-3 cards: Make them larger to fill space (responsive flex)
    desktopCardWidth = cardCount === 1 ? 'lg:w-[600px]' : cardCount === 2 ? 'lg:w-[420px]' : 'lg:w-[280px]';
  } else if (cardCount === 4) {
    // For exactly 4 cards: All visible at once (1000px / 4 = ~232px each with gaps)
    desktopCardWidth = 'lg:w-[calc((1000px-72px)/4)]'; // 1000px max-width minus gaps
  } else {
    // For 5+ cards: Show 4 full cards + partial 5th (1000px / 4.3 = ~216px each)
    desktopCardWidth = 'lg:w-[calc((1000px-72px)/4.3)]';
  }
  
  cardWidthClass = `w-[85vw] sm:w-[380px] ${desktopCardWidth}`;

  return (
    <section data-component="ChallengesSection" className="py-12 sm:py-16 md:py-20 overflow-hidden" style={{ background: 'var(--bg-warm)' }}>
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="font-medium text-black/40 uppercase tracking-[3px] mb-6 md:mb-8 block" style={{ fontSize: 'var(--text-nav)' }}>Challenges</span>
          
          <h2 className="leading-[1.15] font-light text-black tracking-tight mb-4 md:mb-6" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 4.5vw, var(--text-2xl))' }}>
            Key Problem Statements
          </h2>
          
          {/* Scroll Hint - Hidden on Mobile and when 4 or fewer cards on desktop */}
          <p className={`text-black/40 items-center gap-2 ${cardCount <= 4 ? 'hidden' : 'hidden sm:flex lg:flex'}`} style={{ fontSize: 'var(--text-xs)' }}>
            <span>Use arrow keys or scroll to explore</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Fade Gradient - Left - Hidden on Mobile and when all cards fit */}
        <div className={`absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none ${cardCount <= 4 ? 'lg:hidden' : ''}`} style={{ background: 'linear-gradient(to right, var(--bg-warm), transparent)' }} />

        {/* Fade Gradient - Right - Hidden on Mobile and when all cards fit */}
        <div className={`absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-10 pointer-events-none ${cardCount <= 4 ? 'lg:hidden' : ''}`} style={{ background: 'linear-gradient(to left, var(--bg-warm), transparent)' }} />

        {/* Scrollable Cards Container */}
        <div 
          className={`flex gap-4 md:gap-6 overflow-x-auto pb-4 px-4 sm:px-6 md:px-8 scroll-smooth scrollbar-hide snap-x snap-mandatory ${cardCount <= 4 ? 'lg:justify-center lg:overflow-x-visible' : ''}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          ref={scrollContainerRef}
        >
          {/* Add left padding spacer - Responsive - Only for 5+ cards on desktop */}
          {cardCount > 4 && <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-1000px)/2-32px)]" />}
          
          {challenges.map((challenge, index) => (
            <div 
              key={index} 
              tabIndex={0}
              role="article"
              aria-label={`Challenge ${index + 1}: ${challenge.title}`}
              className={`flex-shrink-0 ${cardWidthClass} bg-white border p-5 md:p-6 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 group snap-center`}
              style={{ 
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                borderRadius: 'var(--radius-element)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(128, 108, 224, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Card Header: Number + Index */}
              <div className="flex items-start justify-between mb-5 md:mb-6">
                <div 
                  className="font-light text-black/[0.08] group-hover:text-black/[0.12] transition-colors tracking-tight leading-none" 
                  style={{ fontFamily: 'var(--font-serif)', fontSize: cardCount >= 4 ? 'var(--text-3xl)' : 'var(--text-4xl)' }}
                >
                  {challenge.number}
                </div>
                
                {/* Card Index Indicator */}
                <div className="text-black/30 font-medium mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                  {index + 1} / {challenges.length}
                </div>
              </div>
              
              {/* Card Title */}
              <h3 className="font-medium text-black leading-[1.25] tracking-tight mb-5 md:mb-6" style={{ fontSize: cardCount >= 4 ? 'var(--text-base)' : 'var(--text-lg)' }}>
                {challenge.title}
              </h3>
              
              {/* Questions List */}
              <div className="space-y-3 md:space-y-4 border-t pt-5 md:pt-6" style={{ borderColor: 'var(--bg-warm-500)' }}>
                {challenge.questions.map((question, qIndex) => (
                  <div key={qIndex} className="flex items-start gap-2">
                    <span className="text-black/40 mt-[2px] flex-shrink-0 text-sm">→</span>
                    
                    {/* 
                      TYPOGRAPHY RATIONALE: Dynamic Question Sizing
                      - fontSize: 0.875rem (14px) for 4+ cards | var(--text-sm) (16px) for <4 cards
                      
                      WHY DYNAMIC SIZING:
                      1. Content-Aware Typography: Adapts to content density
                      2. Density Management:
                         - 4+ cards: Horizontal space is tight in 4-column grid
                         - <4 cards: Spacious layout allows larger, more comfortable text
                      3. Readability Balance:
                         - 14px (0.875rem): Minimum readable size for body text
                         - 16px (var(--text-sm)): Standard comfortable reading size
                      4. User Testing Result: 16px questions felt cramped in 4-card layouts
                      
                      DESIGN PATTERN:
                      This is "adaptive typography" - sizing based on layout density
                      Similar to responsive typography, but based on content count
                      
                      ALTERNATIVE CONSIDERED:
                      - Always use var(--text-sm): Makes 4+ card layouts feel dense
                      - Always use 0.875rem: Unnecessarily small for spacious 2-3 card layouts
                      
                      VERDICT: Keep dynamic sizing - it's a smart responsive feature
                      NOTE: Could create var(--text-compact) = 0.875rem in design system
                      See: /FONT_SIZE_RATIONALE_ANALYSIS.md - Section: Challenges
                    */}
                    <p className="leading-[1.5] text-black/70 group-hover:text-black/80 transition-colors" style={{ fontSize: cardCount >= 4 ? 'var(--text-compact)' : 'var(--text-sm)' }}>
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Add right padding spacer - Responsive - Only for 5+ cards on desktop */}
          {cardCount > 4 && <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-1000px)/2-32px)]" />}
        </div>
      </div>

      {/* Progress Indicator Dots - Hidden when all cards visible on desktop */}
      <div className={`max-w-[var(--container-content)] mx-auto px-4 sm:px-6 md:px-8 mt-6 md:mt-8 flex justify-center gap-2 ${cardCount <= 4 ? 'lg:hidden' : ''}`}>
        {challenges.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            aria-label={`Go to challenge ${index + 1}`}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 rounded-sm"
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeCardIndex === index
                  ? 'bg-black w-8 h-2'
                  : 'bg-black/20 hover:bg-black/40 w-2 h-2'
              }`}
            />
          </button>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}