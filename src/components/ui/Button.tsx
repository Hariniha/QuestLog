
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(245,197,24,0.2)]',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_10px_rgba(124,58,237,0.2)]',
            outline: 'border-2 border-border bg-transparent hover:bg-muted text-foreground',
            ghost: 'bg-transparent hover:bg-muted text-foreground',
            danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            gold: 'bg-gradient-to-r from-[#f5c518] to-[#d4af37] text-black font-bold uppercase tracking-tighter shadow-[0_0_20px_rgba(245,197,24,0.4)]',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs',
            md: 'px-6 py-2.5 text-sm',
            lg: 'px-8 py-3.5 text-base',
            icon: 'p-2',
        };

        return (
            <motion.button
                ref={ref as any}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    'inline-flex items-center justify-center rounded-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ui-label',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
