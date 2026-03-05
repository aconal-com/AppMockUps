import { useStore } from '../../store/useStore';
import exportEngine from '../../engines/exportEngine';

export default function Header() {
  const canvas = useStore((state) => state.canvas);
  const project = useStore((state) => state.project);
  const isExporting = useStore((state) => state.isExporting);
  const selectedDevice = useStore((state) => state.selectedDevice);
  const setIsExporting = useStore((state) => state.setIsExporting);

  const handleExport = async () => {
    if (!canvas) {
      alert('Canvas not initialized');
      return;
    }

    setIsExporting(true);

    try {
      await exportEngine.downloadPNG(
        canvas,
        `screenshot_${selectedDevice}_${Date.now()}.png`,
        selectedDevice as any
      );
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export screenshot');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBatchExport = async () => {
    if (!project || project.slides.length === 0) {
      alert('No slides to export');
      return;
    }

    setIsExporting(true);

    try {
      // Export all slides
      const canvases: any[] = [];
      for (let i = 0; i < project.slides.length; i++) {
        canvases.push(canvas);
      }

      await exportEngine.downloadBatch(
        canvases,
        `screenshots_${Date.now()}.zip`,
        selectedDevice as any
      );
    } catch (error) {
      console.error('Batch export error:', error);
      alert('Failed to export screenshots');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">AppMockUps</h1>
        <span className="text-sm text-gray-500">Professional App Store Screenshots</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting || !canvas}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {isExporting ? 'Exporting...' : 'Export PNG'}
        </button>

        <button
          onClick={handleBatchExport}
          disabled={isExporting || !project}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {isExporting ? 'Processing...' : 'Export All (ZIP)'}
        </button>
      </div>
    </header>
  );
}
