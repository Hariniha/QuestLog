
import { Character, QuestDifficulty, QuestCategory } from '../types';

export interface QuestGenerationResult {
    questTitle: string;
    questNarrative: string;
    difficulty: QuestDifficulty;
    category: QuestCategory;
    xpReward: number;
    goldReward: number;
    steps: { description: string }[];
    tags: string[];
    companions: string[];
}

export const generateQuest = async (userInput: string, character: Character): Promise<QuestGenerationResult> => {
    try {
        const response = await fetch('/api/generate-quest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput, character }),
        });

        if (!response.ok) throw new Error('Failed to generate quest');
        return await response.json();
    } catch (error) {
        console.error('Error generating quest:', error);
        // Fallback if API fails
        return {
            questTitle: `The Trial of ${userInput}`,
            questNarrative: `You have embarked on a journey to ${userInput}. May your resolve be as strong as your intentions.`,
            difficulty: 'medium',
            category: 'personal',
            xpReward: 150,
            goldReward: 50,
            steps: [{ description: userInput }],
            tags: ['fallback'],
            companions: []
        };
    }
};
