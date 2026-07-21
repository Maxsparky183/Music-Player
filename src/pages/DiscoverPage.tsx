import React, { useState, useEffect } from 'react';
import { MusicAPI } from '../services/api';
import { Track } from '../types';
import { TrackCard } from '../components/TrackCard';
import { usePlayerStore } from '../store/usePlayerStore';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePreferencesStore } from '../store/usePreferencesStore';
import { useVibeStore } from '../store/useVibeStore';
import { Loader2, TrendingUp, Music } from 'lucide-react';

const GENRES = ['Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Metal', 'Indie'];

export const DiscoverPage: React.FC = () => {
  const [trending, setTrending] = useState<Track[]>([]);
  const [genreTracks, setGenreTracks] = useState<Record<string, Track[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentTrack, setQueue, addToQueue } = usePlayerStore();
  const history = usePlayerStore((state) => state.history);
  const favoriteTracks = useLibraryStore((state) => state.favoriteTracks);
  const { volume, queue, setVolume, setQueue: replaceQueue } = usePlayerStore();
  const { theme, setTheme } = usePreferencesStore();
  const { sessions, saveSession } = useVibeStore();
  const [blendGenres, setBlendGenres] = useState<string[]>([]);
  const hour = new Date().getHours();
  const mood = hour < 12 ? 'Morning lift' : hour < 18 ? 'Daytime flow' : 'Late-night glow';

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

  const buildBlend = async () => {
    if (!blendGenres.length) return;
    setError(null);
    try {
      const lists = await Promise.all(blendGenres.map((genre) => MusicAPI.getByGenre(genre)));
      const blended = lists.flat().filter((track, index, all) => all.findIndex((item) => item.id === track.id) === index);
      replaceQueue(blended); if (blended[0]) setCurrentTrack(blended[0]);
    } catch { setError('Your blend could not be built. Please try again.'); }
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
          <section className="rounded-xl border border-primary/30 bg-surfaceHighlight p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-textSecondary">VIBE PULSE</p><h2 className="text-2xl font-semibold">{mood}</h2><p className="mt-1 text-textSecondary">Energy {Math.round(volume * 100)}% · {history.length} track listening streak</p></div><div className="flex flex-wrap gap-2">{(['Focus', 'Bass', 'Night', 'Wide'] as const).map((profile) => <button key={profile} onClick={() => setVolume(({ Focus: .55, Bass: .85, Night: .4, Wide: .7 })[profile])} className="rounded bg-surface px-3 py-2 text-sm hover:bg-primary hover:text-white">{profile}</button>)}</div></div></section>
          <section className="rounded-xl bg-surface p-5"><h2 className="mb-3 text-xl font-semibold">Vibe Blend</h2><p className="mb-3 text-sm text-textSecondary">Choose up to three genres and start a fresh queue.</p><div className="mb-3 flex flex-wrap gap-2">{GENRES.map((genre) => <button key={genre} onClick={() => setBlendGenres((items) => items.includes(genre) ? items.filter((item) => item !== genre) : items.length < 3 ? [...items, genre] : items)} className={blendGenres.includes(genre) ? 'rounded bg-primary px-3 py-1 text-sm text-white' : 'rounded bg-surfaceHighlight px-3 py-1 text-sm'}>{genre}</button>)}</div><button onClick={buildBlend} disabled={!blendGenres.length} className="rounded bg-primary px-4 py-2 text-sm text-white disabled:opacity-50">Build my blend</button></section>
          <section><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-semibold">Vibe Sessions</h2><button onClick={() => saveSession({ name: `${mood} session`, queue, volume, theme })} className="rounded bg-surfaceHighlight px-3 py-2 text-sm">Save current vibe</button></div><div className="flex flex-wrap gap-2">{sessions.map((session) => <button key={session.id} onClick={() => { replaceQueue(session.queue); setVolume(session.volume); setTheme(session.theme); if (session.queue[0]) setCurrentTrack(session.queue[0]); }} className="rounded border border-border px-3 py-2 text-sm hover:border-primary">{session.name}</button>)}</div></section>
          {error && (
            <div role="alert" className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-accent">
              {error}
              <button onClick={loadTrending} className="ml-3 underline">Retry</button>
            </div>
          )}
          {history.length > 0 && <section>
            <h2 className="mb-4 text-xl font-semibold">Recently played</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{history.slice(0, 6).map((track) => <TrackCard key={track.id} track={track} onPlay={(item) => { setQueue(history); setCurrentTrack(item); }} onAddToQueue={handleAddToQueue} />)}</div>
          </section>}
          {favoriteTracks.length > 0 && <section>
            <h2 className="mb-1 text-xl font-semibold">Because you liked</h2><p className="mb-4 text-sm text-textSecondary">A familiar mix from your saved tracks.</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{[...favoriteTracks, ...trending].filter((track, index, all) => all.findIndex((item) => item.id === track.id) === index).slice(0, 6).map((track) => <TrackCard key={track.id} track={track} onPlay={handlePlayTrack} onAddToQueue={handleAddToQueue} />)}</div>
          </section>}
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
