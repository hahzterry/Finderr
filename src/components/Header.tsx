import React from 'react';
import { Home, Compass, Bookmark, Dna, RotateCcw, Building2, User } from 'lucide-react';

interface HeaderProps {
  currentTab: 'discover' | 'matches' | 'dna';
  setCurrentTab: (tab: 'discover' | 'matches' | 'dna') => void;
  matchesCount: number;
  onResetDemo: () => void;
  onNavigateHome: () => void;
  hasLearnedUpdates: boolean;
  userRole: 'tenant' | 'landlord';
  setUserRole: (role: 'tenant' | 'landlord') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  matchesCount,
  onResetDemo,
  onNavigateHome,
  hasLearnedUpdates,
  userRole,
  setUserRole
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm shadow-amber-600/20 group-hover:bg-amber-700 transition-colors">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-stone-900 tracking-tight">Finderr</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-800">
                AI Housing
              </span>
            </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">Stop searching. Start matching.</p>
          </div>
        </button>

        {/* Center Nav tabs (only for Tenant view) */}
        {userRole === 'tenant' ? (
          <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setCurrentTab('discover')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'discover'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setCurrentTab('matches')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                currentTab === 'matches'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Matches</span>
              {matchesCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                  {matchesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('dna')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                currentTab === 'dna'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>My DNA</span>
              {hasLearnedUpdates && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs font-bold text-amber-900">
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>Landlord Management Portal</span>
          </div>
        )}

        {/* Action Controls & Dual Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Persona Toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/80">
            <button
              onClick={() => setUserRole('tenant')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                userRole === 'tenant'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Switch to Student Tenant View"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student</span>
            </button>
            <button
              onClick={() => setUserRole('landlord')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                userRole === 'landlord'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Switch to Landlord Portal View"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landlord</span>
            </button>
          </div>

          <button
            onClick={onResetDemo}
            title="Reset demo session back to beginning"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
