import { HousingPreferences, HousingDNA, SwipeInteraction, Property } from '../types';
import { INITIAL_PROPERTIES } from '../data/properties';

const STORAGE_KEYS = {
  PREFERENCES: 'nestmate_preferences',
  DNA: 'nestmate_dna',
  INTERACTIONS: 'nestmate_interactions',
  LIKED_IDS: 'nestmate_liked_ids',
  PASSED_IDS: 'nestmate_passed_ids',
  STEP: 'nestmate_current_step',
  INSIGHT_TRIGGERED: 'nestmate_insight_triggered',
  BEST_MATCH_REVEALED: 'nestmate_best_match_revealed'
};

export const DEFAULT_PREFERENCES: HousingPreferences = {
  budgetMax: 900,
  destination: 'DCU (Dublin City University)',
  maxCommuteMinutes: 35,
  weights: {
    affordability: 0.95,
    commute: 0.90,
    quietness: 0.70,
    naturalLight: 0.40,
    desk: 0.80,
    space: 0.30,
    socialAtmosphere: 0.25,
    publicTransport: 0.85
  },
  dealbreakers: ['smoking_indoors'],
  summary: 'Student at DCU looking for quiet, affordable housing with good commute and desk space.',
  mustHaveDesk: true
};

export const DEFAULT_DNA: HousingDNA = {
  affordability: 95,
  commute: 90,
  quietness: 70,
  naturalLight: 40,
  desk: 80,
  space: 30,
  socialAtmosphere: 25,
  publicTransport: 85
};

export function loadStoredPreferences(): HousingPreferences {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return item ? JSON.parse(item) : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: HousingPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences to localStorage', e);
  }
}

export function loadStoredDNA(): HousingDNA {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.DNA);
    return item ? JSON.parse(item) : DEFAULT_DNA;
  } catch {
    return DEFAULT_DNA;
  }
}

export function saveStoredDNA(dna: HousingDNA): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DNA, JSON.stringify(dna));
  } catch (e) {
    console.error('Failed to save DNA to localStorage', e);
  }
}

export function loadStoredInteractions(): SwipeInteraction[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function saveStoredInteractions(interactions: SwipeInteraction[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(interactions));
  } catch (e) {
    console.error('Failed to save interactions', e);
  }
}

export function loadStoredLikedIds(): string[] {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.LIKED_IDS);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function saveStoredLikedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LIKED_IDS, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save liked IDs', e);
  }
}

export function resetDemoState(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }
}
