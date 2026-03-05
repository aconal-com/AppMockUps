import { useStore } from '../../store/useStore';
import gradients from '../../gradients/presets.json';

export default function BackgroundPanel() {
  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const gradientColors = useStore((state) => state.gradientColors);
  const setBackground = useStore((state) => state.setBackground);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Background
      </h3>

      {/* Background Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setBackground('solid')}
          className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
            backgroundType === 'solid'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => setBackground('gradient')}
          className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
            backgroundType === 'gradient'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700'
          }`}
        >
          Gradient
        </button>
      </div>

      {/* Solid Color Picker */}
      {backgroundType === 'solid' && (
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackground('solid', { color: e.target.value })}
              className="w-12 h-12 rounded cursor-pointer border-2 border-gray-200"
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackground('solid', { color: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            />
          </div>
        </div>
      )}

      {/* Gradient Presets */}
      {backgroundType === 'gradient' && (
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Gradient Presets</label>
          <div className="grid grid-cols-5 gap-2">
            {gradients.presets.map((gradient) => (
              <button
                key={gradient.id}
                onClick={() =>
                  setBackground('gradient', {
                    colors: gradient.colors,
                    direction: gradient.direction,
                  })
                }
                className="aspect-square rounded-lg border-2 border-transparent hover:border-gray-400 transition-all shadow-sm"
                style={{
                  background: `linear-gradient(to ${gradient.direction}, ${gradient.colors[0]}, ${gradient.colors[1]})`,
                }}
                title={gradient.name}
              />
            ))}
          </div>

          {/* Custom Gradient */}
          <div className="pt-2 space-y-2">
            <label className="text-xs text-gray-600">Custom Colors</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradientColors[0]}
                onChange={(e) =>
                  setBackground('gradient', {
                    colors: [e.target.value, gradientColors[1]],
                  })
                }
                className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200"
              />
              <span className="text-gray-400">→</span>
              <input
                type="color"
                value={gradientColors[1]}
                onChange={(e) =>
                  setBackground('gradient', {
                    colors: [gradientColors[0], e.target.value],
                  })
                }
                className="w-10 h-10 rounded cursor-pointer border-2 border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
