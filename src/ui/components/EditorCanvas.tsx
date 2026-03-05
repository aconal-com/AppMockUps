import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import templateEngine from '../../engines/templateEngine';

export default function EditorCanvas() {
  const canvas = useStore((state) => state.canvas);
  const selectedTemplate = useStore((state) => state.selectedTemplate);
  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const gradientColors = useStore((state) => state.gradientColors);
  const selectedDevice = useStore((state) => state.selectedDevice);

  useEffect(() => {
    if (!canvas) return;

    // Apply background
    if (backgroundType === 'solid') {
      canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
    } else {
      // Gradient background
      const gradient = new (canvas as any).Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 0, y2: canvas.height },
        colorStops: [
          { offset: 0, color: gradientColors[0] },
          { offset: 1, color: gradientColors[1] },
        ],
      });
      canvas.setBackgroundColor(gradient, canvas.renderAll.bind(canvas));
    }
  }, [canvas, backgroundType, backgroundColor, gradientColors]);

  useEffect(() => {
    if (!canvas || !selectedTemplate) return;

    // Load template
    templateEngine.loadTemplate(canvas, selectedTemplate, selectedDevice);
  }, [canvas, selectedTemplate, selectedDevice]);

  return null; // Canvas is controlled by ref in parent
}
