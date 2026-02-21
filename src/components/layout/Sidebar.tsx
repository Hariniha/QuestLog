
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import {
    LayoutDashboardIcon,
    SwordIcon,
    UserIcon,
    MessageCircleIcon,
    TrophyIcon,
    BookIcon,
    CrownIcon,
    InfoIcon
} from '@/components/ui/Icons';
import { CharacterAvatar } from '@/components/character/CharacterAvatar';
import { Character } from '@/types';
import { Progress } from '@/components/ui';

interface SidebarProps {
    character: Character | null;
}

const NAV_ITEMS = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
    { name: 'Quests', href: '/quests', icon: SwordIcon },
    { name: 'Character', href: '/character', icon: UserIcon },
    { name: 'Future Self', href: '/future-self', icon: MessageCircleIcon },
    { name: 'Achievements', href: '/achievements', icon: TrophyIcon },
    { name: 'Journal', href: '/journal', icon: BookIcon },
    { name: 'Guide', href: '/guide', icon: InfoIcon },
];

export const Sidebar = ({ character }: SidebarProps) => {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-[280px] h-screen fixed left-0 top-0 bg-card border-r border-border/50 z-50">
            <div className="p-8 flex items-center gap-3">
                <CrownIcon className="text-primary" size={32} />
                <span className="text-xl font-bold tracking-tight">QUESTLOG</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={clsx(
                                'group flex items-center gap-4 px-4 py-3 transition-all relative overflow-hidden',
                                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            )}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-primary/5 border-l-2 border-primary"
                                    />
                                )}
                                <item.icon size={20} className={clsx('relative z-10 transition-colors', isActive ? 'text-primary' : 'group-hover:text-primary')} />
                                <span className="relative z-10 ui-label text-sm">{item.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {character && (
                <div className="p-6 bg-muted/30 border-t border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                        <CharacterAvatar
                            config={character.avatar}
                            characterClass={character.class}
                            className="w-12 h-12 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{character.name}</p>
                            <p className="text-xs text-primary ui-label">LVL {character.level} {character.class}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] ui-label">
                            <span>XP: {character.xp}</span>
                            <span>{character.xpToNextLevel}</span>
                        </div>
                        <Progress value={character.xp} max={character.xpToNextLevel} />
                    </div>
                </div>
            )}
        </aside>
    );
};
