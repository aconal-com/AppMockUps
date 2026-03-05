import { useStore } from '../../store/useStore';

export default function Header() {
  const isExporting = useStore((state) => state.isExporting);
  const setIsExporting = useStore((state) => state.setIsExporting);

  const handleExport = async () => {
    setIsExporting(true);
    // TODO: Implement export logic
    setTimeout(() => {
      setIsExporting(false);
      alert('Export functionality will be implemented');
    }, 1000);
  };

  const handleBatchExport = async () => {
    setIsExporting(true);
    // TODO: Implement batch export logic
    setTimeout(() => {
      setIsExporting(false);
      alert('Batch export functionality will be implemented');
    }, 2000);
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
          disabled={isExporting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {isExporting ? 'Exporting...' : 'Export PNG'}
        </button>

        <button
          onClick={handleBatchExport}
          disabled={isExporting}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          {isExporting ? 'Processing...' : 'Export All (ZIP)'}
        </button>
      </div>
    </header>
  );
}
