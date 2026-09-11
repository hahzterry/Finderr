import React, { useState, useEffect } from 'react';
import { X, Heart, Bus, VolumeX, Sun, Monitor, Info, ArrowLeft, ArrowRight, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { PropertyMatchResult, Property } from '../types';

interface SwipeDiscoveryProps {
  currentMatch: PropertyMatchResult | null;
  totalHomesCount: number;
  currentIndex: number;
  onLike: (prop: Property) => void;
  onPass: (prop: Property) => void;
  onOpenDetails: (prop: Property) => void;
  onResetDeck?: () => void;
}

export const SwipeDiscovery: React.FC<SwipeDiscoveryProps> = ({
  currentMatch,
  totalHomesCount,
  currentIndex,
  onLike,
  onPass,
  onOpenDetails,
  onResetDeck
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  // Motion drag coordinates
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 0.9, 1, 0.9, 0.5]);
  const likeBadgeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passBadgeOpacity = useTransform(x, [-100, -20], [1, 0]);

  // Reset photo index when current property changes
  useEffect(() => {
    setActivePhotoIdx(0);
    x.set(0);
    setDragDirection(null);
  }, [currentMatch?.property.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentMatch) return;
      if (e.key === 'ArrowLeft') {
        onPass(currentMatch.property);
      } else if (e.key === 'ArrowRight') {
        onLike(currentMatch.property);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onOpenDetails(currentMatch.property);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMatch, onLike, onPass, onOpenDetails]);

  if (!currentMatch) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">
            You've explored all homes!
          </h3>
          <p className="text-stone-600 text-sm mb-6">
            Review your saved top matches or inspect how Finderr adapted your Housing DNA.
          </p>
          {onResetDeck && (
            <button
              onClick={onResetDeck}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              Start Discoveries Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const { property, score, breakdown } = currentMatch;
  const isScamListing = property.isSuspiciousDemo;

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 400) {
      onLike(property);
    } else if (offset < -100 || velocity < -400) {
      onPass(property);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 sm:px-0 select-none">
      {/* Top Deck Progress Counter */}
      <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-3 px-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
          <span>{currentIndex + 1} of {totalHomesCount} homes explored</span>
        </span>
        <span className="text-[11px] text-stone-400">
          Keys: ← Pass | Like →
        </span>
      </div>

      {/* Swipeable Card Stage */}
      <div className="relative min-h-[540px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={property.id}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            className="w-full bg-white rounded-3xl border border-stone-200/90 shadow-lg overflow-hidden cursor-grab flex flex-col relative"
          >
            {/* Visual Drag Overlays */}
            <motion.div
              style={{ opacity: likeBadgeOpacity }}
              className="absolute top-6 right-6 z-30 pointer-events-none bg-emerald-600/95 text-white font-extrabold text-sm uppercase tracking-wider px-3.5 py-1.5 rounded-xl rotate-12 shadow-md border-2 border-white"
            >
              LIKE ❤️
            </motion.div>

            <motion.div
              style={{ opacity: passBadgeOpacity }}
              className="absolute top-6 left-6 z-30 pointer-events-none bg-rose-600/95 text-white font-extrabold text-sm uppercase tracking-wider px-3.5 py-1.5 rounded-xl -rotate-12 shadow-md border-2 border-white"
            >
              PASS ✕
            </motion.div>

            {/* Photo Gallery Area */}
            <div className="relative h-72 sm:h-80 w-full bg-stone-100 overflow-hidden group">
              <img
                src={property.images[activePhotoIdx] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Photo Dots */}
              {property.images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
                  {property.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        activePhotoIdx === idx ? 'w-5 bg-white shadow-xs' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Photo click navigation tabs */}
              {property.images.length > 1 && (
                <>
                  <div
                    className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : property.images.length - 1));
                    }}
                  />
                  <div
                    className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setActivePhotoIdx(prev => (prev < property.images.length - 1 ? prev + 1 : 0));
                    }}
                  />
                </>
              )}

              {/* Floating Match Badge */}
              <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-xl font-display font-extrabold text-xs tracking-wider uppercase backdrop-blur-md shadow-md ${
                    isScamListing
                      ? 'bg-rose-600/90 text-white'
                      : score >= 90
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : score >= 80
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-900/80 text-stone-100'
                  }`}
                >
                  {isScamListing ? 'RISK ALERT' : `${score}% MATCH`}
                </div>

                {isScamListing && (
                  <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-md">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Suspicious Listing</span>
                  </div>
                )}
              </div>

              {/* Info Pill / Tap for Details */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  onOpenDetails(property);
                }}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="View full details and trade-offs"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div
              className="p-5 flex-1 flex flex-col justify-between cursor-pointer"
              onClick={() => onOpenDetails(property)}
            >
              <div>
                {/* Price & Area Header */}
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900">
                      €{property.monthlyRent}
                    </span>
                    <span className="text-xs font-medium text-stone-500">/month</span>
                  </div>

                  <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{property.area.split('(')[0].trim()}</span>
                  </span>
                </div>

                {/* Commute Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-semibold mb-3">
                  <Bus className="w-3.5 h-3.5 text-amber-600" />
                  <span>{property.commuteMinutes} min to DCU</span>
                </div>

                {/* Key Lifestyle Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {property.quietnessScore >= 80 && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center gap-1">
                      <VolumeX className="w-3 h-3" />
                      <span>Quiet ({property.quietnessScore})</span>
                    </span>
                  )}

                  {property.naturalLightScore >= 80 && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Bright room</span>
                    </span>
                  )}

                  {property.desk && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-emerald-600" />
                      <span>Desk included</span>
                    </span>
                  )}
                </div>

                <p className="text-stone-600 text-xs line-clamp-2 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Match Score Reason Strip */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="text-amber-800 font-medium">
                  +{breakdown.budgetScore} Budget • +{breakdown.commuteScore} Commute • +{breakdown.lifestyleScore} Lifestyle
                </span>
                <span className="text-stone-400 hover:text-stone-700 flex items-center gap-1">
                  Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Controls */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          onClick={() => onPass(property)}
          aria-label="Pass property"
          className="w-14 h-14 rounded-full bg-white hover:bg-rose-50 active:bg-rose-100 text-rose-600 border-2 border-stone-200 hover:border-rose-300 flex items-center justify-center shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        <button
          onClick={() => onOpenDetails(property)}
          aria-label="Inspect listing details"
          className="w-11 h-11 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-xs"
        >
          <Info className="w-5 h-5" />
        </button>

        <button
          onClick={() => onLike(property)}
          aria-label="Like property"
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Heart className="w-7 h-7 fill-white stroke-none" />
        </button>
      </div>
    </div>
  );
};
