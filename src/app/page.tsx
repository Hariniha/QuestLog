
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Character,
  Quest,
  Achievement,
  UserStreak,
  AppState,
  FutureSelfMessage
} from '@/types';
import {
  getCharacter,
  getQuests,
  getStreak,
  getUnlockedAchievements,
  saveQuests,
  saveUnlockedAchievements,
  getJournal,
  getFutureSelfMessages,
  getSettings
} from '@/lib/localStorage';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuestCard } from '@/components/quests/QuestCard';
import { Button } from '@/components/ui/Button';
import { Badge, Card } from '@/components/ui';
import {
  SwordIcon,
  TrophyIcon,
  FlameIcon,
  CoinsIcon,
  ZapIcon,
  SparklesIcon,
  PlusIcon
} from '@/components/ui/Icons';
import { motion } from 'framer-motion';
import { QuestFormModal } from '@/components/quests/QuestForm';

export default function Dashboard() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState<FutureSelfMessage | null>(null);
  const [futureName, setFutureName] = useState('Your Future Self');
  const router = useRouter();

  useEffect(() => {
    // Load state
    const char = getCharacter();
    const allQuests = getQuests();
    const currentStreak = getStreak();
    const unlocked = getUnlockedAchievements();

    setActiveQuests(allQuests.filter(q => q.status === 'active'));
    setCompletedCount(allQuests.filter(q => q.status === 'completed').length);

    setCharacter(char);
    setStreak(currentStreak);
    setUnlockedCount(unlocked.length);

    const msgs = getFutureSelfMessages();
    const lastAIResponse = [...msgs].reverse().find(m => m.role === 'future-self');
    if (lastAIResponse) {
      setLastMessage(lastAIResponse);
    }

    setFutureName(getSettings().futureSelfName);
  }, []);

  if (!character) return null;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">WELCOME BACK, {character.name}</h1>
          <p className="text-muted-foreground font-nunito mt-2">
            The scrolls of fate await your next entry. What shall we conquer today?
          </p>
        </div>
        <div className="flex gap-4">
          <Button size="lg" className="gold-glow" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="mr-2" size={20} />
            NEW QUEST
          </Button>
        </div>
      </section>

      <QuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        character={character}
      />

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="QUESTS COMPLETED"
          value={completedCount}
          icon={SwordIcon}
          color="#10b981"
        />
        <StatCard
          label="CURRENT STREAK"
          value={`${streak?.current || 0} DAYS`}
          icon={FlameIcon}
          color="#ef4444"
        />
        <StatCard
          label="GOLD EARNED"
          value={character.gold}
          icon={CoinsIcon}
          color="#f5c518"
        />
        <StatCard
          label="ACHIEVEMENTS"
          value={`${unlockedCount}/30`}
          icon={TrophyIcon}
          color="#7c3aed"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Quests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">ACTIVE QUESTS</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              VIEW ALL BOARD
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClick={(id) => router.push(`/quests/${id}`)}
              />
            ))}
            {activeQuests.length === 0 && (
              <Card className="col-span-full p-10 flex flex-col items-center justify-center text-center gap-4">
                <SwordIcon size={48} className="text-muted" />
                <p className="text-muted-foreground">The board is empty. No challenges await.</p>
                <Button variant="outline">POST A BOUNTY</Button>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar / Daily Briefing */}
        <div className="space-y-8">
          <Card className="p-6 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-4">
              <SparklesIcon className="text-primary" />
              <h3 className="ui-label text-sm">FUTURE BRIEFING</h3>
            </div>
            {lastMessage ? (
              <>
                <p className="font-nunito italic text-sm leading-relaxed line-clamp-4">
                  "{lastMessage.content}"
                </p>
                <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-between">
                  <span className="text-[10px] ui-label uppercase">FROM: {futureName} (2036)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs p-0 h-auto ui-label text-primary"
                    onClick={() => router.push('/future-self')}
                  >
                    REPLY
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-nunito italic text-muted-foreground leading-relaxed">
                  "The mists of time are silent. Speak into the void to establish a connection."
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-[10px] ui-label text-primary h-auto p-0"
                  onClick={() => router.push('/future-self')}
                >
                  INITIATE LINK
                </Button>
              </div>
            )}
          </Card>

          <div className="space-y-4">
            <h3 className="ui-label text-sm px-2">RECENT PROGRESS</h3>
            <div className="space-y-3">
              {getJournal().slice(0, 5).map(entry => (
                <div key={entry.id} className="flex items-center gap-4 p-3 bg-muted/20 border border-border/30">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center text-primary">
                    <ZapIcon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold font-rajdhani uppercase">+{entry.xpGained} XP Gained</p>
                    <p className="text-[10px] text-muted-foreground">{entry.summary}</p>
                  </div>
                </div>
              ))}
              {getJournal().length === 0 && (
                <div className="p-4 text-center border border-dashed border-border/50">
                  <p className="text-[10px] ui-label text-muted-foreground uppercase">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
