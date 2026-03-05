import { Canvas } from 'fabric/fabric-impl';

interface DeviceConfig {
  id: string;
  name: string;
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  screenX: number;
  screenY: number;
  cornerRadius: number;
}

class DeviceFrameEngine {
  private devices: Record<string, DeviceConfig> = {
    iphone15pro: {
      id: 'iphone15pro',
      name: 'iPhone 15 Pro',
      width: 400,
      height: 820,
      screenWidth: 368,
      screenHeight: 760,
      screenX: 16,
      screenY: 30,
      cornerRadius: 40,
    },
    iphone15promax: {
      id: 'iphone15promax',
      name: 'iPhone 15 Pro Max',
      width: 430,
      height: 932,
      screenWidth: 398,
      screenHeight: 872,
      screenX: 16,
      screenY: 30,
      cornerRadius: 40,
    },
    iphonese: {
      id: 'iphonese',
      name: 'iPhone SE',
      width: 320,
      height: 568,
      screenWidth: 290,
      screenHeight: 528,
      screenX: 15,
      screenY: 20,
      cornerRadius: 20,
    },
  };

  getDevice(deviceId: string): DeviceConfig | null {
    return this.devices[deviceId] || null;
  }

  getAllDevices(): DeviceConfig[] {
    return Object.values(this.devices);
  }

  /**
   * Add device frame to canvas
   */
  addDeviceFrame(
    canvas: Canvas,
    deviceId: string,
    x: number,
    y: number,
    scale: number = 1
  ): void {
    const { fabric } = require('fabric');
    const device = this.getDevice(deviceId);

    if (!device) {
      console.error(`Device ${deviceId} not found`);
      return;
    }

    const scaledWidth = device.width * scale;
    const scaledHeight = device.height * scale;
    const left = x - scaledWidth / 2;
    const top = y - scaledHeight / 2;

    // Create device frame
    const frame = new fabric.Rect({
      left,
      top,
      width: scaledWidth,
      height: scaledHeight,
      fill: '#1a1a1a',
      rx: device.cornerRadius * scale,
      ry: device.cornerRadius * scale,
      selectable: false,
      evented: false,
    });

    // Add shadow
    frame.set('shadow', new fabric.Shadow({
      blur: 40 * scale,
      offsetY: 20 * scale,
      color: 'rgba(0, 0, 0, 0.3)',
    }));

    canvas.add(frame);

    // Create screen area (for screenshot masking)
    const screenLeft = left + (device.screenX * scale);
    const screenTop = top + (device.screenY * scale);
    const screenWidth = (device.screenWidth * scale);
    const screenHeight = (device.screenHeight * scale);

    const screen = new fabric.Rect({
      left: screenLeft,
      top: screenTop,
      width: screenWidth,
      screenHeight: screenHeight,
      fill: 'rgba(0, 0, 0, 0.5)',
      rx: (device.cornerRadius - 5) * scale,
      ry: (device.cornerRadius - 5) * scale,
      selectable: false,
      evented: false,
      id: 'screen-area',
    });

    canvas.add(screen);

    // Add notch (for iPhone models with notch)
    if (deviceId.includes('iphone15') || deviceId.includes('iphone14')) {
      const notchWidth = 126 * scale;
      const notchHeight = 37 * scale;
      const notch = new fabric.Rect({
        left: left + (scaledWidth - notchWidth) / 2,
        top: top + 10 * scale,
        width: notchWidth,
        height: notchHeight,
        fill: '#000000',
        rx: 18 * scale,
        ry: 18 * scale,
        selectable: false,
        evented: false,
      });

      canvas.add(notch);
    }
  }

  /**
   * Add screenshot to device screen
   */
  addScreenshot(
    canvas: Canvas,
    screenshotUrl: string,
    deviceId: string,
    deviceX: number,
    deviceY: number,
    scale: number = 1
  ): void {
    const { fabric } = require('fabric');
    const device = this.getDevice(deviceId);

    if (!device) return;

    fabric.Image.fromURL(screenshotUrl, (img: any) => {
      const scaledWidth = device.width * scale;
      const scaledHeight = device.height * scale;
      const left = deviceX - scaledWidth / 2;
      const top = deviceY - scaledHeight / 2;

      const screenLeft = left + (device.screenX * scale);
      const screenTop = top + (device.screenY * scale);
      const screenWidth = device.screenWidth * scale;
      const screenHeight = device.screenHeight * scale;

      // Scale image to fit screen
      const scaleX = screenWidth / img.width!;
      const scaleY = screenHeight / img.height!;
      const scaleToFit = Math.min(scaleX, scaleY);

      img.set({
        left: screenLeft + (screenWidth - img.width! * scaleToFit) / 2,
        top: screenTop + (screenHeight - img.height! * scaleToFit) / 2,
        scaleX: scaleToFit,
        scaleY: scaleToFit,
        clipPath: new fabric.Rect({
          left: screenLeft,
          top: screenTop,
          width: screenWidth,
          height: screenHeight,
          rx: (device.cornerRadius - 5) * scale,
          ry: (device.cornerRadius - 5) * scale,
          absolutePositioned: true,
        }),
      });

      canvas.add(img);
      canvas.renderAll();
    });
  }
}

export default new DeviceFrameEngine();
