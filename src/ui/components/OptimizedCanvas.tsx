import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

interface OptimizedCanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: any) => void;
}

export default function OptimizedCanvas({ width, height, onCanvasReady }: OptimizedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCanvas = useStore((state) => state.setCanvas);

  useEffect(() => {
    const initializeCanvas = async () => {
      const fabric = (await import('fabric')).fabric;

      if (canvasRef.current) {
        const canvas = new fabric.Canvas(canvasRef.current, {
          width,
          height,
          preserveObjectStacking: true,
          selection: true,

          // Performance optimizations
          renderOnAddRemove: false,
          skipTargetFind: false,
          isDrawingMode: false,

          // Object caching for better performance
          objectCaching: true,
          stateful: true,
        });

        // Enable viewport transform for smooth zooming
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

        // Optimize free drawing (not used but good for performance)
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 10;

        // Disable default hover cursor for performance
        canvas.hoverCursor = 'default';
        canvas.selection = true;

        setCanvas(canvas);

        if (onCanvasReady) {
          onCanvasReady(canvas);
        }

        // Throttle render calls for performance
        let renderTimeout: NodeJS.Timeout;
        const throttledRender = () => {
          clearTimeout(renderTimeout);
          renderTimeout = setTimeout(() => {
            canvas.renderAll();
          }, 16); // ~60fps
        };

        canvas.on('object:modified', throttledRender);
        canvas.on('object:moving', throttledRender);
        canvas.on('object:scaling', throttledRender);
        canvas.on('object:rotating', throttledRender);

        return () => {
          clearTimeout(renderTimeout);
          canvas.off('object:modified', throttledRender);
          canvas.off('object:moving', throttledRender);
          canvas.off('object:scaling', throttledRender);
          canvas.off('object:rotating', throttledRender);
          canvas.dispose();
        };
      }
    };

    initializeCanvas();
  }, [width, height, setCanvas, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        maxWidth: '100%',
        height: 'auto',
        imageRendering: 'optimizeQuality',
      }}
    />
  );
}
