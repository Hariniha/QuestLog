
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Character, FutureSelfMessage, UserSettings, UserStreak, Quest } from '@/types';
import { getCharacter, getFutureSelfMessages, saveFutureSelfMessages, getSettings, getStreak, getQuests } from '@/lib/localStorage';
import { ChatBubble } from '@/components/future-self/ChatBubble';
import { Button } from '@/components/ui/Button';
import { Input, Card } from '@/components/ui';
import { MessageCircleIcon, SparklesIcon, ZapIcon, InfoIcon } from '@/components/ui/Icons';
import { generateFutureSelfResponse } from '@/lib/futureSelfEngine';
import { motion, AnimatePresence } from 'framer-motion';

export default function FutureSelfChat() {
    const [messages, setMessages] = useState<FutureSelfMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [character, setCharacter] = useState<Character | null>(null);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [streak, setStreak] = useState<UserStreak | null>(null);
    const [recentQuests, setRecentQuests] = useState<Quest[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCharacter(getCharacter());
        const savedMessages = getFutureSelfMessages();
        setMessages(savedMessages);
        setSettings(getSettings());
        setStreak(getStreak());
        setRecentQuests(getQuests().slice(-5));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (isLoaded) {
            saveFutureSelfMessages(messages);
        }
    }, [messages, isLoaded]);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || !character || !settings || !streak) return;

        const userMsg: FutureSelfMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
            mood: 'reflective',
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await generateFutureSelfResponse(
                text,
                character,
                recentQuests,
                streak,
                messages,
                settings
            );

            const aiMsg: FutureSelfMessage = {
                id: crypto.randomUUID(),
                role: 'future-self',
                content: response.content,
                timestamp: new Date().toISOString(),
                mood: response.mood,
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsTyping(false);
        }
    };

    const PROMPT_CHIPS = [
        "How am I doing?",
        "What should I focus on?",
        "Am I on the right path?",
        "Motivate me",
    ];

    if (!character || !settings) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center purple-glow">
                        <MessageCircleIcon className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">COMMUNION WITH THE FUTURE</h1>
                        <p className="text-xs text-muted-foreground ui-label">ENCRYPTED TEMPORAL LINK ESTABLISHED</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setMessages([]); saveFutureSelfMessages([]); }}>
                    CLEAR HISTORY
                </Button>
            </header>

            <Card className="flex-1 flex flex-col min-h-0 bg-muted/10 border-border/30">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 scrollbar-thin"
                >
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                            <SparklesIcon size={48} className="text-muted animate-pulse" />
                            <h2 className="text-xl">THE MIRROR IS DARK</h2>
                            <p className="text-sm text-muted-foreground font-nunito">
                                Speak into the mists of the future. Your wiser self awaits your call.
                            </p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <ChatBubble
                            key={msg.id}
                            message={msg}
                            characterAvatar={character.avatar}
                            characterClass={character.class}
                            futureSelfName={settings.futureSelfName}
                        />
                    ))}

                    {isTyping && (
                        <div className="flex gap-4 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center gold-glow animate-pulse">
                                <SparklesIcon size={20} className="text-primary" />
                            </div>
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                                <div className="flex gap-1">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border/30 space-y-4 bg-muted/20">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {PROMPT_CHIPS.map(chip => (
                            <button
                                key={chip}
                                onClick={() => handleSend(chip)}
                                className="whitespace-nowrap px-3 py-1.5 bg-background/50 border border-border/50 text-[10px] ui-label hover:border-primary transition-colors"
                                disabled={isTyping}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask your future self anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={isTyping}
                            className="bg-background"
                        />
                        <Button
                            onClick={() => handleSend()}
                            disabled={isTyping || !input.trim()}
                            className="gold-glow"
                        >
                            SEND
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
