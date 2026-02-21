
import { UserStreak } from '../types';
import { getStreak, saveStreak } from './localStorage';
import { isYesterday, isToday, parseISO } from 'date-fns';

export const updateStreak = () => {
    const streak = getStreak();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (!streak.lastActiveDate) {
        // First time ever
        const newStreak: UserStreak = {
            current: 1,
            longest: 1,
            lastActiveDate: todayStr
        };
        saveStreak(newStreak);
        return newStreak;
    }

    const lastDate = parseISO(streak.lastActiveDate);

    if (isToday(lastDate)) {
        // Already active today, do nothing
        return streak;
    }

    let newCurrent = streak.current;
    if (isYesterday(lastDate)) {
        // Continued streak
        newCurrent += 1;
    } else {
        // Gap too long, reset streak
        newCurrent = 1;
    }

    const newStreak: UserStreak = {
        current: newCurrent,
        longest: Math.max(newCurrent, streak.longest),
        lastActiveDate: todayStr
    };

    saveStreak(newStreak);
    return newStreak;
};
