from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import ytmusicapi
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize YouTube Music API
ytmusic = None

def init_ytmusic():
    global ytmusic
    try:
        try:
            ytmusic = ytmusicapi.YTMusic("oauth.json")
            logger.info("YouTube Music API initialized with OAuth")
        except:
            ytmusic = ytmusicapi.YTMusic()
            logger.info("YouTube Music API initialized without OAuth")
    except Exception as e:
        logger.error(f"Failed to initialize YouTube Music API: {e}")

# Initialize on startup
init_ytmusic()

@app.route('/')
def root():
    return jsonify({"status": "ok", "service": "Nuclear Music Player Backend"})

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "ytmusic": ytmusic is not None,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/search', methods=['POST'])
def search_tracks():
    """Search for tracks using YouTube Music API"""
    if not ytmusic:
        return jsonify({"error": "YouTube Music API not initialized"}), 503
    
    try:
        data = request.get_json()
        query = data.get('query', '')
        limit = data.get('limit', 20)
        
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
        
        return jsonify(tracks)
    except Exception as e:
        logger.error(f"Search error: {e}")
        return jsonify({"error": f"Search failed: {str(e)}"}), 500

@app.route('/api/audio', methods=['POST'])
def get_audio_stream():
    """Extract audio stream URL using yt-dlp"""
    try:
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({"error": "No data received"}), 400
            
        video_id = data.get('video_id', '')
        if not video_id:
            logger.error("No video_id provided")
            return jsonify({"error": "No video_id provided"}), 400
        
        logger.info(f"Extracting audio for video_id: {video_id}")
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'quiet': False,
            'no_warnings': False,
            'extract_flat': False,
            'ignoreerrors': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            logger.info(f"Starting extraction for: https://www.youtube.com/watch?v={video_id}")
            info = ydl.extract_info(
                f"https://www.youtube.com/watch?v={video_id}",
                download=False
            )
            
            logger.info(f"Extraction result: {info is not None}")
            
            if not info:
                logger.error("Video not found")
                return jsonify({"error": "Video not found"}), 404
            
            # Find the best audio format
            formats = info.get('formats', [])
            logger.info(f"Total formats: {len(formats)}")
            
            audio_formats = [f for f in formats if f.get('acodec') != 'none']
            logger.info(f"Audio formats: {len(audio_formats)}")
            
            if not audio_formats:
                logger.error("No audio formats available")
                return jsonify({"error": "No audio formats available"}), 404
            
            # Filter out formats with None abr and sort by quality (bitrate)
            audio_formats = [f for f in audio_formats if f.get('abr') is not None]
            if not audio_formats:
                logger.error("No audio formats with valid bitrate")
                return jsonify({"error": "No audio formats with valid bitrate"}), 404
            
            audio_formats.sort(key=lambda x: x.get('abr', 0), reverse=True)
            best_format = audio_formats[0]
            
            logger.info(f"Best format: {best_format.get('format')}, URL: {best_format.get('url')[:50] if best_format.get('url') else 'None'}...")
            
            return jsonify({
                "video_id": video_id,
                "title": info.get('title'),
                "artist": info.get('artist'),
                "duration": info.get('duration'),
                "thumbnail": info.get('thumbnail'),
                "audio_url": best_format['url'],
                "format": best_format.get('format'),
                "abr": best_format.get('abr'),
                "ext": best_format.get('ext')
            })
            
    except yt_dlp.utils.DownloadError as e:
        logger.error(f"Download error: {e}")
        if "age" in str(e).lower() or "sign in" in str(e).lower():
            return jsonify({"error": "Age-restricted or requires sign-in"}), 403
        elif "geo" in str(e).lower():
            return jsonify({"error": "Geo-blocked content"}), 403
        else:
            return jsonify({"error": f"Extraction failed: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Audio extraction error: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({"error": f"Audio extraction failed: {str(e)}"}), 500

@app.route('/api/trending')
def get_trending():
    """Get trending tracks from YouTube Music"""
    if not ytmusic:
        logger.warning("YouTube Music API not initialized, returning empty trending")
        return jsonify([])
    
    try:
        logger.info("Fetching trending tracks")
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
        
        logger.info(f"Found {len(tracks)} trending tracks")
        return jsonify(tracks)
    except Exception as e:
        logger.error(f"Trending error: {e}")
        import traceback
        logger.error(traceback.format_exc())
        # Return empty array instead of error to allow app to continue
        return jsonify([])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
