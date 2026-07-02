import React, { useState, useEffect } from 'react';
import { LyricsAPI } from '../services/api';
import { usePlayerStore } from '../store/usePlayerStore';
import { Loader2, Music2 } from 'lucide-react';

export const LyricsPage: React.FC = () => {
  const { currentTrack } = usePlayerStore();
  const [lyrics, setLyrics] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      loadLyrics();
    } else {
      setLyrics('');
    }
  }, [currentTrack]);

  const loadLyrics = async () => {
    if (!currentTrack) return;
    
    setLoading(true);
    try {
      const lyricsText = await LyricsAPI.getLyrics(currentTrack);
      setLyrics(lyricsText);
    } catch (error) {
      console.error('Error loading lyrics:', error);
      setLyrics('Lyrics not available');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Lyrics</h1>

      {!currentTrack ? (
        <div className="text-center py-12 text-textSecondary">
          <Music2 size={48} className="mx-auto mb-4 opacity-50" />
          <p>Play a song to view lyrics</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
            <p className="text-textSecondary">{currentTrack.artist}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <div className="bg-surfaceHighlight rounded-lg p-6">
              <pre className="whitespace-pre-wrap font-sans text-text leading-relaxed">
                {lyrics}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
