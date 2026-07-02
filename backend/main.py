from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import yt_dlp
import ytmusicapi
import asyncio
import logging
from typing import Optional, List, Dict
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Nuclear Music Player Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize YouTube Music API
ytmusic = None

@app.on_event("startup")
async def startup_event():
    global ytmusic
    try:
        # Try to load existing auth file, otherwise use unauthenticated
        try:
            ytmusic = ytmusicapi.YTMusic("oauth.json")
            logger.info("YouTube Music API initialized with OAuth")
        except:
            ytmusic = ytmusicapi.YTMusic()
            logger.info("YouTube Music API initialized without OAuth")
    except Exception as e:
        logger.error(f"Failed to initialize YouTube Music API: {e}")
        ytmusic = None

@app.get("/")
async def root():
    return {"status": "ok", "service": "Nuclear Music Player Backend"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "ytmusic": ytmusic is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/search")
async def search_tracks(request: dict) -> List[dict]:
    """Search for tracks using YouTube Music API"""
    if not ytmusic:
        raise HTTPException(status_code=503, detail="YouTube Music API not initialized")
    
    try:
        query = request.get('query', '')
        limit = request.get('limit', 20)
        results = ytmusic.search(query, limit=limit, filter="songs")
        
        tracks = []
        for item in results:
            if item.get('resultType') == 'song':
                track = {
                    'video_id': item['videoId'],
                    'title': item['title'],
                    'artist': item['artists'][0]['name'] if item.get('artists') else 'Unknown',
                    'album': item.get('album', {}).get('name') if item.get('album') else None,
                    'duration': item.get('duration_seconds', 0),
                    'thumbnail': item.get('thumbnails', [{}])[0].get('url', ''),
                    'url': f"https://www.youtube.com/watch?v={item['videoId']}"
                }
                tracks.append(track)
        
        return tracks
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.post("/api/audio")
async def get_audio_stream(request: dict):
    """Extract audio stream URL using yt-dlp"""
    try:
        video_id = request.get('video_id', '')
        quality = request.get('quality', 'best')
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
            'cookiefile': 'cookies.txt' if exists('cookies.txt') else None,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}",
                download=False
            )
            
            if not info:
                raise HTTPException(status_code=404, detail="Video not found")
            
            # Find the best audio format
            formats = info.get('formats', [])
            audio_formats = [f for f in formats if f.get('acodec') != 'none']
            
            if not audio_formats:
                raise HTTPException(status_code=404, detail="No audio formats available")
            
            # Sort by quality (bitrate)
            audio_formats.sort(key=lambda x: x.get('abr', 0), reverse=True)
            best_format = audio_formats[0]
            
            return {
                "video_id": request.video_id,
                "title": info.get('title'),
                "artist": info.get('artist'),
                "duration": info.get('duration'),
                "thumbnail": info.get('thumbnail'),
                "audio_url": best_format['url'],
                "format": best_format.get('format'),
                "abr": best_format.get('abr'),
                "ext": best_format.get('ext')
            }
            
    except yt_dlp.utils.DownloadError as e:
        logger.error(f"Download error: {e}")
        if "age" in str(e).lower() or "sign in" in str(e).lower():
            raise HTTPException(status_code=403, detail="Age-restricted or requires sign-in")
        elif "geo" in str(e).lower():
            raise HTTPException(status_code=403, detail="Geo-blocked content")
        else:
            raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
    except Exception as e:
        logger.error(f"Audio extraction error: {e}")
        raise HTTPException(status_code=500, detail=f"Audio extraction failed: {str(e)}")

@app.get("/api/trending")
async def get_trending() -> List[dict]:
    """Get trending tracks from YouTube Music"""
    if not ytmusic:
        raise HTTPException(status_code=503, detail="YouTube Music API not initialized")
    
    try:
        results = ytmusic.get_trending(limit=20)
        
        tracks = []
        for item in results:
            if item.get('resultType') == 'song':
                track = {
                    'video_id': item['videoId'],
                    'title': item['title'],
                    'artist': item['artists'][0]['name'] if item.get('artists') else 'Unknown',
                    'album': item.get('album', {}).get('name') if item.get('album') else None,
                    'duration': item.get('duration_seconds', 0),
                    'thumbnail': item.get('thumbnails', [{}])[0].get('url', ''),
                    'url': f"https://www.youtube.com/watch?v={item['videoId']}"
                }
                tracks.append(track)
        
        return tracks
    except Exception as e:
        logger.error(f"Trending error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get trending: {str(e)}")

def exists(path):
    try:
        from os.path import exists
        return exists(path)
    except:
        return False

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
