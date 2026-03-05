# Project Structure

```
AppMockUps/
├── IMPLEMENTATION_PLAN.md          # Comprehensive implementation guide
├── PROJECT_STRUCTURE.md            # This file
├── README.md                       # Project overview
├── package.json                    # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
│
├── src/
│   ├── engines/
│   │   └── README.md               # Core engines documentation
│   │   ├── screenshot.js           # Screenshot import & processing
│   │   ├── template.js             # Template engine
│   │   ├── device-frame.js         # Device frame & masking
│   │   └── export.js               # Export to PNG/ZIP
│   │
│   ├── templates/
│   │   └── feature_hero.json       # Example template config
│   │   ├── left_text.json          # More templates...
│   │   ├── floating_device.json
│   │   └── panoramic.json
│   │
│   ├── devices/
│   │   ├── iphone15pro/
│   │   │   ├── config.json         # Device specs & screen dimensions
│   │   │   ├── frame.png           # Device frame image
│   │   │   └── mask.png            # Screenshot mask
│   │   ├── iphone-se/              # Additional devices...
│   │   ├── pixel/
│   │   └── tablet/
│   │
│   ├── fonts/
│   │   ├── Inter/                  # Font files...
│   │   ├── SF-Pro/
│   │   ├── Manrope/
│   │   └── Poppins/
│   │
│   ├── gradients/
│   │   └── presets.json            # 10+ gradient presets
│   │
│   ├── store/
│   │   └── useStore.ts             # Zustand state management
│   │
│   └── ui/
│       ├── components/
│       │   ├── TemplateSelector.jsx     # Template gallery
│       │   ├── Editor.jsx                 # Main editor canvas
│       │   ├── Preview.jsx                # Live preview
│       │   ├── LayerPanel.jsx             # Layers & properties
│       │   ├── SlideTimeline.jsx          # Slide navigation
│       │   ├── TextControls.jsx           # Typography settings
│       │   ├── BackgroundPicker.jsx       # Color/gradient picker
│       │   └── DeviceSelector.jsx        # Device selection
│       │
│       └── styles/
│           └── globals.css         # Global styles
│
├── public/
│   ├── assets/
│   │   ├── devices/                # Device images
│   │   ├── fonts/                  # Font files (if loaded locally)
│   │   └── templates/              # Template previews
│   └── export/                     # Temporary export folder
│
└── templates/
    └── examples/                   # Example templates for users
```

## Key Files Explained

### Core Engines (`src/engines/`)

1. **screenshot.js**
   - Import user screenshots
   - Auto-scale to device screen size
   - Validate dimensions
   - Optimize image quality

2. **template.js**
   - Load template JSON configs
   - Parse template definitions
   - Apply template to canvas
   - Validate template structure

3. **device-frame.js**
   - Load device frame images
   - Apply mask to screenshots
   - Handle device-specific configs
   - Manage notch/cutout placement

4. **export.js**
   - Export canvas to PNG
   - Support App Store dimensions
   - Batch export to ZIP
   - Progress tracking

### State Management (`src/store/useStore.ts`)

Zustand store manages:
- Canvas reference
- Project data (slides, elements)
- Current slide selection
- Template selection
- Device selection
- Background settings
- Typography settings
- Export state
- UI state (selected element, panels)

### Templates (`src/templates/*.json`)

Template structure:
```json
{
  "id": "feature_hero",
  "name": "Feature Hero",
  "description": "...",
  "dimensions": { "width": 1290, "height": 2796 },
  "background": { "type": "gradient", "colors": [...] },
  "elements": [
    { "type": "text", ... },
    { "type": "device", ... }
  ],
  "placeholders": { "headline": "...", "subtitle": "..." }
}
```

### Device Configs (`src/devices/*/config.json`)

Device structure:
```json
{
  "id": "iphone15pro",
  "name": "iPhone 15 Pro",
  "dimensions": { "width": 1290, "height": 2796 },
  "screen": { "width": 1179, "height": 2556, "x": 55.5, "y": 118 },
  "notch": { "width": 126, "height": 37, "x": 582, "y": 12 },
  "frame": { "path": "frame.png", "mask": "mask.png" }
}
```

### UI Components (`src/ui/components/`)

- **TemplateSelector.jsx**: Grid of template thumbnails
- **Editor.jsx**: Fabric.js canvas wrapper
- **Preview.jsx**: Live preview canvas
- **LayerPanel.jsx**: Object layer management
- **SlideTimeline.jsx**: Slide navigation bar
- **TextControls.jsx**: Font, size, weight, color
- **BackgroundPicker.jsx**: Solid color or gradient
- **DeviceSelector.jsx**: Device frame selection

---

**Total files created:** 15+ (placeholders and configs)
**Ready for:** React + Vite development
