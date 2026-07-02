import React from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary hover:bg-primaryHover text-white',
    secondary: 'bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-text',
    ghost: 'hover:bg-surfaceHighlight text-text',
    icon: 'hover:bg-surfaceHighlight text-text p-2'
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        variant !== 'icon' && sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
