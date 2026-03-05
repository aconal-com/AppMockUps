import React from 'react';

const templates = [
  {
    id: 'feature_hero',
    name: 'Feature Hero',
    description: 'Centered headline with device at bottom',
    preview: '📱',
  },
  {
    id: 'left_text',
    name: 'Left Text Layout',
    description: 'Title on left, device on right',
    preview: '📱',
  },
  {
    id: 'floating_device',
    name: 'Floating Device',
    description: 'Floating phone with dramatic shadow',
    preview: '📱',
  },
  {
    id: 'panoramic',
    name: 'Panoramic',
    description: 'Screenshot spanning full width',
    preview: '📱',
  },
  {
    id: 'minimal_center',
    name: 'Minimal Center',
    description: 'Clean centered layout',
    preview: '📱',
  },
  {
    id: 'split_screen',
    name: 'Split Screen',
    description: 'Two devices side by side',
    preview: '📱',
  },
];

export default function TemplateSelector({ selectedTemplate, onSelect }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Templates
      </h3>
      <div className="space-y-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{template.preview}</span>
              <div>
                <div className="font-medium text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-500">{template.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
