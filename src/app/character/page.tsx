
'use client';

import React, { useState, useEffect } from 'react';
import { Character, CharacterStats } from '@/types';
import { getCharacter, clearAllData, getJournal } from '@/lib/localStorage';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { Card, Badge, Progress } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { CLASS_LORE } from '@/lib/characterSystem';
import {
    ShieldIcon,
    SparklesIcon,
    ZapIcon,
    UsersIcon,
    ScrollIcon,
    FlameIcon,
    SwordIcon,
    CrownIcon
} from '@/components/ui/Icons';
import { motion } from 'framer-motion';

export default function CharacterProfile() {
    const [character, setCharacter] = useState<Character | null>(null);
    const [deedsCount, setDeedsCount] = useState(0);

    useEffect(() => {
        setCharacter(getCharacter());
        setDeedsCount(getJournal().length);
    }, []);

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your legend? This will erase all quests, achievements, and statistics forever.")) {
            clearAllData();
            window.location.href = '/onboarding';
        }
    };

    if (!character) return null;

    const statsList = [
        { label: 'Strength', value: character.stats.strength, icon: SwordIcon, color: '#ef4444' },
        { label: 'Intelligence', value: character.stats.intelligence, icon: SparklesIcon, color: '#7c3aed' },
        { label: 'Agility', value: character.stats.agility, icon: ZapIcon, color: '#10b981' },
        { label: 'Creativity', value: character.stats.creativity, icon: SparklesIcon, color: '#ec4899' },
        { label: 'Charisma', value: character.stats.charisma, icon: UsersIcon, color: '#3b82f6' },
        { label: 'Wisdom', value: character.stats.wisdom, icon: ScrollIcon, color: '#f5c518' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <header className="text-center space-y-4">
                <h1 className="text-5xl font-bold uppercase tracking-tighter italic">THE HERO'S JOURNEY</h1>
                <p className="text-muted-foreground ui-label">RECORD OF DEEDS AND ATTRIBUTES</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Main Ident */}
                <div className="space-y-6">
                    <Card className="p-8 flex flex-col items-center text-center gap-6 border-primary/30 bg-primary/5">
                        <CharacterAvatar
                            config={character.avatar}
                            characterClass={character.class}
                            className="w-48 h-48 rounded-3xl"
                            glow
                        />
                        <div>
                            <h2 className="text-3xl font-bold">{character.name}</h2>
                            <Badge variant="gold" className="mt-2">LEVEL {character.level} {character.class.toUpperCase()}</Badge>
                        </div>

                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-[10px] ui-label">
                                <span>EXPERIENCE</span>
                                <span>{character.xp} / {character.xpToNextLevel}</span>
                            </div>
                            <Progress value={character.xp} max={character.xpToNextLevel} className="h-4" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border/50">
                            <div className="text-center">
                                <p className="text-[10px] ui-label text-muted-foreground">GOLD</p>
                                <p className="font-bold text-yellow-500">{character.gold}G</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] ui-label text-muted-foreground">DEEDS</p>
                                <p className="font-bold text-primary">{deedsCount}</p>
                            </div>
                        </div>
                    </Card>

                    <Button variant="danger" className="w-full" onClick={handleReset}>
                        RESET CHARACTER
                    </Button>
                </div>

                {/* Middle Column: Stats */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h3 className="text-xl ui-label border-b border-border/50 pb-2">ATTRIBUTES</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {statsList.map(stat => (
                                <Card key={stat.label} className="p-4 flex items-center gap-4 bg-muted/20">
                                    <div className="w-10 h-10 flex items-center justify-center bg-card border border-border" style={{ color: stat.color }}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-xs ui-label text-muted-foreground">{stat.label}</span>
                                            <span className="text-lg font-bold font-rajdhani">{stat.value}</span>
                                        </div>
                                        <div className="h-1 w-full bg-background rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stat.value / 25) * 100}%` }}
                                                className="h-full"
                                                style={{ backgroundColor: stat.color }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xl ui-label border-b border-border/50 pb-2">CLASS LORE</h3>
                        <Card className="p-6 bg-muted/10 font-nunito leading-relaxed italic text-muted-foreground relative">
                            <CrownIcon className="absolute -top-3 -right-3 text-primary/10" size={80} />
                            {CLASS_LORE[character.class]}
                        </Card>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-xl ui-label border-b border-border/50 pb-2">STORY SO FAR</h3>
                        <p className="text-sm font-nunito text-muted-foreground">
                            {character.bio || "This hero's origin story is yet to be fully written within the scrolls. Every quest completed adds a new line to their legend."}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
