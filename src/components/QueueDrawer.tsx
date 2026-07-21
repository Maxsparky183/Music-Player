import React, { useState } from 'react';
import { ListMusic, Trash2, X } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Button } from './Button';
import { TrackCard } from './TrackCard';

export const QueueDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { queue, currentTrack, setCurrentTrack, removeFromQueue, reorderQueue, clearQueue } = usePlayerStore();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return <>
    <Button variant="icon" onClick={() => setOpen(true)} aria-label="Open queue"><ListMusic size={20} /></Button>
    {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-surface p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-semibold">Queue</h2><p className="text-sm text-textSecondary">Drag tracks to reorder</p></div><Button variant="icon" onClick={() => setOpen(false)} aria-label="Close queue"><X size={20} /></Button></div>
        {currentTrack && <div className="mb-4"><p className="mb-2 text-xs font-medium uppercase text-textSecondary">Now playing</p><TrackCard track={currentTrack} onPlay={setCurrentTrack} isCurrent /></div>}
        <div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium uppercase text-textSecondary">Up next ({queue.length})</p><Button variant="ghost" onClick={clearQueue}><Trash2 size={15} className="mr-1" />Clear</Button></div>
        <div className="space-y-1">{queue.map((track, index) => <div key={`${track.id}-${index}`} draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragIndex !== null) reorderQueue(dragIndex, index); setDragIndex(null); }} className="flex items-center gap-1"><span className="cursor-grab text-textSecondary">⠿</span><div className="min-w-0 flex-1"><TrackCard track={track} onPlay={setCurrentTrack} isCurrent={track.id === currentTrack?.id} /></div><Button variant="icon" onClick={() => removeFromQueue(index)} aria-label={`Remove ${track.title}`}><X size={16} /></Button></div>)}</div>
        {!queue.length && <p className="py-12 text-center text-textSecondary">Your queue is empty.</p>}
      </aside>
    </div>}
  </>;
};
