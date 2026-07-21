import axios, { AxiosError } from 'axios';
import { Track, SearchResult } from '../types';

// Python Backend API
const BACKEND_API = 'http://localhost:8000';

const backendErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError && !error.response) {
    return 'Music service is unavailable. Start the backend and try again.';
  }

  return 'The music service could not complete that request. Please try again.';
};

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
      throw new Error(backendErrorMessage(error));
    }
  }

  // Get audio stream URL from backend
  static async getAudioStream(videoId: string): Promise<any> {
    console.log('Requesting audio for video_id:', videoId);
    try {
      const response = await axios.post(`${BACKEND_API}/api/audio`, {
        video_id: videoId,
        quality: 'best'
      }, { timeout: 30000 });

      console.log('Audio extraction response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Audio extraction error:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 403) {
        throw new Error('Age-restricted or geo-blocked content');
      } else if (error.response?.status === 404) {
        throw new Error('Video not found or no audio available');
      } else if (!error.response) {
        throw new Error('Music service is unavailable. Start the backend and try again.');
      } else {
        throw new Error('Unable to prepare this track for playback. Please try another track.');
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
      throw new Error(backendErrorMessage(error));
    }
  }

  // YouTube Music is the only enabled search provider at present.
  static async searchAll(query: string): Promise<SearchResult[]> {
    const youtube = await this.searchYouTube(query);
    return [{ source: 'youtube', tracks: youtube }];
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
      const response = await axios.get(`https://api.lyrics.ovh/v1/${track.artist}/${track.title}`);
      
      return response.data.lyrics || 'Lyrics not found';
    } catch (error) {
      console.error('Lyrics error:', error);
      throw new Error('Lyrics are unavailable for this track.');
    }
  }

}
