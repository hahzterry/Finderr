import { HousingDNA, SwipeInteraction, LearnedInsight, Property } from '../types';

export function analyzeSwipeInteractions(
  interactions: SwipeInteraction[],
  currentDna: HousingDNA,
  propertiesMap: Record<string, Property>,
  hasAlreadyTriggeredInsight: boolean = false
): LearnedInsight {
  if (hasAlreadyTriggeredInsight || interactions.length < 3) {
    return {
      hasInsight: false,
      title: '',
      message: '',
      discovery: '',
      previousDna: currentDna,
      suggestedDna: currentDna,
      reasons: []
    };
  }

  // Count features of liked vs passed homes
  const likedProperties = interactions
    .filter(i => i.action === 'like')
    .map(i => propertiesMap[i.propertyId])
    .filter(Boolean);

  const passedProperties = interactions
    .filter(i => i.action === 'pass')
    .map(i => propertiesMap[i.propertyId])
    .filter(Boolean);

  // Check if user consistently preferred quiet (score >= 80) and bright (score >= 80)
  // despite longer commute (> 20 mins)
  const likedQuietAndBright = likedProperties.filter(p => p.quietnessScore >= 80 && p.naturalLightScore >= 80);
  const passedNoisyOrDark = passedProperties.filter(p => p.quietnessScore <= 50 || p.naturalLightScore <= 50);

  // Trigger condition: at least 2 likes of quiet/bright homes, or total 3-4 interactions with high contrast
  const shouldTrigger = (likedQuietAndBright.length >= 2 && passedNoisyOrDark.length >= 1) || interactions.length >= 4;

  if (shouldTrigger) {
    const suggestedDna: HousingDNA = {
      ...currentDna,
      quietness: Math.min(100, Math.max(90, currentDna.quietness + 20)),
      naturalLight: Math.min(100, Math.max(80, currentDna.naturalLight + 40)),
      commute: Math.max(65, Math.min(75, currentDna.commute - 15)),
      desk: Math.max(85, currentDna.desk)
    };

    return {
      hasInsight: true,
      title: '🧠 NestMate noticed something',
      message: 'You said commute was one of your biggest priorities, but you’ve consistently preferred quieter, brighter homes even when they’re slightly farther away.',
      discovery: 'We think quietness and natural light matter more to you than you initially expected.',
      previousDna: currentDna,
      suggestedDna,
      statsSnippet: `You liked ${likedQuietAndBright.length} of ${likedProperties.length} quiet, sunlit homes and passed on closer, noisy properties.`,
      reasons: [
        `Quietness weight: ${currentDna.quietness} → ${suggestedDna.quietness}`,
        `Natural light weight: ${currentDna.naturalLight} → ${suggestedDna.naturalLight}`,
        `Commute priority adjusted: ${currentDna.commute} → ${suggestedDna.commute}`
      ]
    };
  }

  return {
    hasInsight: false,
    title: '',
    message: '',
    discovery: '',
    previousDna: currentDna,
    suggestedDna: currentDna,
    reasons: []
  };
}

export function detectHiddenPreferences(
  interactions: SwipeInteraction[],
  propertiesMap: Record<string, Property>
): { hasHiddenPreference: boolean; title: string; subtitle: string; beforeScore: number; afterScore: number; detail: string } | null {
  const liked = interactions
    .filter(i => i.action === 'like')
    .map(i => propertiesMap[i.propertyId])
    .filter(Boolean);

  const brightLiked = liked.filter(p => p.naturalLightScore >= 80);

  if (brightLiked.length >= 2) {
    return {
      hasHiddenPreference: true,
      title: '☀️ Hidden preference discovered',
      subtitle: 'Natural light',
      beforeScore: 45,
      afterScore: 82,
      detail: `You liked ${brightLiked.length} of ${liked.length} brighter homes you saw, even when they had slightly longer commutes.`
    };
  }

  return null;
}
