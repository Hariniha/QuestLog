
export type QuestDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'legendary';
export type QuestStatus = 'active' | 'completed' | 'failed' | 'abandoned';
export type QuestCategory = 'health' | 'career' | 'learning' | 'social' | 'creative' | 'personal' | 'finance';

export interface Quest {
  id: string;
  title: string;
  questTitle: string;
  description: string;
  questNarrative: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  status: QuestStatus;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  steps: QuestStep[];
  tags: string[];
  streak: boolean;
  companions: string[];
}

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface Character {
  id: string;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  stats: CharacterStats;
  avatar: AvatarConfig;
  bio: string;
  createdAt: string;
}

export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'scholar' | 'creator';

export interface CharacterStats {
  strength: number;
  intelligence: number;
  agility: number;
  creativity: number;
  charisma: number;
  wisdom: number;
}

export interface AvatarConfig {
  bodyType: number;
  skinTone: string;
  hairStyle: number;
  hairColor: string;
  eyeColor: string;
  outfit: number;
  imageUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  condition: string;
  xpBonus: number;
}

export interface FutureSelfMessage {
  id: string;
  role: 'user' | 'future-self';
  content: string;
  timestamp: string;
  mood: 'encouraging' | 'wise' | 'urgent' | 'celebratory' | 'reflective';
}

export interface JournalEntry {
  id: string;
  date: string;
  questsCompleted: number;
  xpGained: number;
  summary: string;
  reflection?: string;
}

export interface UserStreak {
  current: number;
  longest: number;
  lastActiveDate: string;
}

export interface UserSettings {
  futureSelfName: string;
  futureSelfPersonality: string;
  theme: 'dark' | 'darker';
  notifications: boolean;
  soundEffects: boolean;
  questAutoBreakdown: boolean;
}

export interface AppState {
  character: Character | null;
  quests: Quest[];
  achievements: Achievement[];
  unlockedAchievements: string[];
  futureSelfMessages: FutureSelfMessage[];
  journal: JournalEntry[];
  streak: UserStreak;
  onboardingComplete: boolean;
  settings: UserSettings;
}
