import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck, Sparkles, PhoneOff } from 'lucide-react';
import { RiskAnalysisResult } from '../types';

interface ScamShieldBannerProps {
  riskResult: RiskAnalysisResult;
  aiSummary?: string;
}

export const ScamShieldBanner: React.FC<ScamShieldBannerProps> = ({
  riskResult,
  aiSummary
}) => {
  const isHighRisk = riskResult.riskLevel === 'HIGH';
  const isMediumRisk = riskResult.riskLevel === 'MEDIUM';

  if (!isHighRisk && !isMediumRisk) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Verified Safety Signals
          </h4>
          <p className="text-xs text-emerald-800 mt-0.5">
            This listing adheres to normal Dublin student rental guidelines with verified landlord contact and standard deposit rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700">
              Finderr Scam Shield
            </div>
            <h3 className="font-display font-extrabold text-lg text-rose-950">
              {riskResult.riskLevel} RENTAL RISK
            </h3>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-rose-200/80 text-rose-900 font-extrabold text-xs font-mono">
          {riskResult.signals.length} warning signals
        </div>
      </div>

      {/* Warning Signals List */}
      <div className="space-y-2 bg-white/80 p-3.5 rounded-xl border border-rose-200/80">
        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 block mb-1">
          Warning signals detected:
        </span>
        {riskResult.signals.map((signal, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs font-medium text-rose-950">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
            <span>{signal}</span>
          </div>
        ))}
      </div>

      {/* AI or Deterministic Analysis Summary */}
      {aiSummary && (
        <div className="p-3 rounded-xl bg-white/60 text-xs text-stone-700 leading-relaxed border border-rose-200/50">
          <span className="font-semibold text-stone-900 block mb-0.5">Safety Intelligence:</span>
          {aiSummary}
        </div>
      )}

      {/* Protective Recommendation */}
      <div className="pt-2 border-t border-rose-200/80 text-xs text-rose-900 font-medium">
        <strong>Recommendation:</strong> {riskResult.recommendation}
      </div>
    </div>
  );
};
