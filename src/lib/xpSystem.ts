
import { QuestDifficulty, QuestCategory, Character, CharacterClass, CharacterStats } from '../types';

export const XP_REWARDS: Record<QuestDifficulty, number> = {
    trivial: 25,
    easy: 75,
    medium: 150,
    hard: 300,
    legendary: 750,
};

export const calculateXPToNextLevel = (level: number): number => {
    return level * 100 + (Math.pow(level, 2) * 10);
};

export const calculateXPReward = (difficulty: QuestDifficulty, streakCount: number): number => {
    let baseXP = XP_REWARDS[difficulty];

    // Streak multipliers: 3-day streak = 1.25x, 7-day = 1.5x, 30-day = 2x
    if (streakCount >= 30) baseXP *= 2;
    else if (streakCount >= 7) baseXP *= 1.5;
    else if (streakCount >= 3) baseXP *= 1.25;

    return Math.floor(baseXP);
};

export const calculateLevel = (totalXP: number): { level: number; currentXP: number; xpToNextLevel: number } => {
    let level = 1;
    let remainingXP = totalXP;

    while (remainingXP >= calculateXPToNextLevel(level)) {
        remainingXP -= calculateXPToNextLevel(level);
        level++;
    }

    return {
        level,
        currentXP: remainingXP,
        xpToNextLevel: calculateXPToNextLevel(level),
    };
};

export const getStatGain = (category: QuestCategory, characterClass: CharacterClass): Partial<CharacterStats> => {
    const gains: Partial<CharacterStats> = {};

    // Base gains logic
    switch (category) {
        case 'health': gains.strength = 1; break;
        case 'learning':
        case 'career': gains.intelligence = 1; break;
        case 'social': gains.charisma = 1; break;
        case 'creative': gains.creativity = 1; break;
        case 'personal': gains.wisdom = 1; break;
        case 'finance': gains.wisdom = 1; break;
    }

    // Class bonuses
    if (characterClass === 'warrior' && category === 'health') gains.strength = (gains.strength || 0) + 1;
    if (characterClass === 'mage' && category === 'learning') gains.intelligence = (gains.intelligence || 0) + 1;
    if (characterClass === 'rogue' && category === 'social') gains.charisma = (gains.charisma || 0) + 1;
    if (characterClass === 'scholar' && category === 'personal') gains.wisdom = (gains.wisdom || 0) + 1;
    if (characterClass === 'creator' && category === 'creative') gains.creativity = (gains.creativity || 0) + 1;

    return gains;
};

export const isLevelUp = (oldXP: number, newXP: number): boolean => {
    const oldLevel = calculateLevel(oldXP).level;
    const newLevel = calculateLevel(newXP).level;
    return newLevel > oldLevel;
};
