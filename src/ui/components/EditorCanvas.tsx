import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import templateEngine from '../../engines/templateEngine';

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useStore((state) => state.canvas);
  const setCanvas = useStore((state) => state.setCanvas);
  const selectedTemplate = useStore((state) => state.selectedTemplate);
  const backgroundType = useStore((state) => state.backgroundType);
  const backgroundColor = useStore((state) => state.backgroundColor);
  const gradientColors = useStore((state) => state.gradientColors);
  const selectedDevice = useStore((state) => state.selectedDevice);

  // Initialize optimized canvas
  useEffect(() => {
    if (!canvasRef.current || canvas) return;

    import('fabric').then((fabricModule) => {
      const fabric = fabricModule.fabric;
      const newCanvas = new fabric.Canvas(canvasRef.current, {
        width: 430,
        height: 932,
        preserveObjectStacking: true,
        selection: true,

        // Performance optimizations
        renderOnAddRemove: false,
        skipTargetFind: false,
        objectCaching: true,
        stateful: true,

        // Cursor settings
        hoverCursor: 'default',
        selection: true,
      });

      setCanvas(newCanvas);

      // Throttled render for 60fps
      let renderTimeout: NodeJS.Timeout;
      const throttledRender = () => {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(() => {
          newCanvas.renderAll();
        }, 16);
      };

      newCanvas.on('object:modified', throttledRender);
      newCanvas.on('object:moving', throttledRender);
      newCanvas.on('object:scaling', throttledRender);
      newCanvas.on('object:rotating', throttledRender);

      return () => {
        clearTimeout(renderTimeout);
        newCanvas.off('object:modified', throttledRender);
        newCanvas.off('object:moving', throttledRender);
        newCanvas.off('object:scaling', throttledRender);
        newCanvas.off('object:rotating', throttledRender);
      };
    });
  }, [setCanvas, canvas]);

  // Apply background
  useEffect(() => {
    if (!canvas) return;

    // Debounce background changes
    const timeoutId = setTimeout(() => {
      if (backgroundType === 'solid') {
        canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
      } else {
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
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [canvas, backgroundType, backgroundColor, gradientColors]);

  // Load template
  useEffect(() => {
    if (!canvas || !selectedTemplate) return;

    // Debounce template changes
    const timeoutId = setTimeout(() => {
      templateEngine.loadTemplate(canvas, selectedTemplate, selectedDevice);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [canvas, selectedTemplate, selectedDevice]);

  return <canvas ref={canvasRef} width={430} height={932} style={{ maxWidth: '100%', height: 'auto', imageRendering: 'optimizeQuality' }} />;
}
