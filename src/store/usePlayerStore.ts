import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Howl } from 'howler';
import { Track, PlayerState } from '../types';
import { MusicAPI } from '../services/api';

interface PlayerStore extends PlayerState {
  setCurrentTrack: (track: Track) => Promise<void>;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'all' | 'one') => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  history: Track[];
  clearHistory: () => void;
  howl: Howl | null;
  isLoading: boolean;
  error: string | null;
}

const toLocalFileUrl = (path: string) => encodeURI(`file:///${path.replace(/\\/g, '/')}`);

export const usePlayerStore = create<PlayerStore>()(persist((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: 'none',
  queue: [],
  currentIndex: 0,
  howl: null,
  isLoading: false,
  error: null,
  history: [],

  setCurrentTrack: async (track) => {
    const { howl } = get();
    if (howl) {
      howl.unload();
    }

    set((state) => ({
      currentTrack: track,
      isLoading: true,
      error: null,
      progress: 0,
      history: [track, ...state.history.filter((item) => item.id !== track.id)].slice(0, 100)
    }));

    try {
      const source = track.source === 'local'
        ? track.path
          ? toLocalFileUrl(track.path)
          : (() => { throw new Error('This local track no longer has a file path. Scan its folder again.'); })()
        : (await MusicAPI.getAudioStream(track.id)).audio_url;

      if (!source) throw new Error('No playable audio source is available for this track.');

      const newHowl = new Howl({
        src: [source],
        html5: true,
        volume: get().volume,
        format: ['mp3', 'webm', 'm4a'],
        onplay: () => set({ isPlaying: true }),
        onpause: () => set({ isPlaying: false }),
        onend: () => {
          const { repeatMode, next } = get();
          if (repeatMode === 'one') {
            get().play();
          } else {
            next();
          }
        },
        onload: () => {
          const duration = newHowl.duration();
          set({ duration, isLoading: false });
        },
        onloaderror: (_id, error) => {
          console.error('Error loading audio:', error);
          set({ isLoading: false, error: 'Unable to load this audio file or stream.' });
        },
        onplayerror: (_id, error) => {
          console.error('Error playing audio:', error);
          set({ isLoading: false, error: 'Playback was blocked or the audio source is no longer available.' });
        }
      });

      set({ howl: newHowl });
      newHowl.play();
    } catch (error: any) {
      console.error('Failed to load track:', error);
      set({ isLoading: false, error: error.message || 'Failed to load track' });
    }
  },

  play: () => {
    const { howl, currentTrack } = get();
    if (howl && currentTrack) {
      howl.play();
    }
  },

  pause: () => {
    const { howl } = get();
    if (howl) {
      howl.pause();
    }
  },

  next: () => {
    const { queue, currentIndex, isShuffle } = get();
    let nextIndex;

    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    if (queue.length > 0) {
      set({ currentIndex: nextIndex });
      get().setCurrentTrack(queue[nextIndex]);
    }
  },

  previous: () => {
    const { queue, currentIndex } = get();
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;

    if (queue.length > 0) {
      set({ currentIndex: prevIndex });
      get().setCurrentTrack(queue[prevIndex]);
    }
  },

  setVolume: (volume) => {
    const { howl } = get();
    set({ volume });
    if (howl) {
      howl.volume(volume);
    }
  },

  setProgress: (progress) => {
    const { howl, duration } = get();
    set({ progress });
    if (howl && duration > 0) {
      howl.seek((progress / 100) * duration);
    }
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  setRepeatMode: (mode) => {
    set({ repeatMode: mode });
  },

  setQueue: (tracks) => {
    set({ queue: tracks, currentIndex: 0 });
  },

  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index) => {
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index)
    }));
  },

  reorderQueue: (fromIndex, toIndex) => {
    set((state) => {
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= state.queue.length || toIndex >= state.queue.length) return state;
      const queue = [...state.queue];
      const [movedTrack] = queue.splice(fromIndex, 1);
      queue.splice(toIndex, 0, movedTrack);
      const currentTrackIndex = queue.findIndex((track) => track.id === state.currentTrack?.id);
      return { queue, currentIndex: Math.max(currentTrackIndex, 0) };
    });
  },

  clearQueue: () => {
    set({ queue: [], currentIndex: 0 });
  },

  clearHistory: () => {
    set({ history: [] });
  }
}), {
  name: 'nuclear-player',
  partialize: (state) => ({
    volume: state.volume,
    isShuffle: state.isShuffle,
    repeatMode: state.repeatMode,
    queue: state.queue,
    currentIndex: state.currentIndex,
    history: state.history
  })
}));
