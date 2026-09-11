import React, { useState } from 'react';
import { ArrowRight, Sparkles, SlidersHorizontal, Check, Edit3, Flame, Bus, VolumeX, Monitor, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { HousingPreferences, HousingDNA } from '../types';

interface HousingDNAScreenProps {
  preferences: HousingPreferences;
  dna: HousingDNA;
  onConfirmDNA: (updatedDNA: HousingDNA) => void;
  onEditPrompt: () => void;
}

export const HousingDNAScreen: React.FC<HousingDNAScreenProps> = ({
  preferences,
  dna,
  onConfirmDNA,
  onEditPrompt
}) => {
  const [currentDna, setCurrentDna] = useState<HousingDNA>(dna);
  const [isFineTuning, setIsFineTuning] = useState(false);

  const dimensions = [
    { key: 'affordability' as const, label: 'Affordability', value: currentDna.affordability, color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
    { key: 'commute' as const, label: 'Commute', value: currentDna.commute, color: 'bg-amber-500', barBg: 'bg-amber-100' },
    { key: 'quietness' as const, label: 'Quietness', value: currentDna.quietness, color: 'bg-indigo-500', barBg: 'bg-indigo-100' },
    { key: 'naturalLight' as const, label: 'Natural light', value: currentDna.naturalLight, color: 'bg-amber-400', barBg: 'bg-amber-100' },
    { key: 'publicTransport' as const, label: 'Public transport', value: currentDna.publicTransport, color: 'bg-blue-500', barBg: 'bg-blue-100' },
    { key: 'space' as const, label: 'Space', value: currentDna.space, color: 'bg-stone-500', barBg: 'bg-stone-200' },
    { key: 'socialAtmosphere' as const, label: 'Social atmosphere', value: currentDna.socialAtmosphere, color: 'bg-rose-400', barBg: 'bg-rose-100' }
  ];

  const handleSliderChange = (key: keyof HousingDNA, val: number) => {
    setCurrentDna(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-sm"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Synthesized from your description</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold text-stone-900 tracking-tight">
              Your Housing DNA
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Here is how Finderr balances your priorities before discovering listings.
            </p>
          </div>

          <button
            onClick={() => setIsFineTuning(!isFineTuning)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isFineTuning ? 'Done Tuning' : 'Fine-tune weights'}</span>
          </button>
        </div>

        {/* DNA Bars Grid */}
        <div className="space-y-4 mb-10">
          {dimensions.map((dim, idx) => (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span className="group-hover:text-stone-900 transition-colors">{dim.label}</span>
                <span className="font-mono text-stone-900 font-bold bg-stone-100 px-2 py-0.5 rounded-md">
                  {dim.value}
                </span>
              </div>

              {isFineTuning ? (
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={dim.value}
                  onChange={e => handleSliderChange(dim.key, parseInt(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              ) : (
                <div className={`h-2.5 w-full rounded-full ${dim.barBg} overflow-hidden`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                    className={`h-full rounded-full ${dim.color}`}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Priorities Section */}
        <div className="bg-stone-50/80 rounded-2xl p-5 border border-stone-200/70 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3.5">
            Your Priorities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-medium">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/60">
              <span className="flex items-center gap-2 text-stone-800">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Under €{preferences.budgetMax} budget</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[11px]">
                Essential
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/60">
              <span className="flex items-center gap-2 text-stone-800">
                <Bus className="w-4 h-4 text-amber-500" />
                <span>Under {preferences.maxCommuteMinutes} min commute</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[11px]">
                Essential
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/60">
              <span className="flex items-center gap-2 text-stone-800">
                <VolumeX className="w-4 h-4 text-indigo-500" />
                <span>Quiet household</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px]">
                High
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/60">
              <span className="flex items-center gap-2 text-stone-800">
                <Monitor className="w-4 h-4 text-emerald-500" />
                <span>Dedicated desk</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                High
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200/60 sm:col-span-2">
              <span className="flex items-center gap-2 text-stone-800">
                <Maximize2 className="w-4 h-4 text-stone-400" />
                <span>Large bedroom footprint</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium text-[11px]">
                Low
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onConfirmDNA(currentDna)}
            className="w-full sm:flex-1 py-4 px-6 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-base rounded-2xl shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Start matching</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onEditPrompt}
            className="w-full sm:w-auto py-3.5 px-5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-xl transition-colors"
          >
            Edit description
          </button>
        </div>
      </motion.div>
    </div>
  );
};
