import { Canvas } from 'fabric/fabric-impl';
import JSZip from 'jszip';

export const APP_STORE_SIZES = {
  iphone15pro: { width: 1242, height: 2688, name: 'iPhone 15 Pro' },
  iphone15promax: { width: 1290, height: 2796, name: 'iPhone 15 Pro Max' },
  iphonese: { width: 1240, height: 2208, name: 'iPhone SE' },
};

class ExportEngine {
  /**
   * Export canvas as PNG at App Store specifications
   */
  async exportPNG(
    canvas: Canvas,
    filename: string = 'screenshot.png',
    size: keyof typeof APP_STORE_SIZES = 'iphone15promax'
  ): Promise<Blob> {
    const targetSize = APP_STORE_SIZES[size];

    // Create a temporary canvas for export at full resolution
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetSize.width;
    tempCanvas.height = targetSize.height;
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    // Fill background
    const dataURL = canvas.toDataURL({
      format: 'png',
      multiplier: targetSize.width / canvas.width,
      quality: 1,
    });

    const img = new Image();
    img.src = dataURL;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);

    // Convert to blob
    return new Promise((resolve) => {
      tempCanvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create blob');
        }
      }, 'image/png');
    });
  }

  /**
   * Download PNG file
   */
  async downloadPNG(
    canvas: Canvas,
    filename: string,
    size: keyof typeof APP_STORE_SIZES = 'iphone15promax'
  ): Promise<void> {
    const blob = await this.exportPNG(canvas, filename, size);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export multiple slides as ZIP
   */
  async exportBatch(
    canvases: Canvas[],
    size: keyof typeof APP_STORE_SIZES = 'iphone15promax'
  ): Promise<Blob> {
    const zip = new JSZip();

    for (let i = 0; i < canvases.length; i++) {
      const blob = await this.exportPNG(
        canvases[i],
        `screenshot_${i + 1}.png`,
        size
      );
      zip.file(`screenshot_${i + 1}.png`, blob);
    }

    return zip.generateAsync({ type: 'blob' });
  }

  /**
   * Download ZIP file
   */
  async downloadBatch(
    canvases: Canvas[],
    filename: string = 'screenshots.zip',
    size: keyof typeof APP_STORE_SIZES = 'iphone15promax'
  ): Promise<void> {
    const blob = await this.exportBatch(canvases, size);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default new ExportEngine();
