# AppMockUps - Professional App Store Screenshot Generator

**Transforming YUZU-Hub/appscreen into a template-driven marketing screenshot engine**

## Overview

Turn simple screenshot composer into professional App Store screenshot generator that matches studio.app-mockup.com quality.

---

# 1. What Makes "Professional" App Store Screens

Professional screenshots follow a very consistent layout pattern:

### Visual Hierarchy
1. Large headline
2. Device frame
3. App screenshot
4. Minimal decorations

### Typical Spacing Rules
- Top padding: 120–200px
- Headline width: 60–70%
- Device width: 65–75%
- Bottom padding: 120px

---

# 2. What the Current Repo Likely Lacks

### No Real Template System
Everything is manually positioned.

### No Device Masking
Screenshots float instead of fitting inside phones.

### Weak Typography
No strong headline layout.

### No Layout Automation
User has to design everything manually.

---

# 3. Architecture Upgrade Needed

To match studio.app-mockup.com, you need 4 engines:

1. **Screenshot Engine** - Import and process screenshots
2. **Template Engine** - Define layouts and positions
3. **Device Frame Engine** - Apply device frames with masking
4. **Export Engine** - Generate final images

---

# 4. Add a Template System (Most Important)

Templates should generate layouts automatically.

### Example Template JSON
```json
{
  "id": "feature_hero",
  "background": "#A8C0D8",
  "title": {
    "x": 0.1,
    "y": 0.12,
    "maxWidth": 0.75,
    "fontSize": 110
  },
  "device": {
    "type": "iphone15",
    "x": 0.5,
    "y": 0.72,
    "scale": 0.75
  }
}
```

This lets users:
```
Upload screenshot
↓
Pick template
↓
Edit text
↓
Export
```

Instead of designing from scratch.

---

# 5. Add Device Frames

Professional screenshots almost always use devices.

### Devices Needed
- iPhone 15 Pro
- iPhone SE
- Pixel
- Tablet

### Structure
```
device/
├── frame.png
├── mask.png
└── screenshot clipped
```

**Implementation:** Using Fabric.js clipPath.

---

# 6. Typography System

Your example screenshot relies heavily on typography.

### Recommended Fonts
- Inter
- SF Pro
- Manrope
- Poppins

### Title Specs
- Font size: 90–130px
- Line height: 1.1
- Font weight: 600–700
- Max width: 70%

---

# 7. Auto Layout Rules

Users should not manually place elements.

### Example Rules
- Title → top left
- Subtitle → below title
- Device → centered bottom
- Screenshot → inside device

---

# 8. Device Screenshot Masking

Screenshot must clip inside phone.

### Implementation
```
fabric.Image
↓
clipPath
↓
screen mask
```

Example:
```
device frame
├── mask
│   └── screenshot clipped
└── frame overlay
```

---

# 9. Add Gradient Background Generator

Modern screenshots rarely use flat color.

### Example Gradients
- #5A8DEE → #6991F0
- #FF7A18 → #AF002D
- #36D1DC → #5B86E5

Using CSS gradients rendered to canvas.

---

# 10. Template Categories

You should ship 15–20 templates.

### Examples

#### Centered Hero
- Title
- Device (centered)

#### Left Text Layout
- Title left
- Phone right

#### Floating Device
- Title
- Floating phone
- Shadow

#### Panoramic
- Screenshot spanning 3 slides

---

# 11. Screenshot Import System

Users upload: 1–10 screenshots

The system should:
- Auto insert
- Auto scale
- Auto mask

---

# 12. Multi-Slide Generator

App Store requires multiple slides.

Example workflow:
```
Slide 1: Hero screenshot
Slide 2: Feature 1
Slide 3: Feature 2
Slide 4: Feature 3
Slide 5: CTA

The tool should:
1. Duplicate template across slides
2. Auto-insert screenshots in sequence
3. Auto-generate copy from app description
4. One-click export all slides
```

---

# 13. File Structure

```
AppMockUps/
├── src/
│   ├── engines/
│   │   ├── screenshot.js
│   │   ├── template.js
│   │   ├── device-frame.js
│   │   └── export.js
│   ├── templates/
│   │   ├── feature_hero.json
│   │   ├── left_text.json
│   │   ├── floating_device.json
│   │   └── panoramic.json
│   ├── devices/
│   │   ├── iphone15pro/
│   │   │   ├── frame.png
│   │   │   ├── mask.png
│   │   │   └── config.json
│   │   ├── iphone-se/
│   │   │   └── ...
│   │   ├── pixel/
│   │   │   └── ...
│   │   └── tablet/
│   │       └── ...
│   ├── fonts/
│   │   ├── Inter/
│   │   ├── SF-Pro/
│   │   ├── Manrope/
│   │   └── Poppins/
│   ├── gradients/
│   │   └── presets.json
│   └── ui/
│       ├── template-selector.js
│       ├── editor.js
│       └── preview.js
├── public/
│   ├── assets/
│   └── export/
└── templates/
    └── examples/
```

---

# 14. Tech Stack

- **Canvas:** Fabric.js (or similar)
- **Backend:** Node.js (optional for batch processing)
- **Frontend:** React/Vue (or vanilla JS)
- **Fonts:** Google Fonts / System fonts
- **Export:** Canvas to PNG/WebP

---

# 15. Priority Implementation Order

### Phase 1: Foundation (Week 1)
- [ ] Set up project structure
- [ ] Basic canvas engine
- [ ] Device frame system with masking
- [ ] 2-3 device frames (iPhone 15 Pro, SE)

### Phase 2: Templates (Week 2)
- [ ] Template engine
- [ ] 5 core templates
- [ ] Typography system
- [ ] Background gradients

### Phase 3: UI (Week 3)
- [ ] Template selector
- [ ] Live preview
- [ ] Text editor
- [ ] Screenshot uploader

### Phase 4: Advanced (Week 4)
- [ ] Multi-slide generator
- [ ] Auto-copy generation
- [ ] Batch export
- [ ] More templates (15+ total)

---

# 16. Key Features Checklist

### Must Have
- [ ] Template system with JSON configs
- [ ] Device frames with masking
- [ ] Screenshot auto-insert & scaling
- [ ] Typography controls (font, size, weight, color)
- [ ] Gradient backgrounds
- [ ] Export as PNG

### Should Have
- [ ] Multi-slide batch generator
- [ ] Live preview
- [ ] Device shadow
- [ ] Custom templates
- [ ] Save/load projects

### Nice to Have
- [ ] AI copy generation from app description
- [ ] Device notch cutouts
- [ ] Landscape mode
- [ ] Tablet frames
- [ ] Animated exports

---

# 17. Reference Links

- Original repo: https://github.com/YUZU-Hub/appscreen
- Studio app-mockup: https://studio.app-mockup.com
- Fabric.js: https://fabricjs.com/
- Google Fonts: https://fonts.google.com/

---

**Status:** Planning phase - Ready to implement
