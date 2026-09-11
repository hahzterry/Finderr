import React from 'react';
import { PropertyMatchResult, Property } from '../types';
import { Heart, Bus, MapPin, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface MatchesViewProps {
  likedMatches: PropertyMatchResult[];
  onOpenDetails: (property: Property) => void;
  onNavigateDiscover: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  likedMatches,
  onOpenDetails,
  onNavigateDiscover
}) => {
  if (likedMatches.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">
            No saved matches yet
          </h3>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            As you swipe through properties in Discover, your liked homes will be ranked here by how well they match your Housing DNA.
          </p>
          <button
            onClick={onNavigateDiscover}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Start Swiping Homes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-stone-900 tracking-tight">
            Your Top Matches
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Ranked deterministically by your learned Housing DNA priorities.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
          {likedMatches.length} {likedMatches.length === 1 ? 'Home' : 'Homes'} Saved
        </span>
      </div>

      {/* List of Liked Homes */}
      <div className="space-y-4">
        {likedMatches.map((item, idx) => {
          const { property, score, topReasons } = item;
          const isScam = property.isSuspiciousDemo;

          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onOpenDetails(property)}
              className="group bg-white rounded-2xl border border-stone-200/80 hover:border-amber-400 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-center"
            >
              {/* Photo Thumbnail */}
              <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-md font-display font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-md shadow-xs ${
                    isScam
                      ? 'bg-rose-600 text-white'
                      : score >= 90
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900/80 text-stone-100'
                  }`}
                >
                  {isScam ? 'ALERT' : `${score}%`}
                </div>
              </div>

              {/* Information */}
              <div className="flex-1 w-full text-left">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-bold text-xl sm:text-2xl text-stone-900">
                      €{property.monthlyRent}
                    </span>
                    <span className="text-xs text-stone-500">/month</span>
                  </div>

                  <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{property.area.split('(')[0].trim()}</span>
                  </span>
                </div>

                <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors line-clamp-1 mb-1.5">
                  {property.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-amber-800 font-medium mb-2.5">
                  <Bus className="w-3.5 h-3.5 text-amber-600" />
                  <span>{property.commuteMinutes} min to DCU</span>
                  <span>•</span>
                  <span>Quietness: {property.quietnessScore}/100</span>
                </div>

                {/* Reasons pill / tag summary */}
                <div className="flex flex-wrap items-center gap-1 text-[11px] text-stone-600">
                  <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 font-medium">
                    {topReasons.slice(0, 2).join(' + ') || 'Quiet + bright + within budget'}
                  </span>

                  {property.tradeOff && (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded line-clamp-1">
                      ⚠️ {property.tradeOff}
                    </span>
                  )}
                </div>
              </div>

              {/* View Arrow */}
              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-stone-50 group-hover:bg-amber-100 text-stone-400 group-hover:text-amber-700 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
