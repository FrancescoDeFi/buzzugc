
import React from 'react';
import type { Avatar } from '../types';

interface AvatarCardProps {
  avatar: Avatar;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const AvatarCard: React.FC<AvatarCardProps> = ({ avatar, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(avatar.id)}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 group ${
        isSelected ? 'ring-4 ring-brand-primary shadow-2xl shadow-brand-primary/30' : 'ring-2 ring-transparent hover:ring-brand-primary/50'
      }`}
    >
      <img src={avatar.imageUrl} alt={avatar.name} className="w-full h-full object-cover aspect-square" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 text-center bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isSelected ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'
        }`}
      >
        <h3 className="text-lg font-bold text-white">{avatar.name}</h3>
      </div>
    </div>
  );
};

export default AvatarCard;
