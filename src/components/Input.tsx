import React from 'react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ className, icon, ...props }) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary">
          {icon}
        </div>
      )}
      <input
        className={cn(
          'w-full h-10 px-4 rounded-lg bg-surfaceHighlight border border-border text-text placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
          icon && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  );
};
