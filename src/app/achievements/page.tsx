
'use client';

import React, { useState, useEffect } from 'react';
import { Achievement } from '@/types';
import { ACHIEVEMENTS } from '@/constants/achievements';
import { getUnlockedAchievements } from '@/lib/localStorage';
import { Card, Badge, Progress } from '@/components/ui';
import { TrophyIcon, ShieldIcon, SparklesIcon, CrownIcon, InfoIcon } from '@/components/ui/Icons';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function AchievementsGallery() {
    const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
    const [filter, setFilter] = useState<'all' | Achievement['rarity']>('all');

    useEffect(() => {
        setUnlockedIds(getUnlockedAchievements());
    }, []);

    const filteredAchievements = ACHIEVEMENTS.filter(a =>
        filter === 'all' ? true : a.rarity === filter
    );

    const unlockedCount = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id)).length;
    const progress = (unlockedCount / ACHIEVEMENTS.length) * 100;

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold">HALL OF TRIUMPHS</h1>
                    <p className="text-muted-foreground font-nunito mt-1">Every victory, large or small, is etched into the eternal vault.</p>
                </div>
                <Card className="p-4 bg-primary/5 border-primary/20 min-w-[200px]">
                    <div className="flex justify-between text-[10px] ui-label mb-2">
                        <span>COLLECTION PROGRESS</span>
                        <span>{unlockedCount}/{ACHIEVEMENTS.length}</span>
                    </div>
                    <Progress value={progress} />
                </Card>
            </header>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {['all', 'common', 'rare', 'epic', 'legendary'].map(r => (
                    <button
                        key={r}
                        onClick={() => setFilter(r as any)}
                        className={clsx(
                            'px-4 py-1.5 text-xs ui-label border transition-all whitespace-nowrap',
                            filter === r ? 'bg-primary text-black border-primary gold-glow' : 'bg-muted/30 border-border hover:border-foreground'
                        )}
                    >
                        {r.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAchievements.map((achievement, index) => {
                    const isUnlocked = unlockedIds.includes(achievement.id);

                    return (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            key={achievement.id}
                        >
                            <Card className={clsx(
                                'p-6 h-full flex flex-col gap-4 transition-all border-2',
                                isUnlocked
                                    ? achievement.rarity === 'legendary' ? 'border-primary gold-glow bg-primary/5' :
                                        achievement.rarity === 'epic' ? 'border-secondary purple-glow bg-secondary/5' :
                                            'border-foreground/20 bg-muted/20'
                                    : 'opacity-40 grayscale border-border/30 bg-background'
                            )}>
                                <div className="flex justify-between items-start">
                                    <div className={clsx(
                                        'w-12 h-12 flex items-center justify-center border',
                                        isUnlocked ? 'bg-card' : 'bg-muted'
                                    )}>
                                        <TrophyIcon size={24} className={isUnlocked ? 'text-primary' : 'text-muted-foreground'} />
                                    </div>
                                    <Badge variant={achievement.rarity === 'legendary' ? 'gold' : achievement.rarity === 'epic' ? 'purple' : 'muted'}>
                                        {achievement.rarity.toUpperCase()}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold">{isUnlocked ? achievement.title : '???'}</h3>
                                    <p className="text-xs text-muted-foreground font-nunito line-clamp-2">
                                        {achievement.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-border/20">
                                    <p className="text-[10px] ui-label text-muted-foreground">CONDITION</p>
                                    <p className="text-xs font-bold font-rajdhani mt-1">{achievement.condition}</p>
                                    {isUnlocked && achievement.unlockedAt && (
                                        <p className="text-[9px] text-primary mt-2">UNLOCKED {new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
