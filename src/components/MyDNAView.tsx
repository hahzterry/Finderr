import React from 'react';
import { HousingPreferences, HousingDNA, SwipeInteraction } from '../types';
import { Sparkles, Brain, ArrowRight, Sun, VolumeX, Bus, Monitor, CheckCircle2, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

interface MyDNAViewProps {
  preferences: HousingPreferences;
  dna: HousingDNA;
  interactions: SwipeInteraction[];
  hasLearnedUpdates: boolean;
  onResetDemo: () => void;
}

export const MyDNAView: React.FC<MyDNAViewProps> = ({
  preferences,
  dna,
  interactions,
  hasLearnedUpdates,
  onResetDemo
}) => {
  const dimensions = [
    { label: 'Affordability', value: dna.affordability, color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
    { label: 'Quietness', value: dna.quietness, color: 'bg-indigo-500', barBg: 'bg-indigo-100', learned: hasLearnedUpdates },
    { label: 'Natural light', value: dna.naturalLight, color: 'bg-amber-400', barBg: 'bg-amber-100', learned: hasLearnedUpdates },
    { label: 'Commute', value: dna.commute, color: 'bg-amber-500', barBg: 'bg-amber-100', learned: hasLearnedUpdates },
    { label: 'Desk / Workstation', value: dna.desk, color: 'bg-teal-500', barBg: 'bg-teal-100' },
    { label: 'Public transport', value: dna.publicTransport, color: 'bg-blue-500', barBg: 'bg-blue-100' },
    { label: 'Space & Size', value: dna.space, color: 'bg-stone-500', barBg: 'bg-stone-200' },
    { label: 'Social atmosphere', value: dna.socialAtmosphere, color: 'bg-rose-400', barBg: 'bg-rose-100' }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
          <Brain className="w-3.5 h-3.5 text-amber-600" />
          <span>Continuous Preference Learning</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold text-stone-900 tracking-tight">
          Your Housing DNA
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          How your explicit criteria combined with your swipe behavior shape every recommendation.
        </p>
      </div>

      {/* Comparison: What You Told Us vs What NestMate Learned */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What you told us */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sliders className="w-4 h-4" />
            <span>What you told us</span>
          </div>

          <div className="space-y-3 text-xs font-medium">
            <div className="flex items-center gap-2.5 text-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              <span>Budget under €{preferences.budgetMax}/month</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              <span>Commute under {preferences.maxCommuteMinutes} min to {preferences.destination}</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              <span>Quiet home environment</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-800">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
              <span>Dedicated desk for studying</span>
            </div>
            <div className="flex items-center gap-2.5 text-stone-500 text-[11px] italic pt-1">
              Initial assumption: shortest commute is paramount.
            </div>
          </div>
        </div>

        {/* What NestMate learned */}
        <div className="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
            <Brain className="w-4 h-4 text-amber-600" />
            <span>What NestMate learned</span>
          </div>

          {hasLearnedUpdates ? (
            <div className="space-y-3 text-xs font-medium">
              <div className="flex items-start gap-2.5 text-stone-900">
                <Sun className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Natural light matters more</strong> than you expected (liked 4 of 5 sunlit rooms).
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-900">
                <VolumeX className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strong quietness preference:</strong> Passed on noisy homes despite ultra-close campus proximity.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-900">
                <Bus className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Flexible commute trade-off:</strong> Willing to travel ~10 extra minutes for a serene, bright living space.
                </span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-xs text-stone-600 mb-2">
                Swipe through 3–4 properties in Discover to unlock behavioural insights.
              </p>
              <span className="text-[11px] text-amber-800 bg-white/70 px-2.5 py-1 rounded-full border border-amber-200">
                {interactions.length} interactions recorded
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Visual DNA Bars */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <h3 className="font-display font-bold text-lg text-stone-900 mb-5">
          Active DNA Weight Distribution
        </h3>

        <div className="space-y-4">
          {dimensions.map((dim, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span>{dim.label}</span>
                  {dim.learned && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                      Adapted
                    </span>
                  )}
                </span>
                <span className="font-mono text-stone-900 font-bold bg-stone-100 px-2 py-0.5 rounded">
                  {dim.value}/100
                </span>
              </div>
              <div className={`h-2.5 w-full rounded-full ${dim.barBg} overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.value}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                  className={`h-full rounded-full ${dim.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Session Footer */}
      <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between">
        <div className="text-xs text-stone-600">
          Want to test the discovery flow from the beginning?
        </div>
        <button
          onClick={onResetDemo}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-white px-3 py-1.5 rounded-lg border border-stone-200 shadow-2xs hover:bg-stone-50 transition-colors"
        >
          Reset Demo State
        </button>
      </div>
    </div>
  );
};
