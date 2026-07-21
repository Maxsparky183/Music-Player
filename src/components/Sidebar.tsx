import React from 'react';
import { Search, Compass, ListMusic, FolderOpen, Mic2, Library } from 'lucide-react';
import { cn } from '../utils/cn';
import { Theme, usePreferencesStore } from '../store/usePreferencesStore';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { theme, setTheme } = usePreferencesStore();
  const navItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'local', label: 'Local Files', icon: FolderOpen },
    { id: 'lyrics', label: 'Lyrics', icon: Mic2 }
    ,{ id: 'library', label: 'Library', icon: Library }
  ];

  return (
    <div className="w-64 bg-surface border-r border-border p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Nuclear</h1>
        <p className="text-sm text-textSecondary">Music Player</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                currentPage === item.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-surfaceHighlight text-text'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="mb-4">
          <p className="mb-2 text-xs text-textSecondary">Theme</p>
          <div className="flex gap-2">
            {(['violet', 'aqua'] as Theme[]).map((option) => (
              <button
                key={option}
                onClick={() => setTheme(option)}
                className={cn(
                  'rounded px-2 py-1 text-xs capitalize',
                  theme === option ? 'bg-primary text-white' : 'bg-surfaceHighlight text-textSecondary'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-textSecondary text-center">
          Privacy-First Music Player
        </p>
        <p className="text-xs text-textSecondary text-center mt-1">
          No tracking • No accounts
        </p>
      </div>
    </div>
  );
};
