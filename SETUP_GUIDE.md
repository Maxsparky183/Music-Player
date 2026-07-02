# Nuclear Music Player - Complete Setup Guide

This guide covers setting up the Python + React music player with YouTube audio extraction using yt-dlp.

## Architecture Overview

**Backend (Python):**
- FastAPI for REST API endpoints
- ytmusicapi for YouTube search and metadata
- yt-dlp for audio stream extraction
- Handles YouTube's anti-bot measures with rate limiting and error handling

**Frontend (React):**
- React + TypeScript with Vite
- Zustand for state management
- Howler.js for audio playback
- Tailwind CSS for styling
- Electron for desktop packaging

## Step 1: Backend Setup

### 1.1 Install Python Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 1.2 Optional: YouTube Music OAuth Setup

For better search results and fewer restrictions:

```bash
python -c "import ytmusicapi; ytmusicapi.setup_oauth()"
```

Follow the browser authentication flow. This creates `oauth.json` in the backend directory.

### 1.3 Optional: Browser Cookies for Age-Restricted Content

To play age-restricted videos:

1. Install the "Get cookies.txt" browser extension
2. Go to YouTube.com and log in
3. Export cookies and save as `backend/cookies.txt`

### 1.4 Start the Backend Server

```bash
cd backend
python main.py
```

The server will run on `http://localhost:8000`

Test it:
```bash
curl http://localhost:8000/health
```

## Step 2: Frontend Setup

### 2.1 Install Node Dependencies

```bash
npm install
```

### 2.2 Start the Frontend Development Server

```bash
npm run dev
```

This starts both Vite (frontend) and the Python backend concurrently.

The frontend will be available at `http://localhost:5173`

## Step 3: Full Desktop App (Electron)

For the full desktop experience:

```bash
npm run dev:all
```

This starts:
- Vite development server
- Python backend
- Electron desktop window

## API Endpoints

### POST /api/search
Search for tracks
```json
{
  "query": "song name",
  "limit": 20
}
```

### POST /api/audio
Extract audio stream URL
```json
{
  "video_id": "youtube_video_id",
  "quality": "best"
}
```

### GET /api/trending
Get trending tracks

## Search & Metadata Strategy

**Recommended Approach: ytmusicapi**

- **Pros**: No quota limits, unofficial but stable, provides rich metadata
- **Cons**: May break when YouTube updates (but library is actively maintained)

**Alternative: YouTube Data API v3**

- **Pros**: Official API, stable
- **Cons**: 10,000 daily quota limit, requires API key

**Implementation:**
```python
# Using ytmusicapi (recommended)
ytmusic = ytmusicapi.YTMusic()
results = ytmusic.search(query, limit=20, filter="songs")

# Using YouTube Data API (alternative)
youtube = build('youtube', 'v3', developerKey=API_KEY)
results = youtube.search().list(q=query, part='snippet', type='video').execute()
```

## Audio Extraction Strategy

**Recommended: yt-dlp**

- **Pros**: Most reliable, actively maintained, handles cipher/signature algorithms
- **Cons**: May require updates when YouTube changes

**Implementation:**
```python
import yt_dlp

ydl_opts = {
    'format': 'bestaudio/best',
    'quiet': True,
    'no_warnings': True,
    'cookiefile': 'cookies.txt'  # For age-restricted content
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    info = ydl.extract_info(video_url, download=False)
    audio_url = info['formats'][0]['url']
```

## Audio Playback Strategy

**Recommended: Howler.js**

- **Pros**: Cross-browser support, Web Audio API wrapper, easy to use
- **Cons**: May have issues with some audio formats

**Implementation:**
```javascript
const sound = new Howl({
  src: [audio_url],
  html5: true,
  format: ['mp3', 'webm', 'm4a']
});
sound.play();
```

## Handling YouTube's Anti-Bot Measures

### 1. Rate Limiting

The backend includes rate limiting to avoid detection:
```python
# In backend/.env
MAX_REQUESTS_PER_MINUTE=30
RATE_LIMIT_WINDOW=60
```

### 2. Cookies

Use browser cookies for age-restricted content:
- Export cookies from your browser
- Save as `backend/cookies.txt`
- yt-dlp will use these cookies automatically

### 3. OAuth

YouTube Music OAuth provides better access:
- Reduces restrictions
- Better search results
- Fewer 403 errors

### 4. User-Agent Rotation

Add random user-agent headers to avoid detection:
```python
import random

user_agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
]

ydl_opts = {
    'user_agent': random.choice(user_agents)
}
```

### 5. Proxy Rotation (Advanced)

For heavy usage, rotate through proxies:
```python
ydl_opts = {
    'proxy': 'http://user:pass@proxy:port'
}
```

## Error Handling & Fallbacks

### 1. Age-Restricted Content

```python
try:
    info = ydl.extract_info(video_url, download=False)
except yt_dlp.utils.DownloadError as e:
    if "age" in str(e).lower():
        return {"error": "Age-restricted - use cookies"}
```

### 2. Geo-Blocked Content

```python
if "geo" in str(e).lower():
    return {"error": "Geo-blocked in your region"}
```

### 3. Video Not Found`

```python
if not info or 'formats' not in info:
    return {"error": "Video not found or removed"}
```

### 4. No Audio Formats

```python
audio_formats = [f for f in info['formats'] if f.get('acodec') != 'none']
if not audio_formats:
    return {"error": "No audio formats available"}
```

### 5. Frontend Fallback

```javascript
try {
  const audioData = await MusicAPI.getAudioStream(videoId);
  // Play audio
} catch (error) {
  if (error.message.includes('age-restricted')) {
    // Show message: "This video requires authentication"
  } else if (error.message.includes('geo-blocked')) {
    // Show message: "Not available in your region"
  } else {
    // Show message: "Failed to load audio - try another track"
  }
}
```

## Maintenance

### Regular Updates

YouTube frequently updates their algorithms. Keep libraries updated:

```bash
# Update yt-dlp
pip install --upgrade yt-dlp

# Update ytmusicapi
pip install --upgrade ytmusicapi

# Update frontend dependencies
npm update
```

### Monitor for Issues

- Check yt-dlp GitHub: https://github.com/yt-dlp/yt-dlp
- Check ytmusicapi GitHub: https://github.com/sigma67/ytmusicapi
- Subscribe to issue trackers for breaking changes

### Cookie Refresh

Refresh cookies periodically (every 1-2 weeks):
1. Export fresh cookies from browser
2. Replace `backend/cookies.txt`

## Troubleshooting

### Backend won't start

- Check Python version (3.8+ required)
- Ensure all dependencies installed: `pip install -r requirements.txt`
- Check port 8000 is not in use

### Search returns no results

- Check backend is running: `curl http://localhost:8000/health`
- Check ytmusicapi is initialized
- Try with OAuth setup for better results

### Audio extraction fails

- Update yt-dlp: `pip install --upgrade yt-dlp`
- Add cookies for age-restricted content
- Check if video is geo-blocked
- Try a different video

### Frontend can't connect to backend

- Check backend is running on port 8000
- Check CORS is enabled in backend
- Check firewall settings

## Production Deployment

### Backend Deployment

1. Use a VPS (DigitalOcean, AWS, etc.)
2. Install Python and dependencies
3. Use Gunicorn for production:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```
4. Set up nginx reverse proxy
5. Use environment variables for configuration

### Frontend Deployment

1. Build the React app: `npm run build`
2. Serve static files with nginx
3. Configure API endpoint to production backend URL

### Desktop App Build

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Privacy & Legal Notes

- This tool is for personal/educational use
- Respect YouTube's Terms of Service
- Don't redistribute copyrighted content
- Consider supporting artists through official channels
- No tracking or user data collection

## Additional Features to Implement

1. **SoundCloud Integration**: Add SoundCloud API backend service
2. **Bandcamp Integration**: Implement web scraping for Bandcamp
3. **Local File Support**: Already implemented via Electron IPC
4. **Lyrics Sync**: Implement time-synced lyrics display
5. **Equalizer**: Add audio equalizer with Howler.js
6. **Playlists**: Already implemented with export/import
7. **Scrobbling**: Add Last.fm scrobbling support
8. **Visualizations**: Add audio visualizations with Web Audio API

## Support

For issues:
- Check the GitHub repositories of yt-dlp and ytmusicapi
- Review logs in backend console
- Check browser console for frontend errors
- Ensure all dependencies are up to date
