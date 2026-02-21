
import { JournalEntry, Quest } from '../types';
import { getJournal, saveJournal } from './localStorage';
import { isToday, parseISO } from 'date-fns';

export const recordQuestCompletion = (quest: Quest) => {
    const journal = getJournal();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    let todayEntry = journal.find(e => e.date === todayStr);

    if (todayEntry) {
        todayEntry.questsCompleted += 1;
        todayEntry.xpGained += quest.xpReward;
        // Don't modify the summary if it already exists, or append to it
        todayEntry.summary = `Completed ${todayEntry.questsCompleted} quests today, including: ${quest.questTitle}`;
    } else {
        todayEntry = {
            id: crypto.randomUUID(),
            date: todayStr,
            questsCompleted: 1,
            xpGained: quest.xpReward,
            summary: `Embarked on the path and completed: ${quest.questTitle}`,
            reflection: ""
        };
        journal.push(todayEntry);
    }

    saveJournal(journal);
    return todayEntry;
};
