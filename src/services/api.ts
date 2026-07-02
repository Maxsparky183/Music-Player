import axios from 'axios';
import { Track, SearchResult } from '../types';

// Python Backend API
const BACKEND_API = 'http://localhost:8000';

export class MusicAPI {
  // Search tracks using Python backend
  static async searchYouTube(query: string): Promise<Track[]> {
    try {
      const response = await axios.post(`${BACKEND_API}/api/search`, {
        query,
        limit: 20
      }, { timeout: 15000 });

      return response.data.map((item: any) => ({
        id: item.video_id,
        title: item.title,
        artist: item.artist,
        thumbnail: item.thumbnail,
        source: 'youtube' as const,
        url: item.url,
        duration: item.duration,
        album: item.album
      }));
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  // Get audio stream URL from backend
  static async getAudioStream(videoId: string): Promise<any> {
    try {
      const response = await axios.post(`${BACKEND_API}/api/audio`, {
        video_id: videoId,
        quality: 'best'
      }, { timeout: 30000 });

      return response.data;
    } catch (error: any) {
      console.error('Audio extraction error:', error);
      if (error.response?.status === 403) {
        throw new Error('Age-restricted or geo-blocked content');
      } else if (error.response?.status === 404) {
        throw new Error('Video not found or no audio available');
      } else {
        throw new Error('Failed to extract audio stream');
      }
    }
  }

  // Get trending tracks
  static async getTrending(): Promise<Track[]> {
    try {
      const response = await axios.get(`${BACKEND_API}/api/trending`, { timeout: 15000 });

      return response.data.map((item: any) => ({
        id: item.video_id,
        title: item.title,
        artist: item.artist,
        thumbnail: item.thumbnail,
        source: 'youtube' as const,
        url: item.url,
        duration: item.duration,
        album: item.album
      }));
    } catch (error) {
      console.error('Trending error:', error);
      return [];
    }
  }

  // Search SoundCloud (disabled - would need separate backend service)
  static async searchSoundCloud(query: string): Promise<Track[]> {
    return [];
  }

  // Search Bandcamp (disabled - would need separate backend service)
  static async searchBandcamp(query: string): Promise<Track[]> {
    return [];
  }

  // Aggregated search
  static async searchAll(query: string): Promise<SearchResult[]> {
    const youtube = await this.searchYouTube(query);
    const soundcloud = await this.searchSoundCloud(query);
    const bandcamp = await this.searchBandcamp(query);

    return [
      { source: 'youtube', tracks: youtube },
      { source: 'soundcloud', tracks: soundcloud },
      { source: 'bandcamp', tracks: bandcamp }
    ];
  }

  // Get music by genre (uses search with genre query)
  static async getByGenre(genre: string): Promise<Track[]> {
    return this.searchYouTube(`${genre} music`);
  }
}

// Lyrics API (using various free lyrics APIs)
export class LyricsAPI {
  static async getLyrics(track: Track): Promise<string> {
    try {
      // Using a free lyrics API - in production, use a proper lyrics API
      const query = encodeURIComponent(`${track.title} ${track.artist}`);
      const response = await axios.get(`https://api.lyrics.ovh/v1/${track.artist}/${track.title}`);
      
      return response.data.lyrics || 'Lyrics not found';
    } catch (error) {
      console.error('Lyrics error:', error);
      return 'Lyrics not available';
    }
  }

  static async getSyncedLyrics(track: Track): Promise<any[]> {
    try {
      // Placeholder for synced lyrics - would need a different API
      const lyrics = await this.getLyrics(track);
      return [];
    } catch (error) {
      console.error('Synced lyrics error:', error);
      return [];
    }
  }
}
