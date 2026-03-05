import { Canvas } from 'fabric/fabric-impl';

interface ScreenshotInfo {
  file: File;
  url: string;
  width: number;
  height: number;
}

class ScreenshotEngine {
  /**
   * Load screenshot from file
   */
  async loadFromFile(file: File): Promise<ScreenshotInfo> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const url = e.target?.result as string;
        const img = new Image();

        img.onload = () => {
          resolve({
            file,
            url,
            width: img.width,
            height: img.height,
          });
        };

        img.onerror = () => {
          reject(new Error('Failed to load screenshot'));
        };

        img.src = url;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Load multiple screenshots
   */
  async loadMultiple(files: File[]): Promise<ScreenshotInfo[]> {
    const promises = files.map((file) => this.loadFromFile(file));
    return Promise.all(promises);
  }

  /**
   * Add screenshot to canvas
   */
  async addToCanvas(
    canvas: Canvas,
    screenshotUrl: string,
    options: {
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      scale?: number;
      maintainAspectRatio?: boolean;
    } = {}
  ): Promise<void> {
    const { fabric } = require('fabric');

    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        screenshotUrl,
        (img: any) => {
          if (!img) {
            reject(new Error('Failed to create image from URL'));
            return;
          }

          // Set position
          if (options.x !== undefined) {
            img.set('left', options.x);
          }
          if (options.y !== undefined) {
            img.set('top', options.y);
          }

          // Set size
          if (options.width && options.height) {
            img.set({
              scaleX: options.width / img.width!,
              scaleY: options.height / img.height!,
            });
          } else if (options.scale) {
            img.scale(options.scale);
          }

          // Center on canvas if no position specified
          if (options.x === undefined || options.y === undefined) {
            img.center();
          }

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();

          resolve();
        },
        { crossOrigin: 'anonymous' }
      );
    });
  }

  /**
   * Auto-scale screenshot to fit container
   */
  calculateFitSize(
    imgWidth: number,
    imgHeight: number,
    containerWidth: number,
    containerHeight: number,
    maintainAspectRatio: boolean = true
  ): { width: number; height: number; scale: number } {
    if (maintainAspectRatio) {
      const scaleX = containerWidth / imgWidth;
      const scaleY = containerHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      return {
        width: imgWidth * scale,
        height: imgHeight * scale,
        scale,
      };
    } else {
      return {
        width: containerWidth,
        height: containerHeight,
        scale: Math.min(containerWidth / imgWidth, containerHeight / imgHeight),
      };
    }
  }

  /**
   * Resize screenshot to App Store specifications
   */
  resizeToAppStoreSpec(
    screenshotInfo: ScreenshotInfo,
    deviceType: 'iphone15pro' | 'iphone15promax' | 'iphonese'
  ): { width: number; height: number; scale: number } {
    const specs: Record<string, { width: number; height: number }> = {
      iphone15pro: { width: 1242, height: 2688 },
      iphone15promax: { width: 1290, height: 2796 },
      iphonese: { width: 1240, height: 2208 },
    };

    const spec = specs[deviceType];
    return this.calculateFitSize(
      screenshotInfo.width,
      screenshotInfo.height,
      spec.width,
      spec.height,
      true
    );
  }

  /**
   * Crop screenshot to aspect ratio
   */
  cropToAspectRatio(
    screenshotInfo: ScreenshotInfo,
    targetRatio: number
  ): ScreenshotInfo {
    const currentRatio = screenshotInfo.width / screenshotInfo.height;

    let newWidth = screenshotInfo.width;
    let newHeight = screenshotInfo.height;

    if (currentRatio > targetRatio) {
      // Too wide, crop width
      newWidth = screenshotInfo.height * targetRatio;
    } else {
      // Too tall, crop height
      newHeight = screenshotInfo.width / targetRatio;
    }

    // In a real implementation, this would use Canvas API to crop
    // For now, just return the calculated dimensions
    return {
      ...screenshotInfo,
      width: newWidth,
      height: newHeight,
    };
  }
}

export default new ScreenshotEngine();
