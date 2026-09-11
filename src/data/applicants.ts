import { TenantApplicant } from '../types';

export const INITIAL_APPLICANTS: TenantApplicant[] = [
  {
    id: 'app_alex',
    propertyId: 'prop_e', // Botanical Garden View House, Glasnevin
    applicantName: 'Alex Murphy',
    program: 'MSc Data Analytics, DCU',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    compatibilityScore: 96,
    compatibilitySummary: 'Exceptional lifestyle alignment: seeks quiet study atmosphere, morning circadian rhythm, respectful of garden space.',
    dnaMatchHighlight: '95% quietness match, 90% natural light priority, non-smoker, dedicated study desk required.',
    status: 'pending',
    appliedAt: '25 mins ago',
    bio: 'Postgraduate student at DCU School of Computing. Looking for a quiet, sunlit room within cycling distance. Tidy, focused on thesis, enjoys cooking quiet dinners.',
    verifiedStudent: true,
    budgetMax: 900,
    cleanlinessHabit: 'Very High (Weekly rota)'
  },
  {
    id: 'app_siobhan',
    propertyId: 'prop_e',
    applicantName: 'Siobhán Kelly',
    program: 'PhD Biotechnology, DCU',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    compatibilityScore: 91,
    compatibilitySummary: 'Strong match: quiet schedule, research-oriented, long-term 12-month lease requested.',
    dnaMatchHighlight: '88% quietness match, respects quiet hours after 10 PM, excellent reference from previous Drumcondra landlord.',
    status: 'viewing_invited',
    appliedAt: '2 hours ago',
    bio: 'Biochem researcher working in DCU labs. Quiet routine, keeps common spaces spotless.',
    verifiedStudent: true,
    budgetMax: 920,
    cleanlinessHabit: 'High'
  },
  {
    id: 'app_liam',
    propertyId: 'prop_e',
    applicantName: 'Liam Byrne',
    program: 'Final Year Business & Spanish, DCU',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    compatibilityScore: 68,
    compatibilitySummary: 'Moderate match: prefers active social household with weekend guests, higher noise tolerance than this household.',
    dnaMatchHighlight: 'Household quietness rule is 90/100, but Liam values social weekend hosting (social preference 80/100).',
    status: 'pending',
    appliedAt: 'Yesterday',
    bio: 'Active student union member. Often has study groups and friends over on weekends.',
    verifiedStudent: true,
    budgetMax: 870,
    cleanlinessHabit: 'Moderate'
  },
  {
    id: 'app_chloe',
    propertyId: 'prop_b', // Griffith Avenue
    applicantName: 'Chloe Zhang',
    program: 'BSc Computer Applications, DCU',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    compatibilityScore: 89,
    compatibilitySummary: 'High commute match: loves cycling on tree-lined avenue, requires fast Wi-Fi and desk space.',
    dnaMatchHighlight: 'Commute under 15 mins, budget well within €840 limit.',
    status: 'pending',
    appliedAt: '3 hours ago',
    bio: '3rd year student doing internship nearby. Clean and friendly.',
    verifiedStudent: true,
    budgetMax: 880,
    cleanlinessHabit: 'High'
  }
];
