import React, { useState, useEffect } from 'react';
import { X, Heart, Bus, VolumeX, Sun, Monitor, Shield, MapPin, Check, AlertTriangle, User, Mail, Sparkles, Building, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Property, PropertyMatchResult } from '../types';
import { calculateListingRisk } from '../lib/scam-risk';
import { ScamShieldBanner } from './ScamShieldBanner';
import { DEMO_LANDLORDS } from '../data/properties';

interface PropertyDetailModalProps {
  property: Property;
  matchResult?: PropertyMatchResult;
  isLiked?: boolean;
  onLike?: (prop: Property) => void;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  matchResult,
  isLiked = false,
  onLike,
  onClose
}) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [aiRiskSummary, setAiRiskSummary] = useState<string | undefined>();
  const [loadingAiRisk, setLoadingAiRisk] = useState(false);

  const risk = calculateListingRisk(property);
  const landlord = property.landlord || DEMO_LANDLORDS[property.landlord_id] || DEMO_LANDLORDS.landlord_001;

  // If suspicious, asynchronously query risk analysis endpoint
  useEffect(() => {
    if (property.isSuspiciousDemo) {
      setLoadingAiRisk(true);
      fetch('/api/analyze-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property })
      })
        .then(res => res.json())
        .then(data => {
          if (data?.analysis?.riskSummary) {
            setAiRiskSummary(data.analysis.riskSummary);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingAiRisk(false));
    }
  }, [property.id, property.isSuspiciousDemo]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full overflow-hidden relative my-6 max-h-[92vh] flex flex-col"
      >
        {/* Sticky Header Close */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {onLike && (
            <button
              onClick={() => onLike(property)}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                isLiked ? 'bg-rose-500 text-white' : 'bg-stone-900/60 hover:bg-stone-900 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-0 flex-1">
          {/* Main Photo Gallery */}
          <div className="relative h-64 sm:h-80 w-full bg-stone-100">
            <img
              src={property.images[activePhoto] || property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Thumbnail switcher if multiple */}
            {property.images.length > 1 && (
              <div className="absolute bottom-3 left-4 right-4 flex gap-2 overflow-x-auto py-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`w-14 h-11 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activePhoto === idx ? 'border-amber-500 scale-105 shadow-sm' : 'border-white/80 opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Scam Shield Alert if flagged */}
            {risk.riskLevel !== 'LOW' && (
              <ScamShieldBanner riskResult={risk} aiSummary={aiRiskSummary} />
            )}

            {/* Title & Price Header */}
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold text-stone-900">
                    €{property.monthlyRent}
                  </span>
                  <span className="text-sm text-stone-500 font-medium">/month</span>
                  {property.utilitiesEstimate > 0 ? (
                    <span className="text-xs text-stone-400">
                      (+~€{property.utilitiesEstimate} bills)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Bills included
                    </span>
                  )}
                </div>

                {matchResult && (
                  <div className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-display font-extrabold text-sm shadow-xs">
                    {matchResult.score}% MATCH
                  </div>
                )}
              </div>

              <h3 className="font-display text-xl font-bold text-stone-900 mb-1">
                {property.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{property.area}</span>
              </div>
            </div>

            {/* Commute Insight */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-3">
              <Bus className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-900 block mb-0.5">
                  🚌 {property.commuteMinutes} min transit commute to DCU Campus
                </span>
                {property.commuteComparison ? (
                  <p className="text-xs text-stone-600 font-medium">{property.commuteComparison}</p>
                ) : (
                  <p className="text-xs text-stone-500">Regular Dublin Bus routes connection.</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                About this Home
              </h4>
              <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Lifestyle & Property Characteristics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Characteristics & Atmosphere
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                  <span className="text-stone-500 block text-[11px] mb-1">Quietness</span>
                  <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                    <VolumeX className="w-4 h-4 text-indigo-500" />
                    <span>{property.quietnessScore}/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                  <span className="text-stone-500 block text-[11px] mb-1">Natural Light</span>
                  <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>{property.naturalLightScore}/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                  <span className="text-stone-500 block text-[11px] mb-1">Public Transit</span>
                  <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                    <Bus className="w-4 h-4 text-blue-500" />
                    <span>{property.publicTransportScore}/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                  <span className="text-stone-500 block text-[11px] mb-1">Dedicated Desk</span>
                  <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                    <Monitor className="w-4 h-4 text-emerald-600" />
                    <span>{property.desk ? 'Included' : 'None'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade-off Warning if applicable */}
            {property.tradeOff && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Identified Trade-off</span>
                </span>
                <p className="text-xs text-amber-950">{property.tradeOff}</p>
              </div>
            )}

            {/* Amenities */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
                Features & Amenities
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {property.amenities.map(amenity => (
                  <span
                    key={amenity}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-medium"
                  >
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Landlord Profile */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {landlord.photo_url ? (
                  <img
                    src={landlord.photo_url}
                    alt={landlord.display_name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900">{landlord.display_name}</span>
                    {landlord.verified && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{landlord.description}</p>
                </div>
              </div>

              {landlord.contact.email && (
                <a
                  href={`mailto:${landlord.contact.email}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
