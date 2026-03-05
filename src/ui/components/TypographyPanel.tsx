import { useStore } from '../../store/useStore';

const fonts = [
  { id: 'Inter', name: 'Inter', style: 'sans-serif' },
  { id: 'SF Pro', name: 'SF Pro', style: 'sans-serif' },
  { id: 'Manrope', name: 'Manrope', style: 'sans-serif' },
  { id: 'Poppins', name: 'Poppins', style: 'sans-serif' },
];

export default function TypographyPanel() {
  const selectedFont = useStore((state) => state.selectedFont);
  const setSelectedFont = useStore((state) => state.setSelectedFont);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Typography
      </h3>

      <div className="space-y-2">
        <label className="text-xs text-gray-600">Font Family</label>
        <div className="space-y-1">
          {fonts.map((font) => (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selectedFont === font.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span
                style={{
                  fontFamily: font.id === 'SF Pro' ? '-apple-system, BlinkMacSystemFont, sans-serif' : font.name,
                }}
                className="text-base"
              >
                {font.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 Tip: Select a text element on the canvas to edit its properties
        </p>
      </div>
    </div>
  );
}
