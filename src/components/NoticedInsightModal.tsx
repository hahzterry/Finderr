import React, { useState } from 'react';
import { Sparkles, Brain, Check, ArrowRight, Sun, VolumeX, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LearnedInsight, HousingDNA } from '../types';

interface NoticedInsightModalProps {
  insight: LearnedInsight;
  onAcceptUpdate: (updatedDNA: HousingDNA) => void;
  onKeepCurrent: () => void;
}

export const NoticedInsightModal: React.FC<NoticedInsightModalProps> = ({
  insight,
  onAcceptUpdate,
  onKeepCurrent
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setIsSuccess(true);
      setTimeout(() => {
        onAcceptUpdate(insight.suggestedDna);
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-stone-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">
                Housing DNA updated ✓
              </h3>
              <p className="text-amber-700 font-semibold text-base mb-2">
                Your matches just got better.
              </p>
              <p className="text-stone-500 text-xs">
                Recalculating property scores and re-ranking recommendations...
              </p>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Header Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 w-fit text-xs font-bold mb-4">
                <Brain className="w-4 h-4 text-amber-600" />
                <span>NestMate noticed something</span>
              </div>

              {/* Title & Core Discrepancy Insight */}
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-stone-900 mb-3 leading-snug">
                You told us one thing, but your choices suggest something else.
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                {insight.message}
              </p>

              {/* Discovery Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 mb-6">
                <p className="font-semibold text-stone-900 text-sm mb-3">
                  {insight.discovery}
                </p>

                {/* Visual Weight Comparison */}
                <div className="space-y-2 text-xs font-medium">
                  {/* Quietness */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/60">
                    <span className="flex items-center gap-2 text-stone-800">
                      <VolumeX className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Quietness priority</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono font-bold">
                      <span className="text-stone-400">{insight.previousDna.quietness}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {insight.suggestedDna.quietness} (+20)
                      </span>
                    </span>
                  </div>

                  {/* Natural Light */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/60">
                    <span className="flex items-center gap-2 text-stone-800">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Natural light priority</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono font-bold">
                      <span className="text-stone-400">{insight.previousDna.naturalLight}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                      <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {insight.suggestedDna.naturalLight} (+40)
                      </span>
                    </span>
                  </div>

                  {/* Commute */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200/60">
                    <span className="flex items-center gap-2 text-stone-800">
                      <Bus className="w-3.5 h-3.5 text-amber-600" />
                      <span>Commute ceiling</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-mono font-bold">
                      <span className="text-stone-400">{insight.previousDna.commute}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                      <span className="text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                        {insight.suggestedDna.commute} (re-balanced)
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="w-full sm:flex-1 py-3.5 px-5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isUpdating ? 'Updating DNA...' : 'Update my DNA'}</span>
                </button>

                <button
                  onClick={onKeepCurrent}
                  disabled={isUpdating}
                  className="w-full sm:w-auto py-3.5 px-4 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-colors"
                >
                  Keep my preferences
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
