import { useStore } from './store/useStore';
import TemplateSelector from './ui/components/TemplateSelector';
import EditorCanvas from './ui/components/EditorCanvas';
import LayerPanel from './ui/components/LayerPanel';
import PropertiesPanel from './ui/components/PropertiesPanel';
import SlideTimeline from './ui/components/SlideTimeline';
import Header from './ui/components/Header';
import BackgroundPanel from './ui/components/BackgroundPanel';
import TypographyPanel from './ui/components/TypographyPanel';
import ScreenshotUploader from './ui/components/ScreenshotUploader';
import ProjectManager from './ui/components/ProjectManager';
import ClipboardActions from './ui/components/ClipboardActions';
import HistoryActions from './ui/components/HistoryActions';

export default function App() {
  const selectedTemplate = useStore((state) => state.selectedTemplate);
  const setSelectedTemplate = useStore((state) => state.setSelectedTemplate);
  const showLayerPanel = useStore((state) => state.showLayerPanel);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-6">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />

            <ScreenshotUploader />

            <BackgroundPanel />

            <TypographyPanel />

            <DeviceSelector />

            <ClipboardActions />

            <HistoryActions />

            <ProjectManager />
          </div>
        </aside>

        {/* Center - Canvas */}
        <main className="flex-1 flex items-center justify-center bg-gray-50 overflow-auto p-8">
          <div className="shadow-2xl">
            <EditorCanvas />
          </div>
        </main>

        {/* Right Sidebar */}
        {showLayerPanel && (
          <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <LayerPanel />
            <PropertiesPanel />
          </aside>
        )}
      </div>

      {/* Bottom - Slide Timeline */}
      <SlideTimeline />
    </div>
  );
}

// Simple Device Selector component
function DeviceSelector() {
  const selectedDevice = useStore((state) => state.selectedDevice);
  const setSelectedDevice = useStore((state) => state.setSelectedDevice);

  const devices = [
    { id: 'iphone15pro', name: 'iPhone 15 Pro', size: '6.1"' },
    { id: 'iphone15promax', name: 'iPhone 15 Pro Max', size: '6.7"' },
    { id: 'iphonese', name: 'iPhone SE', size: '4.7"' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Device
      </h3>
      <div className="space-y-2">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedDevice === device.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium text-gray-900">{device.name}</div>
            <div className="text-xs text-gray-500">{device.size}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
