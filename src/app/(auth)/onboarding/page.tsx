
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, Input, Badge } from '@/components/ui';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { CHARACTER_CLASSES } from '@/constants/characterClasses';
import { CharacterClass, AvatarConfig, Character } from '@/types';
import { createInitialCharacter } from '@/lib/characterSystem';
import { saveCharacter, setOnboardingComplete, saveSettings } from '@/lib/localStorage';
import { SwordIcon, SparklesIcon, UsersIcon, ShieldIcon, ScrollIcon, CrownIcon } from '@/components/ui/Icons';
import { AVATAR_OPTIONS } from '@/constants/avatars';
import { clsx } from 'clsx';

const SKIN_TONES = ['#fecaca', '#fde68a', '#d97706', '#92400e', '#451a03'];
const HAIR_COLORS = ['#000000', '#4b2c20', '#d97706', '#f5c518', '#ffffff'];
const EYE_COLORS = ['#1d4ed8', '#15803d', '#713f12', '#000000', '#7c3aed'];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [charClass, setCharClass] = useState<CharacterClass>('warrior');
    const [avatar, setAvatar] = useState<AvatarConfig>({
        bodyType: 0,
        skinTone: SKIN_TONES[1],
        hairStyle: 0,
        hairColor: HAIR_COLORS[0],
        eyeColor: EYE_COLORS[0],
        outfit: 0,
    });
    const [futureSelfName, setFutureSelfName] = useState('');
    const [personality, setPersonality] = useState('wise mentor');

    const router = useRouter();

    const [isGeneratingBio, setIsGeneratingBio] = useState(false);

    const handleComplete = async () => {
        setIsGeneratingBio(true);
        let finalBio = bio;

        try {
            const resp = await fetch('/api/generate-bio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, bio, charClass }),
            });
            const data = await resp.json();
            finalBio = data.bio;
        } catch (e) {
            console.error("Failed to generate bio", e);
        }

        const character = createInitialCharacter(name || 'Nameless Hero', charClass, avatar, finalBio);
        saveCharacter(character);
        setOnboardingComplete(true);
        saveSettings({
            futureSelfName: futureSelfName || `${name}'s Future Self`,
            futureSelfPersonality: personality,
            theme: 'dark',
            notifications: true,
            soundEffects: true,
            questAutoBreakdown: true,
        });
        setIsGeneratingBio(false);
        router.push('/');
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f] text-white">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-md w-full text-center space-y-8"
                    >
                        <div className="flex justify-center">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            >
                                <CrownIcon size={120} className="text-primary" />
                            </motion.div>
                        </div>
                        <h1 className="text-5xl font-bold">QUEST LOG</h1>
                        <p className="text-muted-foreground font-nunito leading-relaxed">
                            Your mundane tasks are but hidden fragments of an epic legend.
                            Step into the grimoire and forge your legacy across the stars.
                        </p>
                        <Button size="lg" className="w-full" onClick={nextStep}>
                            BEGIN YOUR LEGEND
                        </Button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-md w-full space-y-6"
                    >
                        <h2 className="text-3xl text-center">CHOOSE YOUR NAME</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="ui-label text-xs">Legacy Name</label>
                                <Input
                                    placeholder="Enter your name..."
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="bg-card/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="ui-label text-xs">Origin Story (Bio)</label>
                                <textarea
                                    placeholder="Tell your tale..."
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    className="w-full min-h-[100px] bg-card/50 border border-input p-3 focus:outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={prevStep}>BACK</Button>
                            <Button className="flex-1" onClick={nextStep} disabled={!name}>CONTINUE</Button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl w-full space-y-8"
                    >
                        <h2 className="text-3xl text-center">SELECT YOUR CLASS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {CHARACTER_CLASSES.map(cls => (
                                <Card
                                    key={cls.id}
                                    onClick={() => setCharClass(cls.id)}
                                    className={clsx(
                                        'p-4 cursor-pointer transition-all border-2 flex flex-col items-center text-center gap-4',
                                        charClass === cls.id ? 'border-primary gold-glow bg-primary/5' : 'border-border/30 hover:border-border'
                                    )}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted/50">
                                        {cls.id === 'warrior' && <SwordIcon className="text-destructive" />}
                                        {cls.id === 'mage' && <SparklesIcon className="text-secondary" />}
                                        {cls.id === 'rogue' && <ShieldIcon className="text-success" />}
                                        {cls.id === 'scholar' && <ScrollIcon className="text-primary" />}
                                        {cls.id === 'creator' && <SparklesIcon className="text-pink-500" />}
                                    </div>
                                    <h3 className="text-lg">{cls.name}</h3>
                                    <p className="text-xs text-muted-foreground font-nunito">{cls.description}</p>
                                    <Badge variant="muted" className="mt-auto">STAT: {cls.primaryStat}</Badge>
                                </Card>
                            ))}
                        </div>
                        <div className="flex gap-4 max-w-md mx-auto">
                            <Button variant="outline" className="flex-1" onClick={prevStep}>BACK</Button>
                            <Button className="flex-1" onClick={nextStep}>EQUIP SKILLS</Button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl w-full space-y-8"
                    >
                        <h2 className="text-3xl text-center">SELECT YOUR AVATAR</h2>
                        <p className="text-center text-muted-foreground font-nunito -mt-4">
                            Choose the face of your legend. This is how the chronicles will remember you.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {AVATAR_OPTIONS.map((opt: { id: string, url: string, class: string }) => (
                                <div
                                    key={opt.id}
                                    onClick={() => setAvatar({ ...avatar, imageUrl: opt.url })}
                                    className={clsx(
                                        'relative group cursor-pointer aspect-square rounded-xl overflow-hidden border-2 transition-all',
                                        avatar.imageUrl === opt.url ? 'border-primary gold-glow scale-105' : 'border-border/30 hover:border-border'
                                    )}
                                >
                                    <img
                                        src={opt.url}
                                        alt={opt.id}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    />
                                    <div className={clsx(
                                        'absolute inset-0 bg-primary/20 transition-opacity',
                                        avatar.imageUrl === opt.url ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                                    )} />
                                    {avatar.imageUrl === opt.url && (
                                        <div className="absolute top-2 right-2 bg-primary text-black rounded-full p-1 shadow-lg">
                                            <SparklesIcon size={12} />
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 backdrop-blur-sm">
                                        <p className="text-[10px] ui-label text-center uppercase tracking-widest">{opt.class}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 max-w-md mx-auto pt-4">
                            <Button variant="outline" className="flex-1" onClick={prevStep}>BACK</Button>
                            <Button className="flex-1" onClick={nextStep} disabled={!avatar.imageUrl}>FINALIZE</Button>
                        </div>
                    </motion.div>
                )}

                {step === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full space-y-8 text-center"
                    >
                        <h2 className="text-3xl">CONSULT THE FUTURE</h2>
                        <p className="text-muted-foreground font-nunito">
                            The Future Self is your guide across the timelines. Give them a name and personality.
                        </p>
                        <div className="space-y-4 text-left">
                            <div className="space-y-2">
                                <label className="ui-label text-xs">Future Name</label>
                                <Input
                                    placeholder="e.g. Alex from 2035"
                                    value={futureSelfName}
                                    onChange={e => setFutureSelfName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="ui-label text-xs">Personality</label>
                                <select
                                    className="w-full bg-card/50 border border-input p-3 focus:outline-none"
                                    value={personality}
                                    onChange={e => setPersonality(e.target.value)}
                                >
                                    <option value="wise mentor">Wise Mentor</option>
                                    <option value="tough love coach">Tough Love Coach</option>
                                    <option value="optimistic cheerleader">Optimistic Cheerleader</option>
                                    <option value="mystical oracle">Mystical Oracle</option>
                                </select>
                            </div>
                        </div>
                        <Button size="lg" className="w-full gold-glow" onClick={handleComplete} disabled={isGeneratingBio}>
                            {isGeneratingBio ? 'CHRONICLING...' : 'DESCEND INTO THE LOG'}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
