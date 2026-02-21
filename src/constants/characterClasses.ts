
import { CharacterClass, CharacterStats } from '../types';

export interface ClassDefinition {
    id: CharacterClass;
    name: string;
    description: string;
    primaryStat: keyof CharacterStats;
    color: string;
}

export const CHARACTER_CLASSES: ClassDefinition[] = [
    {
        id: 'warrior',
        name: 'Warrior',
        description: 'Masters of discipline and physical prowess. Gains extra strength from health quests.',
        primaryStat: 'strength',
        color: '#ef4444',
    },
    {
        id: 'mage',
        name: 'Mage',
        description: 'Seekers of knowledge and mental clarity. Gains extra intelligence from learning quests.',
        primaryStat: 'intelligence',
        color: '#7c3aed',
    },
    {
        id: 'rogue',
        name: 'Rogue',
        description: 'Agile and socially adept. Gains extra charisma from social quests and agility from streaks.',
        primaryStat: 'agility',
        color: '#10b981',
    },
    {
        id: 'scholar',
        name: 'Scholar',
        description: 'Pragmatic and wise. Gains extra wisdom from personal and financial quests.',
        primaryStat: 'wisdom',
        color: '#f5c518',
    },
    {
        id: 'creator',
        name: 'Creator',
        description: 'Imaginative and expressive. Gains extra creativity from creative quests.',
        primaryStat: 'creativity',
        color: '#ec4899',
    },
];
