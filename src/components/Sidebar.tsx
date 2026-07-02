import React from 'react';
import { Search, Compass, ListMusic, FolderOpen, Mic2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'local', label: 'Local Files', icon: FolderOpen },
    { id: 'lyrics', label: 'Lyrics', icon: Mic2 }
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
