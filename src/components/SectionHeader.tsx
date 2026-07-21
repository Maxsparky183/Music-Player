import React from 'react';
import { cn } from '../utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={cn('mb-6 rounded-xl border border-outlineVariant/40 bg-surfaceContainer/60 px-4 py-3', className)}>
      <h2 className="text-lg font-bold text-onSurface headline-md">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-onSurfaceVariant body-base">{subtitle}</p>
      )}
    </div>
  );
};
