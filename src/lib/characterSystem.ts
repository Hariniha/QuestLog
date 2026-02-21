
import { Character, CharacterClass, CharacterStats, AvatarConfig } from '../types';
import { calculateXPToNextLevel } from './xpSystem';

export const INITIAL_STATS: Record<CharacterClass, CharacterStats> = {
    warrior: { strength: 12, intelligence: 8, agility: 10, creativity: 8, charisma: 9, wisdom: 8 },
    mage: { strength: 7, intelligence: 14, agility: 9, creativity: 10, charisma: 8, wisdom: 10 },
    rogue: { strength: 9, intelligence: 9, agility: 14, creativity: 9, charisma: 11, wisdom: 8 },
    scholar: { strength: 8, intelligence: 11, agility: 8, creativity: 9, charisma: 8, wisdom: 14 },
    creator: { strength: 8, intelligence: 9, agility: 10, creativity: 14, charisma: 10, wisdom: 9 },
};

export const createInitialCharacter = (
    name: string,
    characterClass: CharacterClass,
    avatar: AvatarConfig,
    bio: string = ''
): Character => {
    return {
        id: crypto.randomUUID(),
        name,
        class: characterClass,
        level: 1,
        xp: 0,
        xpToNextLevel: calculateXPToNextLevel(1),
        gold: 0,
        stats: { ...INITIAL_STATS[characterClass] },
        avatar,
        bio,
        createdAt: new Date().toISOString(),
    };
};

export const CLASS_LORE: Record<CharacterClass, string> = {
    warrior: "The path of the Warrior is one of iron will and steel discipline. Your strength grows with every physical challenge overcome.",
    mage: "The Mage seeks the hidden truths of the world. Your intellect sharpens with every mystery decoded and every lesson learned.",
    rogue: "The Rogue moves through the shadows of the city. Your agility and charisma are your greatest weapons in the dance of life.",
    scholar: "The Scholar knows that wisdom is the ultimate power. You build a foundation of knowledge that will last for eternity.",
    creator: "The Creator breathes life into the void. Your imagination knows no bounds, and every project is a masterpiece in the making."
};
