
'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import {
    InfoIcon,
    SwordIcon,
    MessageCircleIcon,
    ZapIcon,
    TrophyIcon,
    BookIcon,
    UserIcon,
    PlusIcon,
    SparklesIcon,
    CoinsIcon
} from '@/components/ui/Icons';
import { motion } from 'framer-motion';

export default function GuidePage() {
    const glossary = [
        { term: "BOUNTY", definition: "A task you want to do. When you create a task, you are 'posting a bounty' for yourself to finish." },
        { term: "QUEST", definition: "A Bounty that has been transformed by AI into a fun mission with a story and rewards." },
        { term: "DEED", definition: "A task that you have successfully finished. Every time you complete a quest, it becomes a 'Deed' in your history." },
        { term: "XP (Experience)", definition: "Points you earn for working hard. More XP means your character reaches higher Levels." },
    ];

    const steps = [
        {
            title: "1. POST A BOUNTY",
            icon: PlusIcon,
            content: "Click the 'NEW QUEST' button. Type your real-life task (like 'Do the dishes'). The AI Oracle will turn it into a brave mission!",
            color: "text-primary"
        },
        {
            title: "2. BECOME THE HERO",
            icon: SwordIcon,
            content: "Do the task in real life! Once you are done, open the quest in the app and check off the steps.",
            color: "text-green-500"
        },
        {
            title: "3. RECORD THE DEED",
            icon: BookIcon,
            content: "Click 'CLAIM REWARDS'. This records your victory as a 'Deed' in your Journal. You will earn Gold and XP immediately.",
            color: "text-blue-500"
        },
        {
            title: "4. CONSULT THE FUTURE",
            icon: MessageCircleIcon,
            content: "Talk to your Future Self. They track your Deeds and give you wisdom based on how much work you are actually doing.",
            color: "text-purple-500"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Intro Section */}
            <header className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 gold-glow">
                    <SparklesIcon size={40} className="text-primary" />
                </div>
                <h1 className="text-5xl font-bold italic tracking-tight">WHAT IS QUESTLOG?</h1>
                <p className="text-lg text-muted-foreground font-nunito max-w-2xl mx-auto leading-relaxed">
                    QuestLog is a tool that turns your **Real Life** into a **Role-Playing Game (RPG)**.
                    It helps you stop procrastinating by making your daily chores feel like heroic missions.
                    There are no fake points here—every level you gain represents real work you did in the real world.
                </p>
            </header>

            {/* Glossary / Terms */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                    <InfoIcon className="text-primary" />
                    <h2 className="ui-label text-sm tracking-widest">DECODING THE LANGUAGE</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {glossary.map((item) => (
                        <Card key={item.term} className="p-5 bg-muted/10 border-border/30">
                            <h4 className="font-bold text-primary mb-1">{item.term}</h4>
                            <p className="text-xs text-muted-foreground font-nunito">{item.definition}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* How to use */}
            <section className="space-y-8">
                <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                    <ZapIcon className="text-yellow-500" />
                    <h2 className="ui-label text-sm tracking-widest">HOW TO PLAY</h2>
                </div>
                <div className="grid gap-6">
                    {steps.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 border-l-4 border-l-primary hover:bg-muted/5 transition-colors">
                                <div className="flex gap-6 items-center">
                                    <div className={section.color}>
                                        <section.icon size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold italic">{section.title}</h3>
                                        <p className="text-sm text-muted-foreground font-nunito">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Rewards Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 space-y-4 border-yellow-500/20 bg-yellow-500/5">
                    <div className="flex items-center gap-3">
                        <CoinsIcon className="text-yellow-500" />
                        <h3 className="font-bold italic">GOLD & WEALTH</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-nunito">
                        Gold is your score. You start with **0 Gold**. The only way to get more is to finish quests. Use it to track how much value you've added to your life!
                    </p>
                </Card>
                <Card className="p-8 space-y-4 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3">
                        <TrophyIcon className="text-primary" />
                        <h3 className="font-bold italic">ACHIEVEMENTS</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-nunito">
                        Special trophies you unlock for being awesome. Finishing your first quest unlocks **'First Blood'**, while working late unlocks **'Night Owl'**.
                    </p>
                </Card>
            </section>

            <footer className="pt-10 text-center">
                <p className="ui-label text-[10px] text-muted-foreground mb-4 italic">"THE LONGEST JOURNEY BEGINS WITH A SINGLE DEED."</p>
                <Badge variant="gold" className="px-6 py-2">GO TO DASHBOARD AND START NOW</Badge>
            </footer>
        </div>
    );
}
