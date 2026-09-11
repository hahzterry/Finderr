import React from 'react';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden py-8 sm:py-16 px-4 sm:px-6">
      {/* Subtle warm background accents */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 -z-10 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Stop searching. Start matching.</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] mb-6 max-w-2xl mx-auto"
        >
          Find somewhere that fits your life.
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 text-lg sm:text-xl font-normal max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Tell NestMate what matters to you. We’ll learn your preferences and help you find homes that actually fit.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-lg rounded-2xl shadow-md shadow-amber-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Find my match</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-stone-500 font-medium">
            Powered by AI. Improved by your choices.
          </p>
        </motion.div>

        {/* Interactive Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-base mb-1">Visual Housing DNA</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Describe your lifestyle in plain words. We map your trade-offs across commute, quietness, and light.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-base mb-1">Learns What You Value</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When your swipe choices reveal hidden preferences, NestMate adapts your DNA and finds 96%+ matches.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-5 shadow-xs hover:border-amber-300 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900 text-base mb-1">Scam Shield Protection</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Deterministic rental risk filters catch urgency language, no-viewing traps, and deposit red flags.
            </p>
          </div>
        </motion.div>

        {/* Sneak peek banner */}
        <div className="mt-10 p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 max-w-xl mx-auto flex items-center gap-3 text-left">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-xs text-stone-700">
            <strong>Dublin Student Focus:</strong> Seeded with authentic housing options near DCU, Drumcondra, Glasnevin, and Phibsborough.
          </p>
        </div>
      </div>
    </div>
  );
};
