import { Property, Landlord } from '../types';

export const DEMO_LANDLORDS: Record<string, Landlord> = {
  landlord_001: {
    id: 'landlord_001',
    display_name: 'Jamie Murphy',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    description: 'DCU alumnus renting clean, student-friendly rooms in North Dublin.',
    contact: { email: 'jamie.murphy@dublinrentals.ie', phone: '+353 1 890 2410' },
    verified: true
  },
  landlord_002: {
    id: 'landlord_002',
    display_name: 'Elena Gallagher',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    description: 'Owner of period homes in Drumcondra and Phibsborough.',
    contact: { email: 'elena.g@drumcondrarentals.com' },
    verified: true
  },
  landlord_scam: {
    id: 'landlord_scam',
    display_name: 'David Overseas Property Holdings',
    photo_url: null,
    description: 'Private landlord currently based abroad on international mission.',
    contact: { email: 'exclusive.dublin.apartments@mail.ru' },
    verified: false
  }
};

export const INITIAL_PROPERTIES: Property[] = [
  // PROPERTY A: Cheap, close to campus, but noisy and dark
  {
    id: 'prop_a',
    landlord_id: 'landlord_001',
    title: 'Budget Ground-Floor Studio Room',
    area: 'Whitehall (Close to DCU)',
    monthlyRent: 760,
    utilitiesEstimate: 80,
    commuteMinutes: 12,
    commuteComparison: '€120 cheaper, but noisy street facing',
    description: 'Compact ground-floor room facing the main arterial road. Just a 12-minute walk to DCU Collins Avenue entrance. Basic furnishings, limited window light, and street noise from bus corridor.',
    naturalLightScore: 30,
    quietnessScore: 35,
    roomSizeScore: 40,
    socialScore: 50,
    publicTransportScore: 85,
    desk: false,
    furnished: true,
    amenities: ['Central Heating', 'High Speed Wifi', 'Washing Machine', 'Shared Garden'],
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 5,
    isSuspiciousDemo: false,
    tradeOff: 'Substantial street traffic noise and minimal direct sunlight throughout the day.',
    reasons: ['Extremely low rent (€760/mo)', 'Only 12 min walk to DCU campus'],
    household_description: 'Busy shared house with students coming and going frequently.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: [] }
  },

  // PROPERTY B: Slightly more expensive, quiet, bright and has a desk
  {
    id: 'prop_b',
    landlord_id: 'landlord_002',
    title: 'Sunlit Study Room with Garden View',
    area: 'Drumcondra',
    monthlyRent: 890,
    utilitiesEstimate: 75,
    commuteMinutes: 24,
    commuteComparison: '€890/mo • 24 min bus to DCU',
    description: 'Charming south-facing bedroom overlooking a leafy quiet cul-de-sac. Includes ergonomic oak study desk, high-speed fiber broadband, and peaceful study atmosphere.',
    naturalLightScore: 86,
    quietnessScore: 88,
    roomSizeScore: 70,
    socialScore: 55,
    publicTransportScore: 90,
    desk: true,
    furnished: true,
    amenities: ['Dedicated Desk & Chair', 'High Speed Wifi', 'Washing Machine & Dryer', 'Secure Bike Shed'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: 'Commute is 24 mins compared to immediate walking distance.',
    reasons: ['Bathed in natural daylight all afternoon', 'Dedicated ergonomic study desk', 'Quiet residential neighborhood'],
    household_description: 'Respectful postgraduate students who value quiet evening hours.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: ['Quiet hours after 22:30'] }
  },

  // PROPERTY C: Extremely close commute, but expensive
  {
    id: 'prop_c',
    landlord_id: 'landlord_001',
    title: 'Modern Campus-Edge En-suite Double',
    area: 'Ballymun Road (Opposite DCU)',
    monthlyRent: 1150,
    utilitiesEstimate: 110,
    commuteMinutes: 8,
    commuteComparison: '8 min walk, but €250 over budget',
    description: 'Ultra-modern private en-suite room in a newly renovated building right across the road from DCU Helix. High spec appliances and modern finishes, but priced significantly above standard student budget.',
    naturalLightScore: 75,
    quietnessScore: 65,
    roomSizeScore: 85,
    socialScore: 60,
    publicTransportScore: 95,
    desk: true,
    furnished: true,
    amenities: ['Private Ensuite Bathroom', 'Floor-to-Ceiling Wardrobes', 'Study Desk', 'Dishwasher', 'Secure Access'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: 'At €1,150/month, exceeds the €900 student budget by €250.',
    reasons: ['Virtually zero commute (8 min walk)', 'Luxury en-suite and large floorplan'],
    household_description: 'International students and young tech professionals.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: [] }
  },

  // PROPERTY D: Farther commute, beautiful bright room, quiet house
  {
    id: 'prop_d',
    landlord_id: 'landlord_002',
    title: 'Serene Attic Loft with Skylights',
    area: 'Clontarf / Marino Border',
    monthlyRent: 860,
    utilitiesEstimate: 70,
    commuteMinutes: 34,
    commuteComparison: '€860/mo • +10 min commute for exceptional calm',
    description: 'Bright and serene attic conversion with dual Velux skylights that flood the room with sunshine. Located in a tranquil residential borough. Spacious desk nook perfect for deep focus.',
    naturalLightScore: 92,
    quietnessScore: 90,
    roomSizeScore: 65,
    socialScore: 40,
    publicTransportScore: 82,
    desk: true,
    furnished: true,
    amenities: ['Dual Skylights', 'Wide Workstation Desk', 'High-Speed Wifi', 'Quiet Garden', 'Bike Storage'],
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: '34-minute public transport commute on the 14 or 16 bus lines.',
    reasons: ['Top tier natural daylight with sky views', 'Pin-drop quiet for exams and revision', 'Great value at €860/month'],
    household_description: 'Two quiet software developers who work from home.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: ['Shoes off inside'] }
  },

  // PROPERTY E: The eventual 96% Match!
  {
    id: 'prop_e',
    landlord_id: 'landlord_001',
    title: 'Quiet Botanical Double with Dedicated Study',
    area: 'Glasnevin (Near National Botanic Gardens)',
    monthlyRent: 880,
    utilitiesEstimate: 65,
    commuteMinutes: 28,
    commuteComparison: '€880/mo • 28 min direct bus 83/19 to DCU',
    description: 'Sun-drenched, tranquil double bedroom overlooking the rear gardens in peaceful Glasnevin. High ceilings, large sash windows, custom study desk with natural timber, within easy walking distance to grocery stores and direct DCU buses.',
    naturalLightScore: 94,
    quietnessScore: 92,
    roomSizeScore: 78,
    socialScore: 50,
    publicTransportScore: 92,
    desk: true,
    furnished: true,
    amenities: ['Large Solid Wood Desk', 'High-speed Fiber WiFi', 'Sash Windows', 'Washing Machine', 'Cycle Parking', 'Gas Heating'],
    images: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    isBestMatchDemo: true,
    tradeOff: 'Kitchen is slightly smaller than average with compact dining nook.',
    reasons: [
      'Perfect budget match at €880/mo (under €900 ceiling)',
      'Exceptional quietness score (92/100) in Glasnevin cul-de-sac',
      'Floor-to-ceiling daylight with morning & midday sun (94/100)',
      'Solid wooden ergonomic desk included',
      'Direct bus route to DCU campus in 28 mins'
    ],
    household_description: 'Friendly, mindful household of 2 final-year students who keep shared areas spotless.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: ['Quiet studying atmosphere'] }
  },

  // PROPERTY F: Suspicious scam-demo listing
  {
    id: 'prop_f',
    landlord_id: 'landlord_scam',
    title: 'Luxury City-Centre Ensuite Penthouse Room',
    area: 'Dublin 1 (O’Connell St / Henry St)',
    monthlyRent: 500,
    utilitiesEstimate: 0,
    commuteMinutes: 20,
    commuteComparison: 'Suspiciously cheap: €500 all bills included',
    description: 'Stunning luxury penthouse ensuite room for just €500 per month including all utility bills! Landlord currently abroad on mission in Spain for UNHCR. Deposit required today via wire transfer to hold the keys before viewing. No viewing possible before payment due to keys being held with DHL courier. Message me only on WhatsApp at +34 611 992 411.',
    naturalLightScore: 90,
    quietnessScore: 60,
    roomSizeScore: 95,
    socialScore: 70,
    publicTransportScore: 98,
    desk: true,
    furnished: true,
    amenities: ['Jacuzzi Bath', 'Balcony', 'Gym Access', 'Concierge', 'Bills Included'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [
      'Unusually low asking price (€500/mo in prime central Dublin)',
      'Pressure to pay deposit immediately today',
      'No physical or virtual viewing possible prior to payment',
      'Communication strictly moved off-platform to WhatsApp (+34 foreign number)',
      'Landlord claims to be working abroad on mission',
      'Untraceable courier key delivery story'
    ],
    riskScore: 88,
    isSuspiciousDemo: true,
    tradeOff: 'Extreme scam risk indicators detected across listing copy and payment terms.',
    reasons: ['Suspiciously low price flag', 'Deposit before viewing requested'],
    household_description: 'Unverified listing details.',
    rules: { smoking_indoors_allowed: true, pets_allowed: true, additional_rules: [] }
  },

  // PROPERTY G: Phibsborough Victorian room
  {
    id: 'prop_g',
    landlord_id: 'landlord_002',
    title: 'High-Ceiling Period Double Room',
    area: 'Phibsborough',
    monthlyRent: 840,
    utilitiesEstimate: 70,
    commuteMinutes: 22,
    commuteComparison: '€840/mo • 22 min commute via Bus 9/83',
    description: 'Bright first-floor room in a refurbished redbrick Victorian terrace. High ceilings, original decorative fireplace, dedicated desk by south-facing sash window. Short walk to Royal Canal and cafes.',
    naturalLightScore: 82,
    quietnessScore: 78,
    roomSizeScore: 72,
    socialScore: 65,
    publicTransportScore: 94,
    desk: true,
    furnished: true,
    amenities: ['High Ceilings', 'Study Desk', 'Washing Machine', 'Dishwasher', 'Canal Walks'],
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: 'Bathroom shared with two other tenants.',
    reasons: ['Vibrant neighborhood with excellent transit', 'Well under €900 budget ceiling'],
    household_description: 'Two masters students at DCU and Trinity.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: [] }
  },

  // PROPERTY H: Santry modern apartment room
  {
    id: 'prop_h',
    landlord_id: 'landlord_001',
    title: 'Parkside Double in Northwood',
    area: 'Santry',
    monthlyRent: 895,
    utilitiesEstimate: 85,
    commuteMinutes: 18,
    commuteComparison: '18 min direct bike / 20 min bus to DCU',
    description: 'Modern bedroom overlooking Santry Demesne parklands. Safe, well-managed complex with gym, supermarket, and running trails on doorstep. Quiet study nook with desk.',
    naturalLightScore: 78,
    quietnessScore: 84,
    roomSizeScore: 74,
    socialScore: 50,
    publicTransportScore: 88,
    desk: true,
    furnished: true,
    amenities: ['Desk & Swivel Chair', 'Balcony', 'Secure Bike Storage', 'On-site Gym', 'Park Views'],
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: 'Slightly higher utility costs during winter heating season.',
    reasons: ['Parkland views and fresh air', 'Close commute to DCU Sports Complex'],
    household_description: 'Quiet professional tenant working in Dublin Airport.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: [] }
  },

  // PROPERTY I: Whitehall dark close room
  {
    id: 'prop_i',
    landlord_id: 'landlord_001',
    title: 'Compact Single Room Near Swords Road',
    area: 'Whitehall',
    monthlyRent: 790,
    utilitiesEstimate: 70,
    commuteMinutes: 14,
    commuteComparison: '14 min to campus, but tight space and dark rear alley',
    description: 'Functional single room close to DCU campus. Basic furniture, small single bed, no dedicated study desk. Window opens onto narrow rear alleyway with minimal morning light.',
    naturalLightScore: 35,
    quietnessScore: 45,
    roomSizeScore: 35,
    socialScore: 60,
    publicTransportScore: 90,
    desk: false,
    furnished: true,
    amenities: ['Gas Central Heating', 'Washing Machine', 'Broadband'],
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: 'No desk space and dim natural lighting.',
    reasons: ['Convenient 14 min walk to DCU lectures', 'Modest rent at €790/mo'],
    household_description: 'Four undergraduate students.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: [] }
  },

  // PROPERTY J: Beaumont cul-de-sac house
  {
    id: 'prop_j',
    landlord_id: 'landlord_002',
    title: 'Tranquil Suburban Bedroom with Desk',
    area: 'Beaumont',
    monthlyRent: 830,
    utilitiesEstimate: 60,
    commuteMinutes: 26,
    commuteComparison: '€830/mo • 26 min bus or 12 min cycling',
    description: 'Bright double bedroom situated in a peaceful family cul-de-sac. Excellent natural light, built-in study desk, garden view, and respectful housemates.',
    naturalLightScore: 84,
    quietnessScore: 89,
    roomSizeScore: 68,
    socialScore: 45,
    publicTransportScore: 84,
    desk: true,
    furnished: true,
    amenities: ['Built-in Desk', 'Garden View', 'Superfast Wifi', 'Free Street Parking'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80'
    ],
    riskSignals: [],
    riskScore: 0,
    isSuspiciousDemo: false,
    tradeOff: 'Requires 8-minute walk to main bus stop.',
    reasons: ['Quiet neighborhood ideal for study', 'Great natural daylight'],
    household_description: 'Postgraduate student and a nurse at Beaumont Hospital.',
    rules: { smoking_indoors_allowed: false, pets_allowed: false, additional_rules: [] }
  }
];
