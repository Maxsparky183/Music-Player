import React, { useState } from 'react';
import { Clock3, Heart, Search, Trash2 } from 'lucide-react';
import { TrackCard } from '../components/TrackCard';
import { useLibraryStore } from '../store/useLibraryStore';
import { usePlayerStore } from '../store/usePlayerStore';

export const LibraryPage: React.FC = () => {
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const { favoriteTracks, favoriteAlbums, favoriteArtists, savedSearches, toggleAlbum, toggleArtist, removeSearch } = useLibraryStore();
  const { history, clearHistory, setCurrentTrack, setQueue } = usePlayerStore();
  const tracks = tab === 'favorites' ? favoriteTracks : history;
  const playTrack = (track: typeof tracks[number]) => { setQueue(tracks); setCurrentTrack(track); };

  return <div className="p-6"><div className="mb-6 flex items-center justify-between"><div><h1 className="text-3xl font-bold">Your Library</h1><p className="mt-1 text-textSecondary">Favorites, searches, and listening history.</p></div>{tab === 'history' && <button onClick={clearHistory} className="flex items-center gap-1 text-sm text-accent"><Trash2 size={15} />Clear history</button>}</div>
    <div className="mb-6 flex gap-2"><button onClick={() => setTab('favorites')} className={tab === 'favorites' ? 'rounded bg-primary px-3 py-2 text-white' : 'rounded bg-surfaceHighlight px-3 py-2'}><Heart size={16} className="mr-1 inline" />Favorites</button><button onClick={() => setTab('history')} className={tab === 'history' ? 'rounded bg-primary px-3 py-2 text-white' : 'rounded bg-surfaceHighlight px-3 py-2'}><Clock3 size={16} className="mr-1 inline" />History</button></div>
    {tab === 'favorites' && <div className="mb-8 grid gap-6 md:grid-cols-3"><section><h2 className="mb-3 font-semibold">Artists</h2>{favoriteArtists.map((artist) => <button key={artist} onClick={() => toggleArtist(artist)} className="mb-2 block text-textSecondary hover:text-text">{artist} ×</button>) || <p className="text-sm text-textSecondary">Favorite artists will appear here.</p>}</section><section><h2 className="mb-3 font-semibold">Albums</h2>{favoriteAlbums.map((album) => <button key={album} onClick={() => toggleAlbum(album)} className="mb-2 block text-textSecondary hover:text-text">{album} ×</button>) || <p className="text-sm text-textSecondary">Favorite albums will appear here.</p>}</section><section><h2 className="mb-3 font-semibold">Saved searches</h2>{savedSearches.map((query) => <button key={query} onClick={() => { removeSearch(query); window.dispatchEvent(new CustomEvent('app:search', { detail: query })); }} className="mb-2 flex items-center gap-1 text-textSecondary hover:text-text"><Search size={14} />{query}</button>) || <p className="text-sm text-textSecondary">Saved searches will appear here.</p>}</section></div>}
    <section><h2 className="mb-3 text-xl font-semibold">{tab === 'favorites' ? 'Favorite tracks' : 'Recently played'}</h2><div className="space-y-1">{tracks.map((track) => <TrackCard key={track.id} track={track} onPlay={playTrack} />)}</div>{!tracks.length && <p className="py-12 text-center text-textSecondary">{tab === 'favorites' ? 'Like tracks to build your library.' : 'Play a track to start your history.'}</p>}</section>
  </div>;
};
