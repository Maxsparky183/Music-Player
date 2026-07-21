import React, { useState } from 'react';
import { MusicAPI } from '../services/api';
import { Track, SearchResult } from '../types';
import { TrackCard } from '../components/TrackCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { SearchBar } from '../components/SearchBar';
import { Loader2 } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';

export const SearchPage: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentTrack, setQueue, addToQueue } = usePlayerStore();
  const saveSearch = useLibraryStore((state) => state.saveSearch);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    saveSearch(query.trim());
    
    setLoading(true);
    setError(null);
    try {
      const searchResults = await MusicAPI.searchAll(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setError(error instanceof Error ? error.message : 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    const allTracks = results.flatMap(r => r.tracks);
    setQueue(allTracks);
  };

  const handleAddToQueue = (track: Track) => {
    addToQueue(track);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-accent">
          {error}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-8">
          {results.map((result) => (
            result.tracks.length > 0 && (
              <div key={result.source}>
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {result.source} Results
                </h2>
                <div className="space-y-2">
                  {result.tracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onPlay={handlePlayTrack}
                      onAddToQueue={handleAddToQueue}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-12 text-textSecondary">
          <p>Search YouTube Music for tracks to play.</p>
          <p className="text-sm mt-2">Results are supplied by the local music backend.</p>
        </div>
      )}
    </div>
  );
};
