import type { Avatar } from './types';

export const AVATARS: Avatar[] = [
  { id: 1, name: 'Emily', imageUrl: '/images/Emily.png', gender: 'female', ageGroup: 'Young Adult', situation: 'Studio', isPro: true, isHD: true },
  { id: 2, name: 'Marc', imageUrl: '/images/Marc.png', gender: 'male', ageGroup: 'Adult', situation: 'Office', isPro: false, isHD: true },
  { id: 3, name: 'Thomas', imageUrl: '/images/Thomas.png', gender: 'male', ageGroup: 'Adult', situation: 'Formal', isPro: true, isHD: true },
];

export const LOADING_MESSAGES: string[] = [
    "Warming up the AI video engine...",
    "Analyzing avatar characteristics...",
    "Syncing script with lip movements...",
    "Rendering high-fidelity frames...",
    "Applying hyperrealistic textures...",
    "Encoding audio and video streams...",
    "Performing final quality checks...",
    "Almost there, polishing the final cut..."
];