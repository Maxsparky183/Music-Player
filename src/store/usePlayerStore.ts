import { create } from 'zustand';
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
  clearQueue: () => void;
  howl: Howl | null;
  isLoading: boolean;
  error: string | null;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
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

  setCurrentTrack: async (track) => {
    const { howl } = get();
    if (howl) {
      howl.unload();
    }

    set({ currentTrack: track, isLoading: true, error: null, progress: 0 });

    try {
      // Get audio stream URL from Python backend
      const audioData = await MusicAPI.getAudioStream(track.id);
      
      if (!audioData.audio_url) {
        throw new Error('No audio URL available');
      }

      const newHowl = new Howl({
        src: [audioData.audio_url],
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
        onloaderror: (id, error) => {
          console.error('Error loading audio:', error);
          set({ isLoading: false, error: 'Failed to load audio' });
        },
        onplayerror: (id, error) => {
          console.error('Error playing audio:', error);
          set({ isLoading: false, error: 'Failed to play audio' });
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
    const { queue, currentIndex, isShuffle, repeatMode } = get();
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

  clearQueue: () => {
    set({ queue: [], currentIndex: 0 });
  }
}));
