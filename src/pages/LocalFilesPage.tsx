import React, { useState } from 'react';
import { Track } from '../types';
import { TrackCard } from '../components/TrackCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { Button } from '../components/Button';
import { FolderOpen, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    electronAPI?: {
      selectDirectory: () => Promise<{ canceled: boolean; filePaths: string[] }>;
      scanDirectory: (dir: string) => Promise<any[]>;
      getAudioMetadata: (path: string) => Promise<any>;
    };
  }
}

export const LocalFilesPage: React.FC = () => {
  const [localTracks, setLocalTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { setCurrentTrack, setQueue } = usePlayerStore();

  const handleSelectDirectory = async () => {
    if (!window.electronAPI) {
      alert('Local file access is only available in the desktop app');
      return;
    }

    const result = await window.electronAPI.selectDirectory();
    if (!result.canceled && result.filePaths.length > 0) {
      setLoading(true);
      try {
        const files = await window.electronAPI.scanDirectory(result.filePaths[0]);
        const tracks: Track[] = files.map((file: any, index: number) => ({
          id: `local-${index}-${Date.now()}`,
          title: file.name,
          artist: 'Unknown Artist',
          source: 'local',
          path: file.path
        }));
        setLocalTracks(tracks);
      } catch (error) {
        console.error('Error scanning directory:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setQueue(localTracks);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Local Files</h1>
        <Button variant="primary" onClick={handleSelectDirectory}>
          <FolderOpen size={16} className="mr-2" />
          Select Music Folder
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}

      {!loading && localTracks.length > 0 && (
        <div className="space-y-2">
          {localTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={handlePlayTrack}
            />
          ))}
        </div>
      )}

      {!loading && localTracks.length === 0 && (
        <div className="text-center py-12 text-textSecondary">
          <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p className="mb-2">No local files loaded</p>
          <p className="text-sm">Select a folder containing MP3, FLAC, or other audio files</p>
        </div>
      )}
    </div>
  );
};
