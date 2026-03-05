import { useStore } from '../../store/useStore';
import { Plus, Copy, Trash2 } from 'lucide-react';

export default function SlideTimeline() {
  const project = useStore((state) => state.project);
  const currentSlideIndex = useStore((state) => state.project?.currentSlideIndex || 0);
  const addSlide = useStore((state) => state.addSlide);
  const deleteSlide = useStore((state) => state.deleteSlide);
  const duplicateSlide = useStore((state) => state.duplicateSlide);
  const setCurrentSlide = useStore((state) => state.setCurrentSlide);

  if (!project) return null;

  const handleSlideClick = (index: number) => {
    const slide = project.slides[index];
    setCurrentSlide(slide);
  };

  return (
    <div className="h-32 bg-white border-t border-gray-200 flex flex-col">
      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
          Slides
        </h3>
        <button
          onClick={addSlide}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 p-4">
          {project.slides.map((slide, index) => (
            <div
              key={slide.id}
              onClick={() => handleSlideClick(index)}
              className={`relative group flex-shrink-0 w-24 h-20 rounded-lg border-2 cursor-pointer transition-all ${
                currentSlideIndex === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
            >
              <div className="absolute inset-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-700">{slide.title}</div>
                  <div className="text-xs text-gray-400">
                    {slide.elements.length} {slide.elements.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {project.slides.length > 1 && (
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSlide(slide.id);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                    title="Duplicate"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSlide(slide.id);
                    }}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}

              {/* Slide number badge */}
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gray-800 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
