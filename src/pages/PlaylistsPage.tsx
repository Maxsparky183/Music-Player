import React, { useState } from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { usePlayerStore } from '../store/usePlayerStore';
import { TrackCard } from '../components/TrackCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, Trash2, Download, Upload } from 'lucide-react';
import { Track } from '../types';

export const PlaylistsPage: React.FC = () => {
  const { playlists, currentPlaylist, createPlaylist, deletePlaylist, removeFromPlaylist, setCurrentPlaylist, exportPlaylist, importPlaylist } = usePlaylistStore();
  const { setCurrentTrack, setQueue } = usePlayerStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    if (currentPlaylist) {
      setQueue(currentPlaylist.tracks);
    }
  };

  const handleExport = () => {
    if (currentPlaylist) {
      const data = exportPlaylist(currentPlaylist.id);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentPlaylist.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importPlaylist(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Playlists</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => document.getElementById('import-input')?.click()}>
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <input
            id="import-input"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            <Plus size={16} className="mr-2" />
            New Playlist
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-surfaceHighlight rounded-lg">
          <div className="flex gap-2">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
            />
            <Button onClick={handleCreatePlaylist}>Create</Button>
            <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!currentPlaylist ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="p-4 bg-surfaceHighlight rounded-lg hover:bg-surfaceHighlight/80 transition-colors cursor-pointer"
              onClick={() => setCurrentPlaylist(playlist)}
            >
              <h3 className="font-semibold text-lg mb-2">{playlist.name}</h3>
              <p className="text-sm text-textSecondary">{playlist.tracks.length} tracks</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(playlist.id);
                }}
                className="mt-2 text-accent hover:text-accent/80 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
          {playlists.length === 0 && (
            <div className="col-span-full text-center py-12 text-textSecondary">
              <p>No playlists yet. Create your first playlist!</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => setCurrentPlaylist(null)}
                className="text-textSecondary hover:text-text mb-2"
              >
                ← Back to playlists
              </button>
              <h2 className="text-2xl font-bold">{currentPlaylist.name}</h2>
              <p className="text-textSecondary">{currentPlaylist.tracks.length} tracks</p>
            </div>
            <Button variant="secondary" onClick={handleExport}>
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-2">
            {currentPlaylist.tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <TrackCard
                    track={track}
                    onPlay={handlePlayTrack}
                  />
                </div>
                <Button
                  variant="icon"
                  onClick={() => removeFromPlaylist(currentPlaylist!.id, track.id)}
                >
                  <Trash2 size={16} className="text-accent" />
                </Button>
              </div>
            ))}
            {currentPlaylist.tracks.length === 0 && (
              <div className="text-center py-12 text-textSecondary">
                <p>This playlist is empty. Add tracks from search or discover.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
