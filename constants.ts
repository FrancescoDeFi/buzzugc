import type { Avatar } from './types';

// Avatars gallery. Includes original avatars plus the new aesthetic images
export const AVATARS: Avatar[] = [
  { id: 1, name: 'Emily', imageUrl: '/images/Emily.png', gender: 'female', ageGroup: 'Young Adult', situation: 'Studio', isPro: true, isHD: true },
  { id: 2, name: 'Marc', imageUrl: '/images/Marc.png', gender: 'male', ageGroup: 'Adult', situation: 'Office', isPro: false, isHD: true },
  { id: 3, name: 'Thomas', imageUrl: '/images/Thomas.png', gender: 'male', ageGroup: 'Adult', situation: 'Formal', isPro: true, isHD: true },

  // Aesthetic set (mapped to filters: gender, ageGroup, situation)
  { id: 4,  name: 'Studio Noir',         imageUrl: '/images/buzzugc-aesthetic-01.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Studio',      isPro: true,  isHD: true },
  { id: 5,  name: 'Corporate Chic',      imageUrl: '/images/buzzugc-aesthetic-02.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Office',      isPro: false, isHD: true },
  { id: 6,  name: 'Coastal Glow',        imageUrl: '/images/buzzugc-aesthetic-03.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Beach',       isPro: true,  isHD: true },
  { id: 7,  name: 'Espresso Vibes',      imageUrl: '/images/buzzugc-aesthetic-04.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Coffee Shop', isPro: false, isHD: true },
  { id: 8,  name: 'Evening Gala',        imageUrl: '/images/buzzugc-aesthetic-05.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Formal',      isPro: true,  isHD: true },
  { id: 9,  name: 'Neon Gamer',          imageUrl: '/images/buzzugc-aesthetic-06.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Gaming',      isPro: false, isHD: true },
  { id:10,  name: 'Athletic Edge',       imageUrl: '/images/buzzugc-aesthetic-07.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Gym',         isPro: false, isHD: true },
  { id:11,  name: 'Studio Glow',         imageUrl: '/images/buzzugc-aesthetic-08.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Studio',      isPro: true,  isHD: true },
  { id:12,  name: 'Desk Focus',          imageUrl: '/images/buzzugc-aesthetic-09.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Office',      isPro: true,  isHD: true },
  { id:13,  name: 'Sunset Breeze',       imageUrl: '/images/buzzugc-aesthetic-10.jpeg', gender: 'male',   ageGroup: 'Young Adult', situation: 'Beach',       isPro: false, isHD: true },
  { id:14,  name: 'Cafe Warmth',         imageUrl: '/images/buzzugc-aesthetic-11.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Coffee Shop', isPro: false, isHD: true },
  { id:15,  name: 'Formal Portrait',     imageUrl: '/images/buzzugc-aesthetic-12.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Formal',      isPro: true,  isHD: true },
  { id:16,  name: 'Cyber Grid',          imageUrl: '/images/buzzugc-aesthetic-13.jpeg', gender: 'male',   ageGroup: 'Young Adult', situation: 'Gaming',      isPro: false, isHD: true },
  { id:17,  name: 'Fit Focus',           imageUrl: '/images/buzzugc-aesthetic-14.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Gym',         isPro: false, isHD: true },
  { id:18,  name: 'Studio Classic',      imageUrl: '/images/buzzugc-aesthetic-15.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Studio',      isPro: true,  isHD: true },
  { id:19,  name: 'Executive Tone',      imageUrl: '/images/buzzugc-aesthetic-16.jpeg', gender: 'male',   ageGroup: 'Senior',      situation: 'Office',      isPro: false, isHD: true },
  { id:20,  name: 'Seafoam Light',       imageUrl: '/images/buzzugc-aesthetic-17.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Beach',       isPro: false, isHD: true },
  { id:21,  name: 'City Roast',          imageUrl: '/images/buzzugc-aesthetic-18.jpeg', gender: 'male',   ageGroup: 'Young Adult', situation: 'Coffee Shop', isPro: false, isHD: true },
  { id:22,  name: 'Black Tie',           imageUrl: '/images/buzzugc-aesthetic-19.jpeg', gender: 'female', ageGroup: 'Senior',      situation: 'Formal',      isPro: true,  isHD: true },
  { id:23,  name: 'Retro Neon',          imageUrl: '/images/buzzugc-aesthetic-20.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Gaming',      isPro: false, isHD: true },
  { id:24,  name: 'Power Lift',          imageUrl: '/images/buzzugc-aesthetic-21.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Gym',         isPro: false, isHD: true },
  { id:25,  name: 'Soft Studio',         imageUrl: '/images/buzzugc-aesthetic-22.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Studio',      isPro: true,  isHD: true },
  { id:26,  name: 'Boardroom Bright',    imageUrl: '/images/buzzugc-aesthetic-23.jpeg', gender: 'female', ageGroup: 'Senior',      situation: 'Office',      isPro: false, isHD: true },
  { id:27,  name: 'Azure Shore',         imageUrl: '/images/buzzugc-aesthetic-24.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Beach',       isPro: false, isHD: true },
  { id:28,  name: 'Mocha Moment',        imageUrl: '/images/buzzugc-aesthetic-25.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Coffee Shop', isPro: false, isHD: true },
  { id:29,  name: 'Velvet Tux',          imageUrl: '/images/buzzugc-aesthetic-26.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Formal',      isPro: true,  isHD: true },
  { id:30,  name: 'Spectrum Gamer',      imageUrl: '/images/buzzugc-aesthetic-27.jpeg', gender: 'female', ageGroup: 'Young Adult', situation: 'Gaming',      isPro: false, isHD: true },
  { id:31,  name: 'Cardio Drive',        imageUrl: '/images/buzzugc-aesthetic-28.jpeg', gender: 'female', ageGroup: 'Adult',       situation: 'Gym',         isPro: false, isHD: true },
  { id:32,  name: 'Monochrome Stage',    imageUrl: '/images/buzzugc-aesthetic-29.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Studio',      isPro: true,  isHD: true },
  { id:33,  name: 'Open Office',         imageUrl: '/images/buzzugc-aesthetic-30.jpeg', gender: 'male',   ageGroup: 'Adult',       situation: 'Office',      isPro: false, isHD: true },
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
