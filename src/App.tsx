import React, { useState, useEffect, useMemo } from 'react';
import {
  HousingPreferences,
  HousingDNA,
  Property,
  PropertyMatchResult,
  SwipeInteraction,
  LearnedInsight
} from './types';
import { INITIAL_PROPERTIES } from './data/properties';
import { rankProperties, calculatePropertyMatch } from './lib/matching';
import { analyzeSwipeInteractions } from './lib/preference-learning';
import {
  loadStoredPreferences,
  saveStoredPreferences,
  loadStoredDNA,
  saveStoredDNA,
  loadStoredInteractions,
  saveStoredInteractions,
  loadStoredLikedIds,
  saveStoredLikedIds,
  resetDemoState,
  DEFAULT_PREFERENCES,
  DEFAULT_DNA
} from './lib/storage';

import { Header } from './components/Header';
import { LandingHero } from './components/LandingHero';
import { NaturalLanguageOnboarding } from './components/NaturalLanguageOnboarding';
import { HousingDNAScreen } from './components/HousingDNAScreen';
import { SwipeDiscovery } from './components/SwipeDiscovery';
import { NoticedInsightModal } from './components/NoticedInsightModal';
import { BestMatchRevealModal } from './components/BestMatchRevealModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { MatchesView } from './components/MatchesView';
import { MyDNAView } from './components/MyDNAView';

type AppStep = 'landing' | 'onboarding' | 'dna_preview' | 'discover';

export default function App() {
  // Navigation & Screen Steps
  const [step, setStep] = useState<AppStep>(() => {
    const saved = localStorage.getItem('nestmate_current_step') as AppStep | null;
    return saved && ['landing', 'onboarding', 'dna_preview', 'discover'].includes(saved)
      ? saved
      : 'landing';
  });

  const [activeTab, setActiveTab] = useState<'discover' | 'matches' | 'dna'>('discover');

  // Core Data State
  const [preferences, setPreferences] = useState<HousingPreferences>(loadStoredPreferences);
  const [dna, setDna] = useState<HousingDNA>(loadStoredDNA);
  const [interactions, setInteractions] = useState<SwipeInteraction[]>(loadStoredInteractions);
  const [likedIds, setLikedIds] = useState<string[]>(loadStoredLikedIds);

  // Preference Learning State
  const [hasLearnedUpdates, setHasLearnedUpdates] = useState<boolean>(() => {
    return localStorage.getItem('nestmate_has_learned_updates') === 'true';
  });
  const [activeInsight, setActiveInsight] = useState<LearnedInsight | null>(null);

  // Best Match Reveal State
  const [bestMatchModal, setBestMatchModal] = useState<PropertyMatchResult | null>(null);
  const [hasRevealedBestMatch, setHasRevealedBestMatch] = useState<boolean>(() => {
    return localStorage.getItem('nestmate_best_match_revealed') === 'true';
  });

  // Property Detail Inspection Modal
  const [inspectingProperty, setInspectingProperty] = useState<Property | null>(null);

  // Property Queue Index for Swipe Deck
  const [currentDeckIndex, setCurrentDeckIndex] = useState<number>(0);

  // Properties Map for O(1) lookup
  const propertiesMap = useMemo(() => {
    const map: Record<string, Property> = {};
    INITIAL_PROPERTIES.forEach(p => {
      map[p.id] = p;
    });
    return map;
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('nestmate_current_step', step);
  }, [step]);

  useEffect(() => {
    saveStoredPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    saveStoredDNA(dna);
  }, [dna]);

  useEffect(() => {
    saveStoredInteractions(interactions);
  }, [interactions]);

  useEffect(() => {
    saveStoredLikedIds(likedIds);
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem('nestmate_has_learned_updates', String(hasLearnedUpdates));
  }, [hasLearnedUpdates]);

  useEffect(() => {
    localStorage.setItem('nestmate_best_match_revealed', String(hasRevealedBestMatch));
  }, [hasRevealedBestMatch]);

  // Deterministically rank all properties based on current preferences & DNA
  const rankedResults = useMemo(() => {
    return rankProperties(INITIAL_PROPERTIES, preferences, dna, {
      preferQuietAndBright: hasLearnedUpdates
    });
  }, [preferences, dna, hasLearnedUpdates]);

  // Queue of remaining properties to explore in the swipe deck:
  // For the demo flow, we order the initial deck to guide the user naturally:
  // 1. Property A (noisy & dark, cheap & close)
  // 2. Property B (quiet & bright, with desk)
  // 3. Property D (peaceful attic skylight, bright, quiet)
  // 4. Property I (close, but dark & tight)
  // 5. Property E (the 96% match, will be revealed!)
  // 6. Property F (the suspicious scam demo listing)
  // followed by remaining properties
  const swipeDeck = useMemo(() => {
    const swipedIds = new Set(interactions.map(i => i.propertyId));
    let remaining = rankedResults.filter(r => !swipedIds.has(r.property.id));

    // If no interactions yet, prioritize the specific demo story queue
    if (interactions.length === 0) {
      const demoOrder = ['prop_a', 'prop_b', 'prop_d', 'prop_i', 'prop_e', 'prop_f', 'prop_c', 'prop_g', 'prop_h', 'prop_j'];
      const demoSorted: PropertyMatchResult[] = [];
      demoOrder.forEach(id => {
        const item = remaining.find(r => r.property.id === id);
        if (item) demoSorted.push(item);
      });
      // Append any leftovers
      remaining.forEach(r => {
        if (!demoSorted.some(d => d.property.id === r.property.id)) {
          demoSorted.push(r);
        }
      });
      return demoSorted;
    }

    // If DNA was updated and best match hasn't been revealed, ensure Property E is at top!
    if (hasLearnedUpdates && !hasRevealedBestMatch) {
      const propE = remaining.find(r => r.property.id === 'prop_e');
      if (propE) {
        return [propE, ...remaining.filter(r => r.property.id !== 'prop_e')];
      }
    }

    return remaining;
  }, [rankedResults, interactions, hasLearnedUpdates, hasRevealedBestMatch]);

  const currentMatchCard = swipeDeck[0] || null;

  // Liked properties list ranked for the Matches screen
  const likedMatches = useMemo(() => {
    const likedSet = new Set(likedIds);
    return rankedResults.filter(r => likedSet.has(r.property.id));
  }, [likedIds, rankedResults]);

  // Handler for Likes
  const handleLike = (property: Property) => {
    const interaction: SwipeInteraction = {
      userId: 'alex_dcu_demo',
      propertyId: property.id,
      action: 'like',
      timestamp: new Date().toISOString(),
      scoreAtInteraction: currentMatchCard?.score || 80,
      propertyTitle: property.title
    };

    const newInteractions = [...interactions, interaction];
    const newLikedIds = Array.from(new Set([...likedIds, property.id]));

    setInteractions(newInteractions);
    setLikedIds(newLikedIds);
    setCurrentDeckIndex(prev => prev + 1);

    // If user just liked Property E (the 96% match), trigger or conclude reveal
    if (property.id === 'prop_e' && !hasRevealedBestMatch) {
      setHasRevealedBestMatch(true);
    }

    // Check if learning threshold reached
    checkPreferenceLearning(newInteractions);
  };

  // Handler for Passes
  const handlePass = (property: Property) => {
    const interaction: SwipeInteraction = {
      userId: 'alex_dcu_demo',
      propertyId: property.id,
      action: 'pass',
      timestamp: new Date().toISOString(),
      scoreAtInteraction: currentMatchCard?.score || 80,
      propertyTitle: property.title
    };

    const newInteractions = [...interactions, interaction];
    setInteractions(newInteractions);
    setCurrentDeckIndex(prev => prev + 1);

    // Check if learning threshold reached
    checkPreferenceLearning(newInteractions);
  };

  // Preference learning checker
  const checkPreferenceLearning = (newInteractions: SwipeInteraction[]) => {
    if (hasLearnedUpdates || activeInsight) return;

    const insight = analyzeSwipeInteractions(
      newInteractions,
      dna,
      propertiesMap,
      hasLearnedUpdates
    );

    if (insight.hasInsight) {
      setTimeout(() => {
        setActiveInsight(insight);
      }, 500);
    }
  };

  // When user accepts "Update my DNA"
  const handleAcceptDNAUpdate = (updatedDNA: HousingDNA) => {
    setDna(updatedDNA);
    setHasLearnedUpdates(true);
    setActiveInsight(null);

    // Trigger the Best Match Reveal Modal for Property E (Glasnevin 96% match!)
    setTimeout(() => {
      const propE = INITIAL_PROPERTIES.find(p => p.id === 'prop_e');
      if (propE) {
        const matchE = calculatePropertyMatch(propE, preferences, updatedDNA, {
          preferQuietAndBright: true
        });
        setBestMatchModal(matchE);
        setHasRevealedBestMatch(true);
      }
    }, 400);
  };

  const handleKeepCurrentDNA = () => {
    setActiveInsight(null);
  };

  // Reset entire demo state
  const handleResetDemo = () => {
    resetDemoState();
    setPreferences(DEFAULT_PREFERENCES);
    setDna(DEFAULT_DNA);
    setInteractions([]);
    setLikedIds([]);
    setHasLearnedUpdates(false);
    setHasRevealedBestMatch(false);
    setActiveInsight(null);
    setBestMatchModal(null);
    setInspectingProperty(null);
    setCurrentDeckIndex(0);
    setStep('landing');
    setActiveTab('discover');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Universal Sticky Header */}
      <Header
        currentTab={activeTab}
        setCurrentTab={tab => {
          setActiveTab(tab);
          if (step !== 'discover') {
            setStep('discover');
          }
        }}
        matchesCount={likedIds.length}
        onResetDemo={handleResetDemo}
        onNavigateHome={() => setStep('landing')}
        hasLearnedUpdates={hasLearnedUpdates}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full max-w-5xl mx-auto">
        {step === 'landing' && (
          <LandingHero onStart={() => setStep('onboarding')} />
        )}

        {step === 'onboarding' && (
          <NaturalLanguageOnboarding
            onPreferencesBuilt={(extractedPrefs, extractedDna) => {
              setPreferences(extractedPrefs);
              setDna(extractedDna);
              setStep('dna_preview');
            }}
            onBackToLanding={() => setStep('landing')}
          />
        )}

        {step === 'dna_preview' && (
          <HousingDNAScreen
            preferences={preferences}
            dna={dna}
            onConfirmDNA={updatedDna => {
              setDna(updatedDna);
              setStep('discover');
              setActiveTab('discover');
            }}
            onEditPrompt={() => setStep('onboarding')}
          />
        )}

        {step === 'discover' && (
          <>
            {activeTab === 'discover' && (
              <SwipeDiscovery
                currentMatch={currentMatchCard}
                totalHomesCount={INITIAL_PROPERTIES.length}
                currentIndex={interactions.length}
                onLike={handleLike}
                onPass={handlePass}
                onOpenDetails={prop => setInspectingProperty(prop)}
                onResetDeck={() => setInteractions([])}
              />
            )}

            {activeTab === 'matches' && (
              <MatchesView
                likedMatches={likedMatches}
                onOpenDetails={prop => setInspectingProperty(prop)}
                onNavigateDiscover={() => setActiveTab('discover')}
              />
            )}

            {activeTab === 'dna' && (
              <MyDNAView
                preferences={preferences}
                dna={dna}
                interactions={interactions}
                hasLearnedUpdates={hasLearnedUpdates}
                onResetDemo={handleResetDemo}
              />
            )}
          </>
        )}
      </main>

      {/* THE CRITICAL MOMENT MODAL: NestMate noticed something */}
      {activeInsight && (
        <NoticedInsightModal
          insight={activeInsight}
          onAcceptUpdate={handleAcceptDNAUpdate}
          onKeepCurrent={handleKeepCurrentDNA}
        />
      )}

      {/* BEST MATCH REVEAL MODAL: 96% Match! */}
      {bestMatchModal && (
        <BestMatchRevealModal
          matchResult={bestMatchModal}
          onSaveToMatches={() => {
            if (!likedIds.includes(bestMatchModal.property.id)) {
              setLikedIds(prev => [...prev, bestMatchModal.property.id]);
            }
            setBestMatchModal(null);
            setActiveTab('matches');
          }}
          onClose={() => setBestMatchModal(null)}
          onViewFullDetails={() => {
            const prop = bestMatchModal.property;
            setBestMatchModal(null);
            setInspectingProperty(prop);
          }}
        />
      )}

      {/* PROPERTY DETAILS INSPECTION MODAL */}
      {inspectingProperty && (
        <PropertyDetailModal
          property={inspectingProperty}
          matchResult={
            rankedResults.find(r => r.property.id === inspectingProperty.id) ||
            calculatePropertyMatch(inspectingProperty, preferences, dna, {
              preferQuietAndBright: hasLearnedUpdates
            })
          }
          isLiked={likedIds.includes(inspectingProperty.id)}
          onLike={prop => {
            if (likedIds.includes(prop.id)) {
              setLikedIds(prev => prev.filter(id => id !== prop.id));
            } else {
              setLikedIds(prev => [...prev, prop.id]);
            }
          }}
          onClose={() => setInspectingProperty(null)}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200/60 py-4 px-4 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>NestMate</strong> by Finderr • AI-Powered Student Housing Discovery
          </span>
          <span className="text-stone-400">
            Dublin Rental Dataset (DCU / Glasnevin / Drumcondra)
          </span>
        </div>
      </footer>
    </div>
  );
}
