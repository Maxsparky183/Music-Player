# Nuclear Music Player

A cross-platform desktop music streaming application with a modern, dark-mode, ad-free interface. No user accounts or subscriptions required.

## Features

- **Aggregated Search Engine**: Search across YouTube, SoundCloud, and Bandcamp simultaneously
- **Media Player Controls**: Full playback controls (play, pause, skip, shuffle, repeat) with volume slider
- **Smart Playlists**: Create, save, and export local playlists
- **Lyrics Integration**: Automatic lyrics fetching and display
- **Music Discovery**: Discover trending music and browse by genre
- **Local File Support**: Scan and play local MP3/FLAC files
- **Privacy-First**: No tracking, telemetry, or account authentication

## Tech Stack

- **Electron**: Cross-platform desktop framework
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Zustand**: State management
- **Howler.js**: Audio playback
- **Lucide React**: Icons

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Platform-Specific Builds

- Windows: `npm run build:win`
- macOS: `npm run build:mac`
- Linux: `npm run build:linux`

## Privacy Policy

This application:
- Does not collect or store any user data
- Does not require user accounts or authentication
- Does not include any tracking or telemetry
- Uses privacy-focused API instances (Invidious for YouTube)
- All data is stored locally on your device

## Usage

### Search
Use the search bar to find music across multiple platforms. Results are aggregated from YouTube, SoundCloud, and Bandcamp.

### Playlists
- Create new playlists from the Playlists page
- Add tracks from search results
- Export playlists as JSON files
- Import existing playlists

### Local Files
- Click "Select Music Folder" to scan your local library
- Supports MP3, FLAC, WAV, M4A, OGG, and AAC formats

### Lyrics
- Lyrics are automatically fetched when playing a song
- View lyrics in the dedicated Lyrics page

## License

MIT License - Feel free to use and modify as needed.
