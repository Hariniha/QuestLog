
'use client';

import React from 'react';
import { Quest, QuestDifficulty } from '@/types';
import { InteractiveCard, Badge, Progress } from '@/components/ui';
import { SwordIcon, ClockIcon, ZapIcon, CoinsIcon } from '@/components/ui/Icons';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

// Helper Icons
const ClockIco = ({ size = 16, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
);

interface QuestCardProps {
    quest: Quest;
    onComplete?: (id: string) => void;
    onClick?: (id: string) => void;
}

const DIFFICULTY_COLORS: Record<QuestDifficulty, string> = {
    trivial: 'muted',
    easy: 'green',
    medium: 'purple',
    hard: 'red',
    legendary: 'gold',
};

export const QuestCard = ({ quest, onComplete, onClick }: QuestCardProps) => {
    const completedSteps = quest.steps.filter(s => s.completed).length;
    const totalSteps = quest.steps.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const difficultyColor = DIFFICULTY_COLORS[quest.difficulty];

    return (
        <InteractiveCard
            onClick={() => onClick?.(quest.id)}
            className="p-5 flex flex-col gap-4 group"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <Badge variant={difficultyColor as any} className="mb-2">
                        {quest.difficulty.toUpperCase()}
                    </Badge>
                    <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors">
                        {quest.questTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{quest.title}</p>
                </div>
                <div className="w-10 h-10 rounded bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <SwordIcon size={20} className="text-primary" />
                </div>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 italic font-nunito">
                "{quest.questNarrative}"
            </p>

            <div className="flex items-center justify-between text-xs ui-label">
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-primary">
                        <ZapIcon size={14} />
                        <span>{quest.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-500">
                        <CoinsIcon size={14} />
                        <span>{quest.goldReward}G</span>
                    </div>
                </div>

                {quest.dueDate && (
                    <div className={clsx('flex items-center gap-1.5', new Date(quest.dueDate) < new Date() ? 'text-destructive' : 'text-muted-foreground')}>
                        <ClockIco size={14} />
                        <span>{formatDistanceToNow(new Date(quest.dueDate), { addSuffix: true })}</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] ui-label">
                    <span>PROGRESS</span>
                    <span>{completedSteps}/{totalSteps} STEPS</span>
                </div>
                <Progress value={progress} />
            </div>
        </InteractiveCard>
    );
};
