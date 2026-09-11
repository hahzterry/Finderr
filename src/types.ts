export interface HousingWeights {
  affordability: number; // 0 to 1
  commute: number;
  quietness: number;
  naturalLight: number;
  desk: number;
  space: number;
  socialAtmosphere: number;
  publicTransport: number;
}

export interface HousingPreferences {
  budgetMax: number;
  destination: string;
  maxCommuteMinutes: number;
  weights: HousingWeights;
  dealbreakers: string[];
  summary: string;
  mustHaveDesk: boolean;
}

export interface HousingDNA {
  affordability: number; // 0 to 100
  commute: number;
  quietness: number;
  naturalLight: number;
  space: number;
  socialAtmosphere: number;
  publicTransport: number;
  desk: number;
}

export interface LandlordContact {
  email: string;
  phone?: string | null;
}

export interface Landlord {
  id: string;
  display_name: string;
  photo_url?: string | null;
  description: string;
  contact: LandlordContact;
  verified?: boolean;
}

export interface PropertyLocation {
  area_label: string;
  latitude: number;
  longitude: number;
}

export interface PropertyPricing {
  monthly_rent: number;
  currency: string;
  bills_included: boolean;
  estimated_monthly_bills: number;
  deposit: number;
}

export interface PropertyAccommodation {
  type: string;
  private_bedrooms_included: number;
  room_area_m2: number;
  max_occupants: number;
  other_residents_count: number;
  landlord_lives_here: boolean;
}

export interface PropertyCharacteristics {
  quietness: number; // 0-10 or 0-100
  natural_light: number;
  room_size: number;
  public_transport_access: number;
  household_sociability: number;
}

export interface Property {
  id: string;
  landlord_id: string;
  title: string;
  area: string;
  monthlyRent: number;
  utilitiesEstimate: number;
  commuteMinutes: number;
  commuteComparison?: string; // e.g. "€70 cheaper, but +12 min commute"
  description: string;
  naturalLightScore: number; // 0-100
  quietnessScore: number; // 0-100
  roomSizeScore: number; // 0-100
  socialScore: number; // 0-100
  publicTransportScore: number; // 0-100
  desk: boolean;
  furnished: boolean;
  amenities: string[];
  images: string[];
  riskSignals: string[];
  riskScore: number; // 0-100
  isSuspiciousDemo?: boolean;
  isBestMatchDemo?: boolean;
  tradeOff?: string;
  reasons?: string[];
  landlord?: Landlord;
  household_description?: string;
  rules?: {
    smoking_indoors_allowed: boolean;
    pets_allowed: boolean;
    additional_rules: string[];
  };
}

export interface MatchScoreBreakdown {
  budgetScore: number; // e.g. out of 25
  commuteScore: number; // out of 20
  lifestyleScore: number; // out of 30
  learnedScore: number; // out of 15
  amenitiesScore: number; // out of 10
}

export interface PropertyMatchResult {
  property: Property;
  score: number; // 0-100
  breakdown: MatchScoreBreakdown;
  topReasons: string[];
  tradeOff: string;
  aiExplanation?: string;
}

export interface SwipeInteraction {
  userId: string;
  propertyId: string;
  action: 'like' | 'pass';
  timestamp: string;
  scoreAtInteraction: number;
  propertyTitle: string;
}

export interface LearnedInsight {
  hasInsight: boolean;
  title: string;
  message: string;
  discovery: string;
  previousDna: HousingDNA;
  suggestedDna: HousingDNA;
  reasons: string[];
  statsSnippet?: string;
}

export interface RiskAnalysisResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  signals: string[];
  recommendation: string;
  aiSummary?: string;
}
