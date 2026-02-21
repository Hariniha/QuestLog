
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Quest, Character, QuestStep } from '@/types';
import { saveQuest, getCharacter, saveCharacter, getQuests } from '@/lib/localStorage';
import { calculateXPReward, isLevelUp, calculateLevel } from '@/lib/xpSystem';
import { checkAchievements } from '@/lib/achievementEngine';
import { updateStreak } from '@/lib/streakSystem';
import { recordQuestCompletion } from '@/lib/journalSystem';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Progress } from '@/components/ui';
import {
    SwordIcon,
    CheckIcon,
    ZapIcon,
    CoinsIcon,
    ClockIcon,
    InfoIcon,
    CrownIcon
} from '@/components/ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export default function QuestDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [quest, setQuest] = useState<Quest | null>(null);
    const [character, setCharacter] = useState<Character | null>(null);
    const [showVictory, setShowVictory] = useState(false);
    const [isLeveledUp, setIsLeveledUp] = useState(false);

    useEffect(() => {
        const allQuests = getQuests();
        const foundQuest = allQuests.find(q => q.id === id);
        if (foundQuest) {
            setQuest(foundQuest);
        } else {
            router.push('/quests');
        }
        setCharacter(getCharacter());
    }, [id, router]);

    const toggleStep = (stepId: string) => {
        if (!quest) return;
        const newSteps = quest.steps.map(s =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        const updatedQuest = { ...quest, steps: newSteps };
        setQuest(updatedQuest);
        saveQuest(updatedQuest);
    };

    const handleCompleteQuest = () => {
        if (!quest || !character) return;

        const updatedStreak = updateStreak();
        const xpReward = calculateXPReward(quest.difficulty, updatedStreak.current);
        const newXP = character.xp + xpReward;
        const oldLevel = character.level;

        const levelInfo = calculateLevel(newXP);
        const statsUpdate = { ...character.stats }; // Simplification: no stat gain calc here

        const updatedCharacter = {
            ...character,
            xp: newXP,
            level: levelInfo.level,
            xpToNextLevel: levelInfo.xpToNextLevel,
            gold: character.gold + quest.goldReward,
            stats: statsUpdate
        };

        saveCharacter(updatedCharacter);

        const updatedQuest = {
            ...quest,
            status: 'completed' as const,
            completedAt: new Date().toISOString()
        };
        saveQuest(updatedQuest);

        // Update Streak and Journal
        recordQuestCompletion(quest);

        // Check for newly unlocked achievements
        checkAchievements();

        if (levelInfo.level > oldLevel) {
            setIsLeveledUp(true);
        }

        setShowVictory(true);
    };

    if (!quest || !character) return null;

    const allStepsCompleted = quest.steps.every(s => s.completed);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Victory Modal */}
            <AnimatePresence>
                {showVictory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="max-w-md w-full text-center space-y-6"
                        >
                            <CrownIcon size={120} className="text-primary mx-auto animate-bounce" />
                            <h2 className="text-5xl font-bold italic tracking-tighter">VICTORY!</h2>
                            <p className="font-nunito text-muted-foreground">
                                Quest "{quest.questTitle}" has been etched into the chronicles. Your power grows.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4 bg-primary/10 border-primary/30">
                                    <p className="text-[10px] ui-label">EXPERIENCE</p>
                                    <p className="text-2xl font-bold text-primary">+{quest.xpReward} XP</p>
                                </Card>
                                <Card className="p-4 bg-yellow-500/10 border-yellow-500/30">
                                    <p className="text-[10px] ui-label">GOLD</p>
                                    <p className="text-2xl font-bold text-yellow-500">+{quest.goldReward}G</p>
                                </Card>
                            </div>

                            {isLeveledUp && (
                                <div className="py-4 px-6 bg-secondary/20 border border-secondary shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                                    <h3 className="text-xl font-bold text-secondary">LEVEL UP!</h3>
                                    <p className="text-sm font-nunito">You have reached Level {character.level + 1}!</p>
                                </div>
                            )}

                            <Button size="lg" className="w-full gold-glow" onClick={() => router.push('/')}>
                                RETURN TO DASHBOARD
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-8">
                    <header className="space-y-4">
                        <Badge variant={quest.difficulty === 'legendary' ? 'gold' : 'purple' as any} className="text-sm px-4">
                            {quest.difficulty.toUpperCase()} QUEST
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{quest.questTitle}</h1>
                        <div className="flex gap-4 items-center text-muted-foreground ui-label text-xs">
                            <span className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border">
                                <SwordIcon size={14} /> {quest.category.toUpperCase()}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border">
                                <ZapIcon size={14} /> {quest.xpReward} XP
                            </span>
                        </div>
                    </header>

                    <Card className="p-6 bg-muted/10 italic font-nunito leading-relaxed text-lg border-l-4 border-primary">
                        "{quest.questNarrative}"
                    </Card>

                    <div className="space-y-4">
                        <h3 className="ui-label text-sm border-b border-border/50 pb-2">STEPS TO COMPLETION</h3>
                        <div className="space-y-3">
                            {quest.steps.map(step => (
                                <button
                                    key={step.id}
                                    onClick={() => toggleStep(step.id)}
                                    disabled={quest.status !== 'active'}
                                    className={clsx(
                                        'w-full flex items-center gap-4 p-4 text-left transition-all border',
                                        step.completed
                                            ? 'bg-primary/5 border-primary/30 text-muted-foreground'
                                            : 'bg-card border-border hover:border-primary/50'
                                    )}
                                >
                                    <div className={clsx(
                                        'w-6 h-6 border flex items-center justify-center transition-colors',
                                        step.completed ? 'bg-primary border-primary text-black' : 'border-muted-foreground'
                                    )}>
                                        {step.completed && <CheckIcon size={16} />}
                                    </div>
                                    <span className={clsx(step.completed && 'line-through')}>{step.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className={clsx('w-full py-8 text-xl', allStepsCompleted ? 'gold-glow' : '')}
                        disabled={!allStepsCompleted || quest.status !== 'active'}
                        onClick={handleCompleteQuest}
                    >
                        {quest.status === 'completed' ? 'QUEST COMPLETED' : allStepsCompleted ? 'CLAIM REWARDS' : 'COMPLETE ALL STEPS'}
                    </Button>
                </div>

                <aside className="w-full md:w-[300px] space-y-6">
                    <Card className="p-6 space-y-6">
                        <h4 className="ui-label text-xs border-b border-border/50 pb-2">QUEST INFO</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Original Task</span>
                                <span className="font-bold text-right">{quest.title}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Difficulty</span>
                                <span className="font-bold text-primary capitalize">{quest.difficulty}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Gold Reward</span>
                                <span className="font-bold text-yellow-500">{quest.goldReward}G</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant={quest.status === 'active' ? 'gold' : 'muted' as any}>
                                    {quest.status.toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {quest.companions.length > 0 && (
                        <Card className="p-6 space-y-4">
                            <h4 className="ui-label text-xs border-b border-border/50 pb-2">COMPANIONS</h4>
                            <div className="space-y-2">
                                {quest.companions.map(companion => (
                                    <div key={companion} className="flex items-center gap-3 p-2 bg-muted/20 border border-border/30 text-xs">
                                        <InfoIcon size={14} className="text-primary" />
                                        <span>{companion}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {quest.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {quest.tags.map(tag => (
                                <Badge key={tag} variant="muted" className="lowercase">#{tag}</Badge>
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
