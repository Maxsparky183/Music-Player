import { useEffect, useState } from 'react';
import { usePlayerStore } from './store/usePlayerStore';
import { Sidebar } from './components/Sidebar';
import { PlayerControls } from './components/PlayerControls';
import { SearchPage } from './pages/SearchPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { LocalFilesPage } from './pages/LocalFilesPage';
import { LyricsPage } from './pages/LyricsPage';
import { LibraryPage } from './pages/LibraryPage';
import { usePreferencesStore } from './store/usePreferencesStore';

function App() {
  const [currentPage, setCurrentPage] = useState('search');
  const theme = usePreferencesStore((state) => state.theme);
  const { isPlaying, play, pause, next, previous, setProgress, progress } = usePlayerStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setCurrentPage('search'); window.dispatchEvent(new Event('app:focus-search')); return; }
      if (event.code === 'Space') { event.preventDefault(); isPlaying ? pause() : play(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); event.shiftKey ? next() : setProgress(Math.min(progress + 5, 100)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); event.shiftKey ? previous() : setProgress(Math.max(progress - 5, 0)); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, next, pause, play, previous, progress, setProgress]);

  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'playlists':
        return <PlaylistsPage />;
      case 'local':
        return <LocalFilesPage />;
      case 'lyrics':
        return <LyricsPage />;
      case 'library':
        return <LibraryPage />;
      default:
        return <SearchPage />;
    }
  };

  return (
    <div className="flex h-screen bg-background" data-theme={theme}>
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto pb-24">
        {renderPage()}
      </main>
      <PlayerControls />
    </div>
  );
}

export default App;
