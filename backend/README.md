# Nuclear Music Player - Python Backend

This backend provides YouTube audio extraction and search capabilities for the Nuclear Music Player.

## Features

- **YouTube Search**: Uses ytmusicapi for reliable track search
- **Audio Extraction**: Uses yt-dlp for extracting raw audio streams
- **Trending**: Get trending tracks from YouTube Music
- **Error Handling**: Handles age-restricted content, geo-blocks, and API failures
- **Rate Limiting**: Built-in rate limiting to avoid YouTube's anti-bot measures

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Set up YouTube Music OAuth for better search results:
```bash
python -c "import ytmusicapi; ytmusicapi.setup_oauth()"
```
This will create an `oauth.json` file.

4. (Optional) Set up cookies for yt-dlp to handle age-restricted content:
```bash
# Export cookies from your browser using the browser extension
# Save as cookies.txt in the backend directory
```

## Running the Server

Development mode:
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### GET /
Health check endpoint

### GET /health
Detailed health check with service status

### POST /api/search
Search for tracks
- Body: `{"query": "song name", "limit": 20}`
- Returns: List of tracks with metadata

### POST /api/audio
Extract audio stream URL
- Body: `{"video_id": "youtube_video_id", "quality": "best"}`
- Returns: Audio stream URL and metadata

### GET /api/trending
Get trending tracks
- Returns: List of trending tracks

## Handling YouTube's Anti-Bot Measures

1. **Rate Limiting**: The backend includes rate limiting to avoid triggering YouTube's detection
2. **Cookies**: Use browser cookies for handling age-restricted content
3. **OAuth**: YouTube Music OAuth provides better search results and fewer restrictions
4. **Fallback**: If extraction fails, the frontend should handle the error gracefully

## Error Handling

The backend returns appropriate HTTP status codes:
- 403: Age-restricted, geo-blocked, or requires sign-in
- 404: Video not found or no audio formats available
- 500: Extraction or search failure
- 503: Service not initialized

## Maintenance

YouTube frequently updates their algorithms. To keep the extraction working:

1. Update yt-dlp regularly: `pip install --upgrade yt-dlp`
2. Update ytmusicapi: `pip install --upgrade ytmusicapi`
3. Monitor the GitHub repositories for updates and issues
4. Keep cookies fresh when using age-restricted content

## Privacy

This backend:
- Does not store any user data
- Does not track usage
- All requests are processed in real-time
- No telemetry or analytics
