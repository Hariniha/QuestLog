
'use client';

import React, { useState, useEffect } from 'react';
import { JournalEntry, Character } from '@/types';
import { getJournal, getCharacter } from '@/lib/localStorage';
import { Card, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { BookIcon, SparklesIcon, CalendarIcon, ZapIcon } from '@/components/ui/Icons';
import { clsx } from 'clsx';
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';

export default function QuestJournal() {
    const [journal, setJournal] = useState<JournalEntry[]>([]);
    const [character, setCharacter] = useState<Character | null>(null);

    useEffect(() => {
        setJournal(getJournal());
        setCharacter(getCharacter());
    }, []);

    const today = new Date();
    const last30Days = eachDayOfInterval({
        start: subDays(today, 29),
        end: today,
    });

    const getActivityLevel = (date: Date) => {
        const entry = journal.find(e => isSameDay(new Date(e.date), date));
        if (!entry) return 0;
        if (entry.questsCompleted >= 5) return 4;
        if (entry.questsCompleted >= 3) return 3;
        if (entry.questsCompleted >= 1) return 2;
        return 1;
    };

    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-4xl font-bold">THE ETERNAL JOURNAL</h1>
                <p className="text-muted-foreground font-nunito mt-1">A chronicle of every step taken, every battle won.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Heatmap Card */}
                    <Card className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="ui-label text-sm">QUEST ACTIVITY (LAST 30 DAYS)</h3>
                            <div className="flex gap-1 items-center">
                                <span className="text-[10px] ui-label mr-2">LESS</span>
                                {[0, 1, 2, 3, 4].map(level => (
                                    <div
                                        key={level}
                                        className={clsx(
                                            'w-3 h-3',
                                            level === 0 ? 'bg-muted' :
                                                level === 1 ? 'bg-primary/20' :
                                                    level === 2 ? 'bg-primary/40' :
                                                        level === 3 ? 'bg-primary/70' : 'bg-primary'
                                        )}
                                    />
                                ))}
                                <span className="text-[10px] ui-label ml-2">MORE</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 md:grid-cols-10 lg:grid-cols-15 gap-2">
                            {last30Days.map(day => {
                                const level = getActivityLevel(day);
                                return (
                                    <div
                                        key={day.toISOString()}
                                        title={format(day, 'MMM d, yyyy')}
                                        className={clsx(
                                            'aspect-square rounded-sm transition-transform cursor-help hover:scale-110',
                                            level === 0 ? 'bg-muted/30' :
                                                level === 1 ? 'bg-primary/20' :
                                                    level === 2 ? 'bg-primary/40' :
                                                        level === 3 ? 'bg-primary/70' : 'bg-primary'
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </Card>

                    {/* Journal Entries */}
                    <div className="space-y-6">
                        <h3 className="ui-label text-sm border-b border-border/50 pb-2">CHRONICLE ENTRIES</h3>
                        <div className="space-y-4">
                            {journal.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                                <Card key={entry.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-muted/50 flex items-center justify-center">
                                                <CalendarIcon size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold font-rajdhani">{format(new Date(entry.date), 'MMMM d, yyyy')}</p>
                                                <p className="text-xs ui-label text-muted-foreground">{entry.questsCompleted} QUESTS COMPLETED</p>
                                            </div>
                                        </div>
                                        <Badge variant="gold">+{entry.xpGained} XP</Badge>
                                    </div>
                                    <p className="text-sm font-nunito leading-relaxed italic text-muted-foreground">
                                        "{entry.summary}"
                                    </p>
                                    {entry.reflection && (
                                        <div className="mt-4 p-4 bg-muted/20 border-l-2 border-primary text-xs font-nunito italic">
                                            {entry.reflection}
                                        </div>
                                    )}
                                </Card>
                            ))}

                            {journal.length === 0 && (
                                <div className="py-20 text-center space-y-4">
                                    <BookIcon size={48} className="text-muted mx-auto" />
                                    <p className="text-muted-foreground font-nunito">The journal is empty. Complete quests to write your story.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <Card className="p-6 space-y-6">
                        <h3 className="ui-label text-sm border-b border-border/50 pb-2">LEGACY STATS</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs ui-label text-muted-foreground flex items-center gap-2">
                                    <ZapIcon size={14} /> PERSISTENCE
                                </span>
                                <span className="font-bold font-rajdhani">
                                    {journal.length > 0 ? '100%' : '0%'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs ui-label text-muted-foreground flex items-center gap-2">
                                    <SparklesIcon size={14} /> TOTAL XP
                                </span>
                                <span className="font-bold font-rajdhani text-primary">{character?.xp || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs ui-label text-muted-foreground flex items-center gap-2">
                                    <BookIcon size={14} /> DAYS ACTIVE
                                </span>
                                <span className="font-bold font-rajdhani">{journal.length}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-primary/5 border-primary/20">
                        <h3 className="ui-label text-sm mb-4">AI ANALYTICS</h3>
                        <p className="text-xs font-nunito italic leading-relaxed">
                            {journal.length > 0
                                ? `You have etched ${journal.length} days of history. Your commitment to the path of the ${character?.class || 'hero'} is being recorded in the stars.`
                                : "The chronicles are empty. Your first recorded deed will begin the analysis of your destiny."}
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
