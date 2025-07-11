import React, { useState, useEffect } from 'react';

const motivationalQuotes = [
  "The groundwork for all happiness is good health. — Leigh Hunt",
  "Success isn't always about greatness. It's about consistency. — Dwayne Johnson",
  "The body achieves what the mind believes. — Napoleon Hill",
  "Take care of your body. It's the only place you have to live. — Jim Rohn",
  "Exercise is a celebration of what your body can do. Not a punishment for what you ate.",
  "Your only limit is you. Push past it.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "Don't wish for a good body, work for it.",
  "Champions train, losers complain.",
  "No pain, no gain. Shut up and train.",
  "Fall seven times, stand up eight. — Japanese Proverb",
  "If you want something you've never had, you must be willing to do something you've never done.",
  "The only bad workout is the one that didn't happen.",
  "Discipline is choosing between what you want now and what you want most."
];

export const QuoteTicker: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(motivationalQuotes[currentQuoteIndex]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-glass/90 backdrop-blur-glass border-t border-glass-border shadow-elevated z-40">
      <div className="relative overflow-hidden h-16">
        <div 
          className="flex items-center h-full px-6 cursor-pointer transition-all duration-300 hover:bg-glass/50"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={handleCopyQuote}
          title="Click to copy quote"
        >
          <div className="flex items-center gap-3 w-full">
            <img 
              src="/lovable-uploads/7efaaa9c-effc-4d82-a2ac-e0998cbe814d.png" 
              alt="Dumbbell" 
              className="w-6 h-6 flex-shrink-0"
            />
            
            <div className="flex-1 relative overflow-hidden">
              <div 
                className={`whitespace-nowrap transition-all duration-1000 ease-in-out ${
                  isPaused ? 'transform-none' : 'animate-scroll-left'
                }`}
                style={{
                  transform: isPaused ? 'translateX(0)' : undefined
                }}
              >
                <span className="text-sm font-medium text-accent mr-8">
                  💪 {motivationalQuotes[currentQuoteIndex]}
                </span>
                <span className="text-sm font-medium text-accent mr-8">
                  💪 {motivationalQuotes[(currentQuoteIndex + 1) % motivationalQuotes.length]}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground flex-shrink-0">
              {isPaused ? 'Click to copy' : 'Hover to pause'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};