
import { Character, Quest, Achievement, FutureSelfMessage, JournalEntry, UserStreak, UserSettings } from '../types';

const KEYS = {
    CHARACTER: 'questlog_character',
    QUESTS: 'questlog_quests',
    ACHIEVEMENTS: 'questlog_achievements',
    UNLOCKED_ACHIEVEMENTS: 'questlog_unlocked_achievements',
    FUTURE_SELF_MESSAGES: 'questlog_future_self_messages',
    JOURNAL: 'questlog_journal',
    STREAK: 'questlog_streak',
    ONBOARDING: 'questlog_onboarding_complete',
    SETTINGS: 'questlog_settings',
};

const isServer = typeof window === 'undefined';

const get = <T>(key: string): T | null => {
    if (isServer) return null;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return null;
    }
};

const set = <T>(key: string, value: T): void => {
    if (isServer) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
    }
};

export const getCharacter = () => get<Character>(KEYS.CHARACTER);
export const saveCharacter = (character: Character) => set(KEYS.CHARACTER, character);

export const getQuests = () => get<Quest[]>(KEYS.QUESTS) || [];
export const saveQuests = (quests: Quest[]) => set(KEYS.QUESTS, quests);
export const saveQuest = (quest: Quest) => {
    const quests = getQuests();
    const index = quests.findIndex(q => q.id === quest.id);
    if (index >= 0) {
        quests[index] = quest;
    } else {
        quests.push(quest);
    }
    saveQuests(quests);
};

export const getAchievements = () => get<Achievement[]>(KEYS.ACHIEVEMENTS) || [];
export const saveAchievements = (achievements: Achievement[]) => set(KEYS.ACHIEVEMENTS, achievements);

export const getUnlockedAchievements = () => get<string[]>(KEYS.UNLOCKED_ACHIEVEMENTS) || [];
export const saveUnlockedAchievements = (ids: string[]) => set(KEYS.UNLOCKED_ACHIEVEMENTS, ids);

export const getFutureSelfMessages = () => get<FutureSelfMessage[]>(KEYS.FUTURE_SELF_MESSAGES) || [];
export const saveFutureSelfMessages = (messages: FutureSelfMessage[]) => set(KEYS.FUTURE_SELF_MESSAGES, messages);

export const getJournal = () => get<JournalEntry[]>(KEYS.JOURNAL) || [];
export const saveJournal = (entries: JournalEntry[]) => set(KEYS.JOURNAL, entries);

export const getStreak = () => get<UserStreak>(KEYS.STREAK) || { current: 0, longest: 0, lastActiveDate: '' };
export const saveStreak = (streak: UserStreak) => set(KEYS.STREAK, streak);

export const isOnboardingComplete = () => get<boolean>(KEYS.ONBOARDING) || false;
export const setOnboardingComplete = (complete: boolean) => set(KEYS.ONBOARDING, complete);

export const getSettings = () => get<UserSettings>(KEYS.SETTINGS) || {
    futureSelfName: 'Your Future Self',
    futureSelfPersonality: 'wise mentor',
    theme: 'dark',
    notifications: true,
    soundEffects: true,
    questAutoBreakdown: true,
};
export const saveSettings = (settings: UserSettings) => set(KEYS.SETTINGS, settings);

export const clearAllData = () => {
    if (isServer) return;
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
};
