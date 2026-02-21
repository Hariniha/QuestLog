
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quest, QuestCategory, QuestDifficulty, QuestStatus } from '@/types';
import { getQuests, saveQuests } from '@/lib/localStorage';
import { QuestCard } from '@/components/quests/QuestCard';
import { Button } from '@/components/ui/Button';
import { Card, Input, Badge } from '@/components/ui';
import { SwordIcon, PlusIcon, InfoIcon } from '@/components/ui/Icons';
import { clsx } from 'clsx';
import { QuestFormModal } from '@/components/quests/QuestForm';
import { getCharacter } from '@/lib/localStorage';
import { Character } from '@/types';

const CATEGORIES: QuestCategory[] = ['health', 'career', 'learning', 'social', 'creative', 'personal', 'finance'];
const STATUSES: QuestStatus[] = ['active', 'completed', 'failed', 'abandoned'];

export default function QuestsBoard() {
    const [allQuests, setAllQuests] = useState<Quest[]>([]);
    const [filter, setFilter] = useState<QuestStatus | 'all'>('active');
    const [categoryFilter, setCategoryFilter] = useState<QuestCategory | 'all'>('all');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [character, setCharacter] = useState<Character | null>(null);
    const router = useRouter();

    useEffect(() => {
        setAllQuests(getQuests());
        setCharacter(getCharacter());
    }, []);

    const filteredQuests = allQuests.filter(q => {
        const matchesStatus = filter === 'all' ? true : q.status === filter;
        const matchesCategory = categoryFilter === 'all' ? true : q.category === categoryFilter;
        const matchesSearch = q.questTitle.toLowerCase().includes(search.toLowerCase()) ||
            q.title.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold">QUEST BOARD</h1>
                    <p className="text-muted-foreground font-nunito mt-1">Manage your destiny and track your progress across the realms.</p>
                </div>
                <Button size="lg" className="gold-glow" onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="mr-2" size={20} />
                    POST NEW QUEST
                </Button>
            </header>

            <QuestFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                character={character}
            />

            <Card className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <label className="ui-label text-xs mb-2 block text-muted-foreground">Search Scrolls</label>
                        <Input
                            placeholder="Search by title or narrative..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="ui-label text-xs mb-2 block text-muted-foreground">Status</label>
                            <div className="flex gap-2">
                                {['all', ...STATUSES].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilter(s as any)}
                                        className={clsx(
                                            'px-3 py-1 text-xs ui-label border transition-colors',
                                            filter === s ? 'bg-primary text-black border-primary' : 'bg-muted/30 border-border hover:border-foreground'
                                        )}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="ui-label text-xs mb-2 block text-muted-foreground">Category</label>
                            <select
                                className="bg-muted/30 border border-border px-3 py-1 text-xs ui-label focus:outline-none"
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value as any)}
                            >
                                <option value="all">ALL CATEGORIES</option>
                                {CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredQuests.map((quest) => (
                    <QuestCard
                        key={quest.id}
                        quest={quest}
                        onClick={(id) => router.push(`/quests/${id}`)}
                    />
                ))}

                {filteredQuests.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 text-muted-foreground">
                        <InfoIcon size={48} className="text-muted" />
                        <p className="font-nunito">No quests found matching your current filters.</p>
                        <Button variant="ghost" onClick={() => { setFilter('all'); setCategoryFilter('all'); setSearch(''); }}>
                            CLEAR ALL FILTERS
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
