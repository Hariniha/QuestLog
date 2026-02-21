
import { ACHIEVEMENTS } from '../constants/achievements';
import { getQuests, getUnlockedAchievements, saveUnlockedAchievements, getStreak, getFutureSelfMessages, getCharacter, saveCharacter } from './localStorage';
import { isLevelUp } from './xpSystem';

export const checkAchievements = () => {
    const allQuests = getQuests();
    const completedQuests = allQuests.filter(q => q.status === 'completed');
    const unlockedIds = getUnlockedAchievements();
    const streak = getStreak();
    const messages = getFutureSelfMessages();
    const character = getCharacter();

    if (!character) return [];

    const newlyUnlockedIds: string[] = [];

    ACHIEVEMENTS.forEach(achievement => {
        if (unlockedIds.includes(achievement.id)) return;

        let isMet = false;

        switch (achievement.id) {
            case 'first_blood':
                isMet = completedQuests.length >= 1;
                break;
            case 'quest_hunter':
                isMet = completedQuests.length >= 10;
                break;
            case 'century_mark':
                isMet = completedQuests.length >= 100;
                break;
            case 'legend_rises':
                isMet = completedQuests.length >= 500;
                break;
            case 'consistent_soul':
                isMet = streak.current >= 3;
                break;
            case 'week_warrior':
                isMet = streak.current >= 7;
                break;
            case 'unstoppable_force':
                isMet = streak.current >= 30;
                break;
            case 'dragonslayer':
                isMet = completedQuests.some(q => q.difficulty === 'legendary');
                break;
            case 'hard_boiled':
                isMet = completedQuests.filter(q => q.difficulty === 'hard').length >= 10;
                break;
            case 'awakening':
                isMet = character.level >= 5;
                break;
            case 'ascendant':
                isMet = character.level >= 20;
                break;
            case 'transcendent':
                isMet = character.level >= 50;
                break;
            case 'iron_body':
                isMet = completedQuests.filter(q => q.category === 'health').length >= 20;
                break;
            case 'scholars_path':
                isMet = completedQuests.filter(q => q.category === 'learning').length >= 20;
                break;
            case 'soul_seeker':
                isMet = messages.length >= 1;
                break;
            case 'time_traveler':
                isMet = messages.length >= 50;
                break;
            case 'night_owl':
                isMet = completedQuests.some(q => {
                    if (!q.completedAt) return false;
                    const hours = new Date(q.completedAt).getHours();
                    return hours >= 0 && hours < 4;
                });
                break;
            case 'early_bird':
                isMet = completedQuests.some(q => {
                    if (!q.completedAt) return false;
                    const hours = new Date(q.completedAt).getHours();
                    return hours >= 4 && hours < 7;
                });
                break;
            case 'speed_runner':
                const today = new Date().toLocaleDateString();
                const todayCompleted = completedQuests.filter(q =>
                    q.completedAt && new Date(q.completedAt).toLocaleDateString() === today
                );
                isMet = todayCompleted.length >= 5;
                break;
        }

        if (isMet) {
            newlyUnlockedIds.push(achievement.id);
        }
    });

    if (newlyUnlockedIds.length > 0) {
        const nextUnlockedIds = [...unlockedIds, ...newlyUnlockedIds];
        saveUnlockedAchievements(nextUnlockedIds);

        // Award XP bonuses for newly unlocked achievements
        let totalBonus = 0;
        newlyUnlockedIds.forEach(id => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            if (ach) totalBonus += ach.xpBonus;
        });

        if (totalBonus > 0) {
            const updatedChar = { ...character, xp: character.xp + totalBonus };
            saveCharacter(updatedChar);
        }
    }

    return newlyUnlockedIds;
};
