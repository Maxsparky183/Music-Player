import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Playlist, Track } from '../types';

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  setCurrentPlaylist: (playlist: Playlist | null) => void;
  exportPlaylist: (playlistId: string) => string;
  importPlaylist: (data: any) => void;
}

export const usePlaylistStore = create<PlaylistStore>()(persist((set, get) => ({
  playlists: [],
  currentPlaylist: null,

  createPlaylist: (name) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set((state) => ({ playlists: [...state.playlists, newPlaylist] }));
  },

  deletePlaylist: (id) => {
    set((state) => ({
      playlists: state.playlists.filter((p) => p.id !== id),
      currentPlaylist: state.currentPlaylist?.id === id ? null : state.currentPlaylist
    }));
  },

  addToPlaylist: (playlistId, track) => {
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: [...p.tracks, track], updatedAt: new Date() }
          : p
      )
    }));
  },

  removeFromPlaylist: (playlistId, trackId) => {
    set((state) => ({
      playlists: state.playlists.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId), updatedAt: new Date() }
          : p
      )
    }));
  },

  setCurrentPlaylist: (playlist) => {
    set({ currentPlaylist: playlist });
  },

  exportPlaylist: (playlistId) => {
    const playlist = get().playlists.find((p) => p.id === playlistId);
    if (playlist) {
      return JSON.stringify(playlist, null, 2);
    }
    return '';
  },

  importPlaylist: (data) => {
    try {
      const playlist: Playlist = JSON.parse(data);
      set((state) => ({ playlists: [...state.playlists, playlist] }));
    } catch (error) {
      console.error('Error importing playlist:', error);
    }
  }
}), {
  name: 'nuclear-playlists',
  partialize: (state) => ({
    playlists: state.playlists,
    currentPlaylist: state.currentPlaylist
  })
}));
