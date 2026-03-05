import { useStore } from '../../store/useStore';

export default function LayerPanel() {
  const canvas = useStore((state) => state.canvas);
  const selectedElement = useStore((state) => state.selectedElement);
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  if (!canvas) {
    return (
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
          Layers
        </h3>
        <p className="text-sm text-gray-500 mt-2">Canvas not initialized</p>
      </div>
    );
  }

  const objects = canvas.getObjects().slice().reverse(); // Reverse to show top layer first

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide mb-3">
        Layers
      </h3>

      {objects.length === 0 ? (
        <p className="text-sm text-gray-500">No elements on canvas</p>
      ) : (
        <div className="space-y-1">
          {objects.map((obj: any, index: number) => (
            <button
              key={obj.id || index}
              onClick={() => {
                canvas.setActiveObject(obj);
                canvas.renderAll();
                setSelectedElement(obj.id || `${index}`);
              }}
              className={`w-full text-left p-2 rounded border transition-all text-sm ${
                selectedElement === (obj.id || `${index}`)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-400">
                  {obj.type === 'text' ? '📝' : obj.type === 'image' ? '🖼️' : '📦'}
                </span>
                <span className="truncate text-gray-700">
                  {obj.type === 'text' ? (obj.text?.slice(0, 20) || 'Text') : obj.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
