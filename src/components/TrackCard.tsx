import React from 'react';
import { Track } from '../types';
import { Play, Plus } from 'lucide-react';
import { cn } from '../utils/cn';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onAddToQueue?: (track: Track) => void;
  isCurrent?: boolean;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onPlay,
  onAddToQueue,
  isCurrent = false
}) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-3 rounded-lg hover:bg-surfaceHighlight transition-colors cursor-pointer',
        isCurrent && 'bg-surfaceHighlight border border-primary'
      )}
      onClick={() => onPlay(track)}
    >
      <div className="relative w-12 h-12 rounded overflow-hidden bg-surface flex-shrink-0">
        {track.thumbnail ? (
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-textSecondary">
            <Play size={20} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play size={20} className="text-white fill-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-text truncate">{track.title}</h3>
        <p className="text-sm text-textSecondary truncate">{track.artist}</p>
      </div>
      
      {track.source && (
        <span className="text-xs px-2 py-1 rounded-full bg-surface text-textSecondary capitalize">
          {track.source}
        </span>
      )}
      
      {onAddToQueue && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToQueue(track);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-surface rounded-lg"
        >
          <Plus size={16} className="text-text" />
        </button>
      )}
    </div>
  );
};
