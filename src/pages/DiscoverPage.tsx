import React, { useState, useEffect } from 'react';
import { MusicAPI } from '../services/api';
import { Track } from '../types';
import { TrackCard } from '../components/TrackCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { Loader2, TrendingUp, Music } from 'lucide-react';

const GENRES = ['Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Metal', 'Indie'];

export const DiscoverPage: React.FC = () => {
  const [trending, setTrending] = useState<Track[]>([]);
  const [genreTracks, setGenreTracks] = useState<Record<string, Track[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentTrack, setQueue, addToQueue } = usePlayerStore();

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoading(true);
    setError(null);
    try {
      const trendingTracks = await MusicAPI.getTrending();
      setTrending(trendingTracks);
    } catch (error) {
      console.error('Error loading trending:', error);
      setError(error instanceof Error ? error.message : 'Unable to load discovery music.');
    } finally {
      setLoading(false);
    }
  };

  const loadGenre = async (genre: string) => {
    setSelectedGenre(genre);
    setError(null);
    try {
      const tracks = await MusicAPI.getByGenre(genre);
      setGenreTracks(prev => ({ ...prev, [genre]: tracks }));
    } catch (error) {
      console.error('Error loading genre:', error);
      setError(error instanceof Error ? error.message : 'Unable to load this genre.');
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    const tracksToPlay = selectedGenre ? genreTracks[selectedGenre] || [] : trending;
    setQueue(tracksToPlay);
  };

  const handleAddToQueue = (track: Track) => {
    addToQueue(track);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Discover</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="space-y-8">
          {error && (
            <div role="alert" className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-accent">
              {error}
              <button onClick={loadTrending} className="ml-3 underline">Retry</button>
            </div>
          )}
          {/* Trending Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={handlePlayTrack}
                  onAddToQueue={handleAddToQueue}
                />
              ))}
            </div>
          </section>

          {/* Genre Browse */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Music className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Browse by Genre</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => loadGenre(genre)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedGenre === genre
                      ? 'bg-primary text-white'
                      : 'bg-surfaceHighlight hover:bg-surfaceHighlight/80 text-text'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {selectedGenre && genreTracks[selectedGenre] && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium mb-4">{selectedGenre} Tracks</h3>
                {genreTracks[selectedGenre].map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onPlay={handlePlayTrack}
                    onAddToQueue={handleAddToQueue}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
