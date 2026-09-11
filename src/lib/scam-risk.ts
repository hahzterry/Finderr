import { Property, RiskAnalysisResult } from '../types';

export function calculateListingRisk(property: Property): RiskAnalysisResult {
  const desc = (property.description || '').toLowerCase();
  const signals: string[] = [];
  let score = 0;

  // 1. Unusually low rent rule (+20 pts)
  // Central Dublin rooms under €650/mo with luxury claims are high risk
  if (property.monthlyRent < 650 && property.area.toLowerCase().includes('dublin 1') || property.monthlyRent <= 550) {
    score += 20;
    signals.push('Unusually low asking price for central Dublin (€' + property.monthlyRent + '/mo)');
  }

  // 2. Deposit requested urgently rule (+25 pts)
  if (
    desc.includes('deposit required today') ||
    desc.includes('pay immediately') ||
    desc.includes('hold the keys before viewing') ||
    desc.includes('urgent deposit')
  ) {
    score += 25;
    signals.push('High pressure to transfer deposit urgently');
  }

  // 3. Landlord unavailable for viewing rule (+20 pts)
  if (
    desc.includes('no viewing possible') ||
    desc.includes('currently abroad') ||
    desc.includes('keys being held with') ||
    desc.includes('out of the country')
  ) {
    score += 20;
    signals.push('Landlord claims to be abroad with no physical viewing possible');
  }

  // 4. Off-platform-only communication rule (+15 pts)
  if (
    desc.includes('whatsapp') ||
    desc.includes('message me only') ||
    desc.includes('telegram') ||
    desc.includes('contact me directly on')
  ) {
    score += 15;
    signals.push('Communication strictly diverted off-platform to external messaging');
  }

  // 5. Vague landlord identity rule (+10 pts)
  if (
    property.landlord?.verified === false ||
    desc.includes('unhcr') ||
    desc.includes('international mission') ||
    desc.includes('overseas property holdings')
  ) {
    score += 10;
    signals.push('Unverified landlord identity and foreign phone coordinates');
  }

  // 6. Suspicious payment language rule (+10 pts)
  if (
    desc.includes('wire transfer') ||
    desc.includes('western union') ||
    desc.includes('courier') ||
    desc.includes('crypto')
  ) {
    score += 10;
    signals.push('Untraceable payment or courier delivery method requested');
  }

  // If the property already has pre-seeded riskSignals, combine them
  if (property.riskSignals && property.riskSignals.length > 0) {
    for (const sig of property.riskSignals) {
      if (!signals.includes(sig)) {
        signals.push(sig);
      }
    }
  }

  // Bound score
  const finalScore = Math.min(100, Math.max(score, property.riskScore || 0));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (finalScore >= 60) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 30) {
    riskLevel = 'MEDIUM';
  }

  let recommendation = 'Listing appears consistent with standard verified rental indicators.';
  if (riskLevel === 'HIGH') {
    recommendation =
      'NestMate recommends verifying the property and landlord identity through an accredited PRTB registry before sending any deposit or personal documentation.';
  } else if (riskLevel === 'MEDIUM') {
    recommendation =
      'Exercise standard due diligence. Request an in-person viewing and lease agreement prior to transferring funds.';
  }

  return {
    riskScore: finalScore,
    riskLevel,
    signals,
    recommendation
  };
}
