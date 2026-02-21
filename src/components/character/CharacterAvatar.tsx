
import React from 'react';
import { AvatarConfig, CharacterClass } from '@/types';
import { clsx } from 'clsx';

interface CharacterAvatarProps {
    config: AvatarConfig;
    characterClass: CharacterClass;
    className?: string;
    glow?: boolean;
}

export const CharacterAvatar = ({ config, characterClass, className, glow }: CharacterAvatarProps) => {
    const classColors: Record<CharacterClass, string> = {
        warrior: '#ef4444', // red/iron
        mage: '#7c3aed',    // purple robe
        rogue: '#1e1e2d',   // dark hood
        scholar: '#b45309', // brown/amber coat
        creator: '#ec4899', // pink/vibrant
    };

    const outfitColor = classColors[characterClass];

    return (
        <div className={clsx('relative aspect-square bg-muted/20 flex items-center justify-center overflow-hidden border border-border/50', className, glow && 'shadow-[0_0_30px_rgba(245,197,24,0.4)] border-primary/50 anim-pulse')}>
            {config.imageUrl ? (
                <div className="relative w-full h-full">
                    <img
                        src={config.imageUrl}
                        alt="Character Avatar"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />
                </div>
            ) : (
                <svg viewBox="0 0 100 100" className="w-[80%] h-[80%]">
                    {/* Shadow */}
                    <ellipse cx="50" cy="90" rx="30" ry="5" fill="black" opacity="0.2" />

                    {/* Body/Outfit */}
                    <path
                        d={config.bodyType === 0 ? "M20 90 Q50 30 80 90 Z" : "M25 90 L35 40 L65 40 L75 90 Z"}
                        fill={outfitColor}
                        stroke="black"
                        strokeWidth="1"
                    />

                    {/* Face */}
                    <circle cx="50" cy="35" r="18" fill={config.skinTone} stroke="black" strokeWidth="1" />

                    {/* Eyes */}
                    <circle cx="43" cy="35" r="2" fill={config.eyeColor} />
                    <circle cx="57" cy="35" r="2" fill={config.eyeColor} />

                    {/* Hair Styles */}
                    {config.hairStyle === 0 && (
                        <path d="M32 30 Q50 10 68 30 Q50 25 32 30Z" fill={config.hairColor} stroke="black" strokeWidth="0.5" />
                    )}
                    {config.hairStyle === 1 && (
                        <path d="M32 35 Q50 5 68 35 L68 45 Q50 35 32 45 Z" fill={config.hairColor} stroke="black" strokeWidth="0.5" />
                    )}
                    {config.hairStyle === 2 && (
                        <path d="M32 35 L32 20 Q50 15 68 20 L68 35 Z" fill={config.hairColor} stroke="black" strokeWidth="0.5" />
                    )}

                    {/* Class Specific Decorations */}
                    {characterClass === 'mage' && (
                        <path d="M40 20 L50 5 L60 20 Z" fill={outfitColor} stroke="black" strokeWidth="0.5" />
                    )}
                    {characterClass === 'warrior' && (
                        <path d="M45 25 H55 V30 H45 Z" fill="#94a3b8" stroke="black" strokeWidth="0.5" />
                    )}
                </svg>
            )}

            {glow && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            )}
        </div>
    );
};
