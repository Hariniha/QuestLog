
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'bg-card text-card-foreground border border-border/50 relative overflow-hidden',
            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none',
            className
        )}
        {...props}
    />
);

export const InteractiveCard = ({ className, ...props }: HTMLMotionProps<'div'>) => (
    <motion.div
        whileHover={{ y: -4, borderColor: 'var(--primary)', boxShadow: '0 10px 30px -10px rgba(245,197,24,0.3)' }}
        className={cn(
            'bg-card text-card-foreground border border-border/50 relative overflow-hidden cursor-pointer transition-colors',
            'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none',
            className
        )}
        {...props}
    />
);

export const Badge = ({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'gold' | 'purple' | 'red' | 'green' | 'muted' }) => {
    const variants = {
        default: 'bg-muted text-foreground border-border',
        gold: 'bg-primary/20 text-primary border-primary/50',
        purple: 'bg-secondary/20 text-secondary border-secondary/50',
        red: 'bg-destructive/20 text-destructive border-destructive/50',
        green: 'bg-success/20 text-success border-success/50',
        muted: 'bg-muted/50 text-muted-foreground border-transparent',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold transition-colors ui-label',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <input
            className={cn(
                'flex h-10 w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-primary/50',
                className
            )}
            ref={ref}
            {...props}
        />
    )
);
Input.displayName = 'Input';

export const Progress = ({ value = 0, max = 100, className, color = 'var(--primary)' }: { value?: number; max?: number; className?: string; color?: string }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn('h-2 w-full bg-muted overflow-hidden relative', className)}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full relative"
                style={{ backgroundColor: color }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 animate-pulse bg-white/10" />
            </motion.div>
        </div>
    );
};
