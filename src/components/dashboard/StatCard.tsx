
import React from 'react';
import { Card } from '@/components/ui';
import { motion } from 'framer-motion';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    className?: string;
    color?: string;
}

export const StatCard = ({ label, value, icon: Icon, className, color = 'var(--primary)' }: StatCardProps) => (
    <Card className={className}>
        <div className="p-6 flex items-center gap-4">
            <div
                className="w-12 h-12 flex items-center justify-center bg-muted/30 border border-border/50"
                style={{ color }}
            >
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs ui-label text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold font-rajdhani leading-none mt-1">{value}</p>
            </div>
        </div>
        <div className="h-1 w-full bg-muted overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                className="h-full"
                style={{ backgroundColor: color, opacity: 0.3 }}
            />
        </div>
    </Card>
);
