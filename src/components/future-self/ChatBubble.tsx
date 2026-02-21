
'use client';

import React from 'react';
import { FutureSelfMessage, AvatarConfig, CharacterClass } from '@/types';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { InfoIcon, SparklesIcon } from '@/components/ui/Icons';

interface ChatBubbleProps {
    message: FutureSelfMessage;
    characterAvatar?: AvatarConfig;
    characterClass?: CharacterClass;
    futureSelfName?: string;
}

export const ChatBubble = ({ message, characterAvatar, characterClass, futureSelfName }: ChatBubbleProps) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={clsx('flex gap-4 mb-6', isUser ? 'flex-row-reverse' : 'flex-row')}
        >
            <div className="flex-shrink-0 mt-1">
                {!isUser && characterAvatar && characterClass ? (
                    <CharacterAvatar
                        config={characterAvatar}
                        characterClass={characterClass}
                        className="w-10 h-10 rounded-full border-primary/50"
                        glow
                    />
                ) : (
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border">
                        <InfoIcon size={20} className="text-muted-foreground" />
                    </div>
                )}
            </div>

            <div className={clsx('max-w-[70%] space-y-1', isUser ? 'text-right' : 'text-left')}>
                {!isUser && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="ui-label text-[10px] text-primary">{futureSelfName}</span>
                        <Badge variant="mood" mood={message.mood} />
                    </div>
                )}
                <div className={clsx(
                    'p-4 font-nunito leading-relaxed relative',
                    isUser
                        ? 'bg-muted/50 border border-border rounded-bl-2xl rounded-tl-2xl rounded-tr-sm'
                        : 'bg-primary/5 border border-primary/20 rounded-br-2xl rounded-tr-2xl rounded-tl-sm purple-glow'
                )}>
                    {message.content}
                    {!isUser && (
                        <div className="absolute -top-1 -right-1">
                            <SparklesIcon size={12} className="text-primary/50" />
                        </div>
                    )}
                </div>
                <span className="text-[9px] text-muted-foreground ui-label">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
};

const Badge = ({ variant, mood }: { variant: string, mood?: string }) => {
    if (variant === 'mood' && mood) {
        const moods: Record<string, string> = {
            encouraging: 'bg-green-500/10 text-green-500 border-green-500/20',
            wise: 'bg-primary/10 text-primary border-primary/20',
            urgent: 'bg-destructive/10 text-destructive border-destructive/20',
            celebratory: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            reflective: 'bg-secondary/10 text-secondary border-secondary/20',
        };
        return (
            <span className={clsx('px-1.5 py-0.5 rounded-none border text-[8px] ui-label', moods[mood] || moods.wise)}>
                {mood.toUpperCase()}
            </span>
        );
    }
    return null;
};
