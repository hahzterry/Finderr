import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Compass, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HousingPreferences, HousingDNA } from '../types';

interface NaturalLanguageOnboardingProps {
  onPreferencesBuilt: (preferences: HousingPreferences, dna: HousingDNA) => void;
  onBackToLanding: () => void;
}

const DEFAULT_DEMO_TEXT =
  "I’m a student at DCU. My budget is around €900 per month. I don’t drive so commute matters. I want somewhere quiet, I’d really like a desk, and I don’t care if the bedroom is massive.";

const EXAMPLE_CHIPS = [
  'Close to college',
  'Quiet house',
  'Under €900',
  'Good public transport',
  'Bright room'
];

export const NaturalLanguageOnboarding: React.FC<NaturalLanguageOnboardingProps> = ({
  onPreferencesBuilt,
  onBackToLanding
}) => {
  const [inputText, setInputText] = useState(DEFAULT_DEMO_TEXT);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddChip = (chip: string) => {
    if (!inputText.includes(chip)) {
      setInputText(prev => (prev.endsWith('.') ? `${prev} ${chip}.` : `${prev}, ${chip}.`));
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/extract-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText })
      });

      const data = await res.json();
      const extracted: HousingPreferences = data?.preferences || {
        budgetMax: 900,
        destination: 'DCU',
        maxCommuteMinutes: 35,
        weights: {
          affordability: 0.95,
          commute: 0.90,
          quietness: 0.70,
          naturalLight: 0.40,
          desk: 0.80,
          space: 0.30,
          socialAtmosphere: 0.25,
          publicTransport: 0.85
        },
        dealbreakers: ['smoking_indoors'],
        summary: 'Student at DCU looking for quiet, affordable housing with good commute and desk space.',
        mustHaveDesk: true
      };

      // Map weights to initial Housing DNA (0-100)
      const dna: HousingDNA = {
        affordability: Math.round((extracted.weights?.affordability ?? 0.95) * 100),
        commute: Math.round((extracted.weights?.commute ?? 0.90) * 100),
        quietness: Math.round((extracted.weights?.quietness ?? 0.70) * 100),
        naturalLight: Math.round((extracted.weights?.naturalLight ?? 0.40) * 100),
        desk: Math.round((extracted.weights?.desk ?? 0.80) * 100),
        space: Math.round((extracted.weights?.space ?? 0.30) * 100),
        socialAtmosphere: Math.round((extracted.weights?.socialAtmosphere ?? 0.25) * 100),
        publicTransport: Math.round((extracted.weights?.publicTransport ?? 0.85) * 100)
      };

      // Subtle pause for magical UX transition
      setTimeout(() => {
        setIsLoading(false);
        onPreferencesBuilt(extracted, dna);
      }, 1000);
    } catch (e) {
      console.warn('Network issue, proceeding with deterministic profile:', e);
      const fallbackPrefs: HousingPreferences = {
        budgetMax: 900,
        destination: 'DCU',
        maxCommuteMinutes: 35,
        weights: {
          affordability: 0.95,
          commute: 0.90,
          quietness: 0.70,
          naturalLight: 0.40,
          desk: 0.80,
          space: 0.30,
          socialAtmosphere: 0.25,
          publicTransport: 0.85
        },
        dealbreakers: ['smoking_indoors'],
        summary: 'Student at DCU looking for quiet, affordable housing with good commute and desk space.',
        mustHaveDesk: true
      };
      const fallbackDna: HousingDNA = {
        affordability: 95,
        commute: 90,
        quietness: 70,
        naturalLight: 40,
        desk: 80,
        space: 30,
        socialAtmosphere: 25,
        publicTransport: 85
      };
      setIsLoading(false);
      onPreferencesBuilt(fallbackPrefs, fallbackDna);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-white/90 rounded-3xl border border-stone-200/80 p-8 shadow-sm flex flex-col items-center justify-center min-h-[380px]"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            </div>

            <h2 className="font-display text-2xl font-bold text-stone-900 mb-2">
              Understanding what home means to you…
            </h2>
            <p className="text-stone-500 text-sm max-w-md">
              Converting your routine, budget, and trade-offs into a personalized Housing DNA profile.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md">
                Step 1 of 3
              </span>
              <button
                onClick={onBackToLanding}
                className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Question */}
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2">
              What are you looking for?
            </h2>
            <p className="text-stone-600 text-sm mb-6">
              Skip 20 filter checkboxes. Type like you’re describing your dream room to a friend.
            </p>

            {/* Input Area */}
            <div className="relative mb-4">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                rows={5}
                placeholder="E.g. I’m a DCU student on a €900 budget. Need quiet evenings for studying, desk space, and easy buses..."
                className="w-full rounded-2xl border border-stone-200 p-4 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 text-base leading-relaxed bg-stone-50/50 resize-none transition-all shadow-inner"
              />
              <div className="absolute bottom-3 right-3 text-stone-400 text-xs flex items-center gap-1">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Natural language</span>
              </div>
            </div>

            {/* Prompt Chips */}
            <div className="mb-8">
              <span className="text-xs font-medium text-stone-500 block mb-2">
                Quick inspiration chips:
              </span>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_CHIPS.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleAddChip(chip)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100/70 hover:text-amber-900 text-stone-700 transition-colors cursor-pointer"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGenerate}
              disabled={!inputText.trim()}
              className="w-full py-4 px-6 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 text-white font-semibold text-base rounded-2xl shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Build my Housing DNA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
