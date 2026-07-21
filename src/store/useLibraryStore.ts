import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track } from '../types';

interface LibraryStore {
  favoriteTracks: Track[];
  favoriteAlbums: string[];
  favoriteArtists: string[];
  savedSearches: string[];
  toggleTrack: (track: Track) => void;
  toggleAlbum: (album: string) => void;
  toggleArtist: (artist: string) => void;
  saveSearch: (query: string) => void;
  removeSearch: (query: string) => void;
}

export const useLibraryStore = create<LibraryStore>()(persist((set) => ({
  favoriteTracks: [],
  favoriteAlbums: [],
  favoriteArtists: [],
  savedSearches: [],
  toggleTrack: (track) => set((state) => ({
    favoriteTracks: state.favoriteTracks.some((item) => item.id === track.id)
      ? state.favoriteTracks.filter((item) => item.id !== track.id)
      : [track, ...state.favoriteTracks]
  })),
  toggleAlbum: (album) => set((state) => ({
    favoriteAlbums: state.favoriteAlbums.includes(album)
      ? state.favoriteAlbums.filter((item) => item !== album)
      : [album, ...state.favoriteAlbums]
  })),
  toggleArtist: (artist) => set((state) => ({
    favoriteArtists: state.favoriteArtists.includes(artist)
      ? state.favoriteArtists.filter((item) => item !== artist)
      : [artist, ...state.favoriteArtists]
  })),
  saveSearch: (query) => set((state) => ({
    savedSearches: [query, ...state.savedSearches.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 20)
  })),
  removeSearch: (query) => set((state) => ({ savedSearches: state.savedSearches.filter((item) => item !== query) }))
}), { name: 'sonic-library' }));
