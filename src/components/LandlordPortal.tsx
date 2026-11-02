import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Send,
  Sliders,
  Sun,
  Volume2,
  GraduationCap,
  PlusCircle,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { TenantApplicant, Property, GeneratedListingDraft } from '../types';
import { INITIAL_APPLICANTS } from '../data/applicants';

interface LandlordPortalProps {
  property: Property; // Elena's property (prop_e)
  onSwitchToTenantView: () => void;
}

export const LandlordPortal: React.FC<LandlordPortalProps> = ({
  property,
  onSwitchToTenantView
}) => {
  const [applicants, setApplicants] = useState<TenantApplicant[]>(INITIAL_APPLICANTS);
  const [selectedApplicant, setSelectedApplicant] = useState<TenantApplicant | null>(INITIAL_APPLICANTS[0]);
  const [isDraftingListing, setIsDraftingListing] = useState<boolean>(false);
  const [landlordNotes, setLandlordNotes] = useState<string>(
    'Double bedroom in Drumcondra cul-de-sac, 12 min cycle to DCU. Very quiet residential street, large garden-facing window, study desk and high-speed Wi-Fi. Seeking quiet master’s or PhD student. €850 bills included.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedListingDraft | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleInviteViewing = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(app =>
        app.id === applicantId ? { ...app, status: 'viewing_invited' } : app
      )
    );
    setActionSuccessMsg(`Viewing invitation dispatched to ${selectedApplicant?.applicantName || 'applicant'}`);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleGenerateListingWithAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/landlord/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: landlordNotes,
          area: 'Drumcondra',
          baseRent: 850
        })
      });
      const data = await res.json();
      setGeneratedDraft(data.listing);
    } catch (err) {
      console.error('Error drafting listing:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Hackathon Presenter Tip Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-amber-950 font-medium">
          <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider">
            Presentation Mode
          </span>
          <span>
            You are viewing <strong>Elena Gallagher’s Landlord Portal</strong>. Show how Finderr replaces 300 random emails with an AI-ranked compatibility roster.
          </span>
        </div>
        <button
          onClick={onSwitchToTenantView}
          className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline cursor-pointer"
        >
          <span>Switch back to Student View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Landlord Profile Header */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
              alt="Elena Gallagher"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-600/30 shadow-xs"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl font-bold text-stone-900">
                  Elena Gallagher
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PRTB Verified Landlord
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  #RTB-2024-88492-V
                </span>
              </div>
              <p className="text-stone-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                Homeowner in Glasnevin (near DCU). Hosts quiet, sunlit study rooms for postgraduate students.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDraftingListing(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Draft Room with AI</span>
            </button>
          </div>
        </div>

        {/* Landlord KPI Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
          <div className="bg-stone-50/80 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              Active Listing
            </div>
            <div className="text-lg font-bold text-stone-900">1 Room (Glasnevin)</div>
            <div className="text-[11px] text-emerald-700 font-medium">96% Top Match Active</div>
          </div>
          <div className="bg-stone-50/80 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              Compatibility Roster
            </div>
            <div className="text-lg font-bold text-stone-900">4 Applicants</div>
            <div className="text-[11px] text-stone-500 font-medium">Ranked by Housing DNA</div>
          </div>
          <div className="bg-stone-50/80 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              High Match Rate
            </div>
            <div className="text-lg font-bold text-amber-700">2 Above 90%</div>
            <div className="text-[11px] text-stone-500 font-medium">Lifestyle & Routine Aligned</div>
          </div>
          <div className="bg-stone-50/80 rounded-2xl p-3.5">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
              Response Speed
            </div>
            <div className="text-lg font-bold text-stone-900">1.4 Hours</div>
            <div className="text-[11px] text-stone-500 font-medium">98% Verified Response</div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {actionSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)}>
              <X className="w-4 h-4 text-white/80 hover:text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Two-Column Workflow: Applicant Roster & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Applicant Roster */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700" />
              <h2 className="font-display font-bold text-lg text-stone-900">
                Pre-Screened Compatibility
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              Sorted by Fit
            </span>
          </div>

          <div className="space-y-3">
            {applicants.map(app => {
              const isSelected = selectedApplicant?.id === app.id;
              const isTop = app.compatibilityScore >= 95;

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApplicant(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-amber-50/70 border-amber-500 shadow-sm'
                      : 'bg-white border-stone-200/80 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={app.avatarUrl}
                        alt={app.applicantName}
                        className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-stone-900 text-sm">
                            {app.applicantName}
                          </span>
                          {app.verifiedStudent && (
                            <span title="Verified DCU Student">
                            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {app.program}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-black ${
                          isTop
                            ? 'bg-amber-600 text-white'
                            : app.compatibilityScore >= 85
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {app.compatibilityScore}% Fit
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {app.appliedAt}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 mb-2.5">
                    {app.compatibilitySummary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-stone-100">
                    <span className="text-stone-500">
                      Budget: <strong>€{app.budgetMax}/mo</strong>
                    </span>
                    <span
                      className={`font-semibold capitalize ${
                        app.status === 'viewing_invited'
                          ? 'text-emerald-700'
                          : 'text-amber-800'
                      }`}
                    >
                      {app.status === 'viewing_invited' ? '✓ Viewing Invited' : 'Review Needed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Applicant Deep Profile & Viewing Scheduler */}
        <div className="lg:col-span-7">
          {selectedApplicant ? (
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-7 shadow-xs">
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-100">
                <div className="flex items-center gap-3.5">
                  <img
                    src={selectedApplicant.avatarUrl}
                    alt={selectedApplicant.applicantName}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-xl text-stone-900">
                        {selectedApplicant.applicantName}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-1 border border-blue-200">
                        <GraduationCap className="w-3 h-3" />
                        DCU Student
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {selectedApplicant.program} • Applied {selectedApplicant.appliedAt}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-amber-600 font-display">
                    {selectedApplicant.compatibilityScore}%
                  </div>
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    Lifestyle Fit
                  </div>
                </div>
              </div>

              {/* Housing DNA Match Breakdown */}
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Why Finderr Recommends This Match</span>
                </div>
                <p className="text-stone-800 text-xs sm:text-sm leading-relaxed mb-3">
                  {selectedApplicant.compatibilitySummary}
                </p>
                <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200/60 text-xs text-amber-950 font-medium">
                  <strong>DNA Alignment:</strong> {selectedApplicant.dnaMatchHighlight}
                </div>
              </div>

              {/* Bio & Details */}
              <div className="mt-5 space-y-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Student Bio
                  </h4>
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                    "{selectedApplicant.bio}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="text-[11px] text-stone-500">Cleanliness Habits</div>
                    <div className="text-xs font-semibold text-stone-800">
                      {selectedApplicant.cleanlinessHabit}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="text-[11px] text-stone-500">Monthly Budget Ceiling</div>
                    <div className="text-xs font-semibold text-stone-800">
                      €{selectedApplicant.budgetMax} (Rent is €{property.monthlyRent})
                    </div>
                  </div>
                </div>
              </div>

              {/* Viewing Action Controls */}
              <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
                {selectedApplicant.status === 'viewing_invited' ? (
                  <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>In-Person Viewing Offered • Student Notified via SMS</span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleInviteViewing(selectedApplicant.id)}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Invite {selectedApplicant.applicantName.split(' ')[0]} to In-Person Viewing</span>
                    </button>
                    <button
                      onClick={() => {
                        setActionSuccessMsg(`Sent compatibility questionnaire to ${selectedApplicant.applicantName}`);
                        setTimeout(() => setActionSuccessMsg(null), 3000);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex items-center justify-center bg-white rounded-3xl border border-stone-200/80 p-8 text-stone-400 text-sm">
              Select an applicant from the roster to inspect compatibility DNA.
            </div>
          )}
        </div>
      </div>

      {/* AI Listing Drafter Modal */}
      <AnimatePresence>
        {isDraftingListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-stone-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-stone-900">
                      Finderr AI Listing Drafter
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Transform informal landlord notes into a verified student housing listing
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDraftingListing(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Type or Paste Rough Notes
                </label>
                <textarea
                  value={landlordNotes}
                  onChange={e => setLandlordNotes(e.target.value)}
                  rows={3}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Describe your room, rules, desk, amenities, price, etc."
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setLandlordNotes(
                        'Quiet double ensuite in Glasnevin, 15 min walk to DCU. South facing window with sun all afternoon. Desk, chair, bills included, €860. Looking for studious master’s student, strictly non-smoker.'
                      )
                    }
                    className="text-[11px] text-amber-700 hover:underline font-medium"
                  >
                    + Insert Glasnevin Demo Room Note
                  </button>

                  <button
                    onClick={handleGenerateListingWithAI}
                    disabled={isGenerating || !landlordNotes.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Analyze & Structure with AI'}</span>
                  </button>
                </div>
              </div>

              {/* Generated Result Preview */}
              {generatedDraft && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 rounded-2xl bg-amber-50/60 border border-amber-200 text-left space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Generated Housing DNA & Listing Preview
                    </span>
                    <span className="text-xs font-extrabold text-stone-900">
                      €{generatedDraft.monthlyRent}/month
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-stone-900">
                    {generatedDraft.title}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {generatedDraft.description}
                  </p>

                  {/* Synthesized DNA Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white border border-stone-200/80">
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Quietness</div>
                      <div className="font-bold text-stone-800">{generatedDraft.quietnessScore}/100</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200/80">
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Natural Light</div>
                      <div className="font-bold text-stone-800">{generatedDraft.naturalLightScore}/100</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-stone-200/80">
                      <div className="text-[10px] text-stone-400 uppercase font-semibold">Transit Access</div>
                      <div className="font-bold text-stone-800">{generatedDraft.publicTransportScore}/100</div>
                    </div>
                  </div>

                  {/* Trade-off Transparency */}
                  <div className="p-2.5 rounded-xl bg-amber-100/60 text-xs text-amber-900">
                    <strong>Honest Trade-off Flag:</strong> {generatedDraft.tradeOff}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setIsDraftingListing(false);
                        setActionSuccessMsg('Listing draft created! Elena can now publish to Finderr.');
                        setTimeout(() => setActionSuccessMsg(null), 3500);
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl"
                    >
                      Save & Add to Roster
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
