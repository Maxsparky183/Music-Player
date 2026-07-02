import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Slider } from './Slider';
import { Button } from './Button';
import { cn } from '../utils/cn';

export const PlayerControls: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    isShuffle,
    repeatMode,
    play,
    pause,
    next,
    previous,
    setVolume,
    setProgress,
    toggleShuffle,
    setRepeatMode,
    howl,
    isLoading,
    error
  } = usePlayerStore();

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!howl) return;

    const interval = setInterval(() => {
      const seek = howl.seek();
      setCurrentTime(seek);
      setProgress((seek / duration) * 100);
    }, 1000);

    return () => clearInterval(interval);
  }, [howl, duration, setProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRepeatClick = () => {
    const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-textSecondary w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={progress}
            onChange={setProgress}
            className="flex-1"
          />
          <span className="text-xs text-textSecondary w-10">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentTrack?.thumbnail && (
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-14 h-14 rounded object-cover"
              />
            )}
            <div className="min-w-0">
              <h4 className="font-medium text-text truncate">{currentTrack?.title}</h4>
              <p className="text-sm text-textSecondary truncate">{currentTrack?.artist}</p>
              {isLoading && <p className="text-xs text-primary mt-1">Loading audio...</p>}
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              onClick={toggleShuffle}
              className={cn(isShuffle && 'text-primary')}
            >
              <Shuffle size={20} />
            </Button>
            
            <Button variant="icon" onClick={previous}>
              <SkipBack size={24} />
            </Button>
            
            <Button
              variant="primary"
              size="lg"
              onClick={isPlaying ? pause : play}
              className="w-14 h-14 rounded-full"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="fill-white" />}
            </Button>
            
            <Button variant="icon" onClick={next}>
              <SkipForward size={24} />
            </Button>
            
            <Button
              variant="icon"
              onClick={handleRepeatClick}
              className={cn(repeatMode !== 'none' && 'text-primary')}
            >
              <Repeat size={20} />
              {repeatMode === 'one' && (
                <span className="absolute text-xs">1</span>
              )}
            </Button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <Volume2 size={20} className="text-textSecondary" />
            <div className="w-32">
              <Slider value={volume * 100} onChange={(v) => setVolume(v / 100)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
