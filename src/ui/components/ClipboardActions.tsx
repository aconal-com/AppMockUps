import { useStore } from '../../store/useStore';
import { Copy, ClipboardCheck, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ClipboardActions() {
  const canvas = useStore((state) => state.canvas);
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const updateSelection = () => {
      const activeObj = canvas.getActiveObject();
      setHasSelection(!!activeObj);
    };

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => setHasSelection(false));

    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  const handleCopy = () => {
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
      alert('No object selected');
      return;
    }

    // Clone object to clipboard
    activeObj.clone((cloned: any) => {
      cloned.set({
        left: activeObj.left + 20,
        top: activeObj.top + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const handleDelete = () => {
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (!activeObj) {
      alert('No object selected');
      return;
    }

    canvas.remove(activeObj);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleDeleteAll = () => {
    if (!canvas) return;

    if (confirm('Are you sure you want to delete all objects?')) {
      canvas.clear();
      canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;

      // Ctrl/Cmd + C = Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      }

      // Ctrl/Cmd + V = Paste (handled by browser for clipboard, but we add duplicate)
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        handleCopy();
      }

      // Delete/Backspace = Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Actions
      </h3>

      <div className="space-y-2">
        <button
          onClick={handleCopy}
          disabled={!hasSelection}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          <Copy size={18} />
          Duplicate
          <span className="ml-auto text-xs text-gray-400">
            Ctrl+D
          </span>
        </button>

        <button
          onClick={handleDelete}
          disabled={!hasSelection}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm text-gray-700 hover:text-red-600"
        >
          <Trash2 size={18} />
          Delete Selected
          <span className="ml-auto text-xs text-gray-400">
            Del
          </span>
        </button>

        <button
          onClick={handleDeleteAll}
          className="w-full flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm text-red-600"
        >
          <Trash2 size={18} />
          Clear All
        </button>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs font-medium text-gray-700 mb-2">Keyboard Shortcuts</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Duplicate</span>
            <span className="font-mono">Ctrl+C / Ctrl+V</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Delete</span>
            <span className="font-mono">Delete / Backspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
