
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, Quest } from '@/types';
import { Card, Input, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { SparklesIcon, SwordIcon, PlusIcon, InfoIcon, ShieldIcon } from '@/components/ui/Icons';
import { generateQuest, QuestGenerationResult } from '@/lib/questEngine';
import { saveQuest } from '@/lib/localStorage';
import { useRouter } from 'next/navigation';

export const QuestFormModal = ({ isOpen, onClose, character }: { isOpen: boolean, onClose: () => void, character: Character | null }) => {
    const [task, setTask] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [preview, setPreview] = useState<QuestGenerationResult | null>(null);
    const router = useRouter();

    const handleGenerate = async () => {
        if (!task.trim() || !character) return;
        setIsGenerating(true);
        try {
            const result = await generateQuest(task, character);
            setPreview(result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        if (!preview) return;

        const newQuest: Quest = {
            id: crypto.randomUUID(),
            title: task,
            questTitle: preview.questTitle,
            description: task,
            questNarrative: preview.questNarrative,
            category: preview.category,
            difficulty: preview.difficulty,
            xpReward: preview.xpReward,
            goldReward: preview.goldReward,
            status: 'active',
            createdAt: new Date().toISOString(),
            steps: preview.steps.map((s, i) => ({ id: `${i}`, description: s.description, completed: false })),
            tags: preview.tags,
            streak: false,
            companions: preview.companions,
        };

        saveQuest(newQuest);
        onClose();
        router.push(`/quests/${newQuest.id}`);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="max-w-2xl w-full"
                >
                    <Card className="p-8 border-primary/30 space-y-8 overflow-y-auto max-h-[90vh]">
                        <header className="flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold italic">POST A BOUNTY</h2>
                                <p className="text-xs text-muted-foreground ui-label">CONSULT THE ORACLE TO FORGE YOUR QUEST</p>
                            </div>
                            <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors">
                                <PlusIcon className="rotate-45" />
                            </button>
                        </header>

                        {!preview ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="ui-label text-xs">WHAT IS YOUR TASK?</label>
                                    <textarea
                                        placeholder="e.g., Study for the advanced magic exam, clean the armory..."
                                        className="w-full min-h-[120px] bg-muted/20 border border-border p-4 focus:outline-none focus:border-primary font-nunito"
                                        value={task}
                                        onChange={e => setTask(e.target.value)}
                                    />
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full gold-glow h-16"
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !task.trim()}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            >
                                                <SparklesIcon />
                                            </motion.div>
                                            <span>CONSULTING THE ORACLE...</span>
                                        </div>
                                    ) : (
                                        "GENERATE EPIC QUEST"
                                    )}
                                </Button>

                                <p className="text-center text-[10px] text-muted-foreground italic">
                                    *Our temporal AI will analyze your task and transform it into a heroic deed.
                                </p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <Card className="p-6 bg-primary/5 border-primary/20 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="gold">{preview.difficulty.toUpperCase()}</Badge>
                                        <div className="flex gap-4">
                                            <span className="text-xs ui-label text-primary">{preview.xpReward} XP</span>
                                            <span className="text-xs ui-label text-yellow-500">{preview.goldReward}G</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold">{preview.questTitle}</h3>
                                    <p className="text-sm italic font-nunito text-muted-foreground">{preview.questNarrative}</p>

                                    <div className="space-y-2 pt-4">
                                        <p className="text-[10px] ui-label">OBJECTIVES</p>
                                        <div className="space-y-1">
                                            {preview.steps.map(s => (
                                                <div key={s.description} className="flex gap-3 text-xs">
                                                    <SwordIcon size={12} className="text-primary mt-0.5" />
                                                    <span>{s.description}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>

                                <div className="flex gap-4">
                                    <Button variant="outline" className="flex-1" onClick={() => setPreview(null)}>
                                        REGENERATE
                                    </Button>
                                    <Button className="flex-1 gold-glow" onClick={handleAccept}>
                                        ACCEPT QUEST
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
