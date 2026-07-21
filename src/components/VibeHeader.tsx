import React from 'react';
import { Home, History, Download, Settings, Crown } from 'lucide-react';
import { cn } from '../utils/cn';

interface VibeHeaderProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

export const VibeHeader: React.FC<VibeHeaderProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'downloads', icon: Download, label: 'Downloads' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="border-b border-outlineVariant/70 bg-surfaceContainer/95 backdrop-blur">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary display-lg">VibeTerminal</h1>
            <p className="mt-1 text-sm text-onSurfaceVariant body-base">Audiophile Pro</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2">
            <Crown size={18} className="text-primary" />
            <span className="text-sm font-semibold text-onSurface caption-caps">PRO MEMBER</span>
          </div>
        </div>
      </div>

      <nav className="flex items-center gap-2 px-6 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange?.(item.id)}
              className={cn(
                'flex items-center gap-2 rounded-full border border-transparent px-4 py-2 transition-all duration-200',
                isActive
                  ? 'border-primary/30 bg-primary text-onPrimary shadow-[0_10px_30px_rgba(208,188,255,0.16)]'
                  : 'text-onSurfaceVariant hover:border-outlineVariant/70 hover:bg-surfaceContainerHigh hover:text-onSurface'
              )}
            >
              <Icon size={18} />
              <span className="text-sm font-medium label-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
