
import { Character, Quest, UserStreak, FutureSelfMessage, UserSettings } from '../types';

export const generateFutureSelfResponse = async (
    userMessage: string,
    character: Character,
    recentQuests: Quest[],
    streak: UserStreak,
    conversationHistory: FutureSelfMessage[],
    settings: UserSettings
): Promise<{ content: string; mood: FutureSelfMessage['mood'] }> => {
    try {
        const response = await fetch('/api/future-self', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userMessage,
                character,
                recentQuests,
                streak,
                history: conversationHistory,
                settings
            }),
        });

        if (!response.ok) throw new Error('Failed to reach your future self');
        return await response.json();
    } catch (error) {
        console.error('Error with Future Self API:', error);
        return {
            content: "The mists of time are thick today, my past self. Keep moving forward; the path will reveal itself soon.",
            mood: 'wise'
        };
    }
};

export const generateDailyOpening = async (
    character: Character,
    todaysQuests: Quest[],
    streak: UserStreak
): Promise<string> => {
    try {
        const response = await fetch('/api/daily-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ character, todaysQuests, streak }),
        });
        if (!response.ok) return "A new day begins. Forge your legend.";
        const data = await response.json();
        return data.message;
    } catch (error) {
        return "The stars align for another day of growth.";
    }
};
