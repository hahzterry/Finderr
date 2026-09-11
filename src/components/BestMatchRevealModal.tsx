import React, { useEffect } from 'react';
import { Sparkles, Check, AlertTriangle, Heart, ArrowRight, X, Bus, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PropertyMatchResult } from '../types';

interface BestMatchRevealModalProps {
  matchResult: PropertyMatchResult;
  onSaveToMatches: () => void;
  onClose: () => void;
  onViewFullDetails: () => void;
}

export const BestMatchRevealModal: React.FC<BestMatchRevealModalProps> = ({
  matchResult,
  onSaveToMatches,
  onClose,
  onViewFullDetails
}) => {
  const { property, score } = matchResult;

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#059669', '#2563eb', '#f59e0b']
      });
    } catch {
      // safe fallback if canvas-confetti is unavailable
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden relative my-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Image with Overlay */}
        <div className="relative h-60 w-full bg-stone-100 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Magical Match Announcement */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-stone-900 text-xs font-bold shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>We think we found your match.</span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-baseline justify-between mb-1">
              <span className="font-display text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight drop-shadow-sm">
                {score}% MATCH
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold font-display">€{property.monthlyRent}</span>
                <span className="text-xs text-stone-300">/month</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{property.area.split('(')[0].trim()}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Bus className="w-3.5 h-3.5 text-amber-400" />
                <span>{property.commuteMinutes} min to DCU</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Why it fits you */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2.5">
              Why it fits you
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Within budget (€{property.monthlyRent}/month vs €900 target)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Quiet household ({property.quietnessScore}/100 quietness rating)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Bright room with abundant natural daylight ({property.naturalLightScore}/100)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Solid study desk included for coursework</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Direct bus route to DCU in under 30 minutes</span>
              </div>
            </div>
          </div>

          {/* The Trade-Off */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>The trade-off</span>
            </h4>
            <p className="text-xs text-amber-950 font-medium">
              ⚠️ {property.tradeOff || 'Kitchen is slightly smaller than average'}
            </p>
          </div>

          {/* Finderr's Take */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
              Finderr’s take
            </h5>
            <p className="text-stone-700 text-xs italic leading-relaxed">
              “You’re giving up some kitchen space, but this strongly matches what you’ve consistently chosen: quietness, natural light and a manageable commute.”
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={onSaveToMatches}
              className="w-full sm:flex-1 py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white stroke-none" />
              <span>Save to My Matches</span>
            </button>

            <button
              onClick={onViewFullDetails}
              className="w-full sm:w-auto py-3.5 px-4 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
