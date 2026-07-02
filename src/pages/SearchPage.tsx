import React, { useState } from 'react';
import { MusicAPI } from '../services/api';
import { Track, SearchResult } from '../types';
import { TrackCard } from '../components/TrackCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { SearchBar } from '../components/SearchBar';
import { Loader2 } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { setCurrentTrack, setQueue, addToQueue } = usePlayerStore();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await MusicAPI.searchAll(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      // Show error message to user
      setResults([]);
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

      {!loading && results.length === 0 && (
        <div className="text-center py-12 text-textSecondary">
          <p>Search for music across YouTube, SoundCloud, and Bandcamp</p>
          <p className="text-sm mt-2">Note: If no results appear, the Invidious instances may be temporarily down. Try again later.</p>
        </div>
      )}
    </div>
  );
};
