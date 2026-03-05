import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';

export default function PropertiesPanel() {
  const canvas = useStore((state) => state.canvas);

  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [properties, setProperties] = useState({
    fontSize: 48,
    fontWeight: 'normal',
    fill: '#ffffff',
    opacity: 1,
  });

  useEffect(() => {
    if (!canvas) return;

    const updateSelected = () => {
      const activeObj = canvas.getActiveObject();
      setSelectedObject(activeObj);

      if (activeObj && activeObj.type === 'text') {
        setProperties({
          fontSize: activeObj.fontSize || 48,
          fontWeight: activeObj.fontWeight || 'normal',
          fill: activeObj.fill || '#ffffff',
          opacity: activeObj.opacity || 1,
        });
      }
    };

    canvas.on('selection:created', updateSelected);
    canvas.on('selection:updated', updateSelected);
    canvas.on('selection:cleared', () => setSelectedObject(null));

    return () => {
      canvas.off('selection:created', updateSelected);
      canvas.off('selection:updated', updateSelected);
      canvas.off('selection:cleared');
    };
  }, [canvas]);

  const handlePropertyChange = (property: string, value: any) => {
    if (!selectedObject) return;

    setProperties((prev) => ({ ...prev, [property]: value }));

    if (property === 'fontSize') {
      selectedObject.set('fontSize', parseInt(value));
    } else if (property === 'fontWeight') {
      selectedObject.set('fontWeight', value);
    } else if (property === 'fill') {
      selectedObject.set('fill', value);
    } else if (property === 'opacity') {
      selectedObject.set('opacity', parseFloat(value));
    }

    canvas?.renderAll();
  };

  if (!selectedObject) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide mb-3">
          Properties
        </h3>
        <p className="text-sm text-gray-500">Select an element to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide mb-3">
        Properties
      </h3>

      {selectedObject.type === 'text' && (
        <div className="space-y-3">
          {/* Font Size */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Font Size</label>
            <input
              type="number"
              value={properties.fontSize}
              onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Font Weight */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Font Weight</label>
            <select
              value={properties.fontWeight}
              onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>

          {/* Text Color */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={typeof properties.fill === 'string' ? properties.fill : '#ffffff'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200"
              />
              <input
                type="text"
                value={typeof properties.fill === 'string' ? properties.fill : '#ffffff'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={properties.opacity}
              onChange={(e) => handlePropertyChange('opacity', e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-right">{Math.round(properties.opacity * 100)}%</div>
          </div>
        </div>
      )}

      {selectedObject.type === 'image' && (
        <div className="space-y-3">
          {/* Scale */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Scale</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={selectedObject.scaleX || 1}
              onChange={(e) => {
                const scale = parseFloat(e.target.value);
                selectedObject.scale(scale);
                canvas?.renderAll();
              }}
              className="w-full"
            />
          </div>

          {/* Opacity */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={selectedObject.opacity || 1}
              onChange={(e) => {
                selectedObject.set('opacity', parseFloat(e.target.value));
                canvas?.renderAll();
              }}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
