import type { Avatar } from './types';

export const AVATARS: Avatar[] = [
  { id: 1, name: 'Jasmine', imageUrl: 'https://t3.ftcdn.net/jpg/02/22/85/16/360_F_222851624_jfoMGbJxwRi5AWGdPgXKSABMnzCQo9RN.jpg', gender: 'female', ageGroup: 'Young Adult', situation: 'AI Avatar', isPro: false, isHD: true },
  { id: 2, name: 'Marcus', imageUrl: 'https://i.ibb.co/yqg6j5v/marcus.jpg', gender: 'male', ageGroup: 'Adult', situation: 'AI Avatar', isPro: false, isHD: true },
  { id: 3, name: 'Isabella', imageUrl: 'https://i.ibb.co/S6KxG36/isabella.jpg', gender: 'female', ageGroup: 'Adult', situation: 'Formal', isPro: true, isHD: true },
  { id: 4, name: 'Leo', imageUrl: 'https://i.ibb.co/gDFC4Cg/leo.jpg', gender: 'male', ageGroup: 'Young Adult', situation: 'Gaming', isPro: false, isHD: true },
  { id: 5, name: 'Sophia', imageUrl: 'https://i.ibb.co/hKScJ5v/sophia.jpg', gender: 'female', ageGroup: 'Adult', situation: 'Coffee Shop', isPro: true, isHD: true },
  { id: 6, name: 'Ethan', imageUrl: 'https://i.ibb.co/kHnL2qG/ethan.jpg', gender: 'male', ageGroup: 'Adult', situation: 'Gym', isPro: false, isHD: false },
  { id: 7, name: 'Olivia', imageUrl: 'https://i.ibb.co/5cQG3dK/olivia.jpg', gender: 'female', ageGroup: 'Young Adult', situation: 'Beach', isPro: true, isHD: true },
  { id: 8, name: 'Nathan', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', gender: 'male', ageGroup: 'Adult', situation: 'AI Avatar', isPro: false, isHD: true },
  { id: 9, name: 'Charlotte', imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c58f?w=400&h=400&fit=crop', gender: 'female', ageGroup: 'Adult', situation: 'Formal', isPro: true, isHD: true },
  { id: 10, name: 'Robert', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', gender: 'male', ageGroup: 'Senior', situation: 'AI Avatar', isPro: false, isHD: true },
  { id: 11, name: 'Sydney', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', gender: 'female', ageGroup: 'Young Adult', situation: 'ASMR', isPro: true, isHD: true },
  { id: 12, name: 'Skylar', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', gender: 'male', ageGroup: 'Young Adult', situation: 'Green Screen', isPro: true, isHD: true },
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