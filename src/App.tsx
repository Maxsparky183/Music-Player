import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PlayerControls } from './components/PlayerControls';
import { SearchPage } from './pages/SearchPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { LocalFilesPage } from './pages/LocalFilesPage';
import { LyricsPage } from './pages/LyricsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('search');

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
      default:
        return <SearchPage />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto pb-24">
        {renderPage()}
      </main>
      <PlayerControls />
    </div>
  );
}

export default App;
