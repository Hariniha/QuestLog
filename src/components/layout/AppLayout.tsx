
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Character, AppState } from '@/types';
import { getCharacter, isOnboardingComplete } from '@/lib/localStorage';
import { motion } from 'framer-motion';
import {
    LayoutDashboardIcon,
    SwordIcon,
    UserIcon,
    MessageCircleIcon,
    TrophyIcon,
    PlusIcon,
    InfoIcon
} from '@/components/ui/Icons';
import Link from 'next/link';
import { clsx } from 'clsx';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isComplete = isOnboardingComplete();
        if (!isComplete && pathname !== '/onboarding') {
            router.push('/onboarding');
            return;
        }

        setCharacter(getCharacter());
        setLoading(false);
    }, [router, pathname]);

    if (loading && pathname !== '/onboarding') {
        return <div className="min-h-screen bg-background" />;
    }

    if (pathname === '/onboarding') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar character={character} />

            {/* Mobile Nav Top Bar */}
            <div className="lg:hidden h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card sticky top-0 z-40">
                <span className="font-bold tracking-tighter text-primary">⚔️ QUESTLOG</span>
                <Link href="/quests/new">
                    <div className="p-2 bg-primary text-primary-foreground rounded-full">
                        <PlusIcon size={20} />
                    </div>
                </Link>
            </div>

            <main className="lg:pl-[280px] pb-24 lg:pb-0">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={pathname}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/50 flex items-center justify-around px-2 z-40">
                {[
                    { href: '/', icon: LayoutDashboardIcon },
                    { href: '/quests', icon: SwordIcon },
                    { href: '/character', icon: UserIcon },
                    { href: '/future-self', icon: MessageCircleIcon },
                    { href: '/achievements', icon: TrophyIcon },
                    { href: '/guide', icon: InfoIcon },
                ].map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1">
                            <item.icon
                                size={24}
                                className={clsx(isActive ? 'text-primary' : 'text-muted-foreground')}
                            />
                            <div className={clsx('w-1 h-1 rounded-full', isActive ? 'bg-primary' : 'bg-transparent')} />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
