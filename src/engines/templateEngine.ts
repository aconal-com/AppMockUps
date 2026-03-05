import { Canvas } from 'fabric/fabric-impl';
import featureHeroTemplate from '../templates/feature_hero.json';
import leftTextTemplate from '../templates/left_text.json';
import floatingDeviceTemplate from '../templates/floating_device.json';
import panoramicTemplate from '../templates/panoramic.json';
import minimalCenterTemplate from '../templates/minimal_center.json';

// Import all templates
const templates: any = {
  feature_hero: featureHeroTemplate,
  left_text: leftTextTemplate,
  floating_device: floatingDeviceTemplate,
  panoramic: panoramicTemplate,
  minimal_center: minimalCenterTemplate,
};

class TemplateEngine {
  loadTemplate(
    canvas: Canvas,
    templateId: string,
    deviceId: string
  ): void {
    // Clear existing objects
    canvas.clear();

    // Get template
    const template = templates[templateId as keyof typeof templates];
    if (!template) {
      console.error(`Template ${templateId} not found`);
      return;
    }

    // Apply background
    if (template.background.type === 'gradient') {
      const gradient = new (canvas as any).Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 0, y2: canvas.height },
        colorStops: [
          { offset: 0, color: template.background.colors[0] },
          { offset: 1, color: template.background.colors[1] },
        ],
      });
      canvas.setBackgroundColor(gradient, canvas.renderAll.bind(canvas));
    } else {
      canvas.setBackgroundColor(
        template.background.color || '#ffffff',
        canvas.renderAll.bind(canvas)
      );
    }

    // Add elements from template
    template.elements.forEach((element: any) => {
      if (element.type === 'text') {
        this.addTextElement(canvas, element);
      } else if (element.type === 'device') {
        this.addDeviceElement(canvas, element, deviceId);
      }
    });

    canvas.renderAll();
  }

  private addTextElement(canvas: Canvas, element: any): void {
    const { fabric } = require('fabric');

    const text = new fabric.Textbox(element.content, {
      left: canvas.width * element.x,
      top: canvas.height * element.y,
      ...element.style,
      id: element.id,
    });

    // Apply maxWidth if specified
    if (element.maxWidth) {
      text.set({ width: canvas.width * element.maxWidth });
    }

    canvas.add(text);
  }

  private addDeviceElement(
    canvas: Canvas,
    element: any,
    deviceId: string
  ): void {
    const { fabric } = require('fabric');

    // Load device frame image (for now, create a placeholder rectangle)
    const deviceConfig = this.getDeviceConfig(deviceId);

    // Create device frame placeholder
    const frame = new fabric.Rect({
      left: (canvas.width * element.x) - (deviceConfig.width * element.scale) / 2,
      top: (canvas.height * element.y) - (deviceConfig.height * element.scale) / 2,
      width: deviceConfig.width * element.scale,
      height: deviceConfig.height * element.scale,
      fill: '#1a1a1a',
      rx: 40,
      ry: 40,
      id: element.id,
    });

    // Add shadow if configured
    if (element.shadow?.enabled) {
      frame.set('shadow', new fabric.Shadow({
        blur: element.shadow.blur,
        offsetY: element.shadow.offsetY,
        color: `rgba(0, 0, 0, ${element.shadow.opacity})`,
      }));
    }

    canvas.add(frame);

    // Create screen placeholder (where screenshot goes)
    const screen = new fabric.Rect({
      left: frame.left + 15,
      top: frame.top + 30,
      width: (deviceConfig.width - 30) * element.scale,
      height: (deviceConfig.height - 60) * element.scale,
      fill: '#000000',
      rx: 30,
      ry: 30,
      opacity: 0.5,
      id: `${element.id}-screen`,
    });

    canvas.add(screen);
  }

  private getDeviceConfig(deviceId: string): any {
    const configs: Record<string, any> = {
      iphone15pro: { width: 400, height: 820 },
      iphone15promax: { width: 430, height: 932 },
      iphonese: { width: 320, height: 568 },
    };

    return configs[deviceId] || configs.iphone15pro;
  }
}

export default new TemplateEngine();
