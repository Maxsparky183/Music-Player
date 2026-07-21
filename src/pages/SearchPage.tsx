import React, { useState } from 'react';
import { MusicAPI } from '../services/api';
import { Track, SearchResult } from '../types';
import { TrackCard } from '../components/TrackCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { SearchBar } from '../components/SearchBar';
import { Loader2 } from 'lucide-react';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlaylistStore } from '../store/usePlaylistStore';

export const SearchPage: React.FC = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentTrack, setQueue, addToQueue } = usePlayerStore();
  const saveSearch = useLibraryStore((state) => state.saveSearch);
  const [filter, setFilter] = useState<'tracks' | 'artists' | 'albums' | 'playlists' | 'local'>('tracks');
  const playlists = usePlaylistStore((state) => state.playlists);

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

  const allTracks = results.flatMap((result) => result.tracks);
  const filteredTracks = filter === 'local' ? allTracks.filter((track) => track.source === 'local') : allTracks;
  const artists = [...new Set(allTracks.map((track) => track.artist))];
  const albums = [...new Set(allTracks.map((track) => track.album).filter(Boolean))];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <SearchBar onSearch={handleSearch} />
        <div className="mt-4 flex flex-wrap gap-2">{(['tracks', 'artists', 'albums', 'playlists', 'local'] as const).map((option) => <button key={option} onClick={() => setFilter(option)} className={filter === option ? 'rounded bg-primary px-3 py-1 text-sm text-white capitalize' : 'rounded bg-surfaceHighlight px-3 py-1 text-sm capitalize'}>{option === 'local' ? 'Local Library' : option}</button>)}</div>
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

      {!loading && results.length > 0 && filter === 'tracks' && (
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

      {!loading && results.length > 0 && filter === 'artists' && <div className="space-y-2">{artists.map((artist) => <button key={artist} onClick={() => handleSearch(artist)} className="block w-full rounded-lg bg-surfaceHighlight p-4 text-left hover:bg-surface"><p className="font-medium">{artist}</p><p className="text-sm text-textSecondary">Open artist radio</p></button>)}</div>}
      {!loading && results.length > 0 && filter === 'albums' && <div className="space-y-2">{albums.map((album) => <button key={album} onClick={() => handleSearch(album || '')} className="block w-full rounded-lg bg-surfaceHighlight p-4 text-left hover:bg-surface"><p className="font-medium">{album}</p><p className="text-sm text-textSecondary">Open album tracks</p></button>)}</div>}
      {!loading && results.length > 0 && filter === 'local' && <div className="space-y-2">{filteredTracks.map((track) => <TrackCard key={track.id} track={track} onPlay={handlePlayTrack} onAddToQueue={handleAddToQueue} />)}{!filteredTracks.length && <p className="py-8 text-textSecondary">No local tracks are in these results. Use Local Files to scan your library.</p>}</div>}
      {!loading && filter === 'playlists' && <div className="space-y-3">{playlists.map((playlist) => <div key={playlist.id} className="rounded-lg bg-surfaceHighlight p-4"><div className="mb-3 flex items-center justify-between"><div><p className="font-medium">{playlist.name}</p><p className="text-sm text-textSecondary">{playlist.tracks.length} tracks</p></div><button onClick={() => { setQueue(playlist.tracks); if (playlist.tracks[0]) setCurrentTrack(playlist.tracks[0]); }} className="rounded bg-primary px-3 py-2 text-sm text-white">Play all</button></div>{playlist.tracks.slice(0, 4).map((track) => <TrackCard key={track.id} track={track} onPlay={(item) => { setQueue(playlist.tracks); setCurrentTrack(item); }} />)}</div>)}{!playlists.length && <p className="rounded-lg bg-surfaceHighlight p-5 text-textSecondary">Create or import a playlist to play it from search.</p>}</div>}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-12 text-textSecondary">
          <p>Search YouTube Music for tracks to play.</p>
          <p className="text-sm mt-2">Results are supplied by the local music backend.</p>
        </div>
      )}
    </div>
  );
};
