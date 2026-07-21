export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  thumbnail?: string;
  source: 'youtube' | 'soundcloud' | 'bandcamp' | 'local';
  url?: string;
  path?: string;
  streamUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lyrics {
  text: string;
  synced?: boolean;
  lines?: {
    time: number;
    text: string;
  }[];
}

export interface SearchResult {
  source: 'youtube';
  tracks: Track[];
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'all' | 'one';
  queue: Track[];
  currentIndex: number;
}
