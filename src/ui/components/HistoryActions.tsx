import { useStore } from '../../store/useStore';
import { useHistoryStore } from '../../store/historyStore';
import { Undo, Redo, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HistoryActions() {
  const canvas = useStore((state) => state.canvas);
  const canUndo = useHistoryStore((state) => state.canUndo());
  const canRedo = useHistoryStore((state) => state.canRedo());
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const handleUndo = () => {
    if (!canvas) return;
    undo(canvas);
  };

  const handleRedo = () => {
    if (!canvas) return;
    redo(canvas);
  };

  const handleClearHistory = () => {
    clearHistory();
    alert('History cleared');
  };

  // Automatically save history on canvas changes
  useEffect(() => {
    if (!canvas) return;

    const saveHistory = () => {
      const state = canvas.toJSON();
      useHistoryStore.getState().saveState(state);
    };

    let timeoutId: NodeJS.Timeout;

    // Debounced save on object changes
    const handleObjectModified = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveHistory, 500);
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
      clearTimeout(timeoutId);
    };
  }, [canvas]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;

      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        History
      </h3>

      <div className="flex gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          <Undo size={18} />
          Undo
          <span className="text-xs text-gray-400">Ctrl+Z</span>
        </button>

        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          <Redo size={18} />
          Redo
          <span className="text-xs text-gray-400">Ctrl+Y</span>
        </button>
      </div>

      <button
        onClick={handleClearHistory}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
      >
        <RotateCcw size={18} />
        Clear History
      </button>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 History is automatically saved when you add, move, or delete objects.
          Up to 50 states are stored.
        </p>
      </div>
    </div>
  );
}
