import { create } from 'zustand';
import { Canvas } from 'fabric/fabric-impl';

export interface Slide {
  id: string;
  title: string;
  elements: any[];
}

export interface Project {
  id: string;
  name: string;
  slides: Slide[];
  currentSlideIndex: number;
  createdAt: number;
  updatedAt: number;
}

interface EditorState {
  // Canvas
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;

  // Project
  project: Project | null;
  setProject: (project: Project | null) => void;
  updateProject: (updates: Partial<Project>) => void;

  // Slides
  currentSlide: Slide | null;
  setCurrentSlide: (slide: Slide) => void;
  addSlide: () => void;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => void;

  // Templates
  selectedTemplate: string | null;
  setSelectedTemplate: (templateId: string | null) => void;

  // Devices
  selectedDevice: string | null;
  setSelectedDevice: (deviceId: string | null) => void;

  // Background
  backgroundType: 'solid' | 'gradient';
  backgroundColor: string;
  gradientColors: [string, string];
  gradientDirection: string;
  setBackground: (type: 'solid' | 'gradient', options?: any) => void;

  // Typography
  selectedFont: string;
  setSelectedFont: (font: string) => void;

  // Export
  isExporting: boolean;
  setIsExporting: (isExporting: boolean) => void;

  // UI State
  selectedElement: string | null;
  setSelectedElement: (elementId: string | null) => void;
  showLayerPanel: boolean;
  setShowLayerPanel: (show: boolean) => void;
}

const createEmptySlide = (index: number): Slide => ({
  id: `slide-${Date.now()}-${index}`,
  title: `Slide ${index + 1}`,
  elements: [],
});

const createEmptyProject = (): Project => ({
  id: `project-${Date.now()}`,
  name: 'Untitled Project',
  slides: [createEmptySlide(0)],
  currentSlideIndex: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useStore = create<EditorState>((set) => ({
  // Canvas
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),

  // Project
  project: createEmptyProject(),
  setProject: (project) => set({ project: project || createEmptyProject() }),
  updateProject: (updates) =>
    set((state) => ({
      project: state.project
        ? { ...state.project, ...updates, updatedAt: Date.now() }
        : null,
    })),

  // Slides
  currentSlide: null,
  setCurrentSlide: (slide) => set({ currentSlide: slide }),
  addSlide: () =>
    set((state) => {
      if (!state.project) return state;
      const newSlide = createEmptySlide(state.project.slides.length);
      return {
        project: {
          ...state.project,
          slides: [...state.project.slides, newSlide],
          currentSlideIndex: state.project.slides.length,
          updatedAt: Date.now(),
        },
        currentSlide: newSlide,
      };
    }),
  deleteSlide: (id) =>
    set((state) => {
      if (!state.project || state.project.slides.length <= 1) return state;
      const newSlides = state.project.slides.filter((s) => s.id !== id);
      const newIndex = Math.min(
        state.project.currentSlideIndex,
        newSlides.length - 1
      );
      return {
        project: {
          ...state.project,
          slides: newSlides,
          currentSlideIndex: newIndex,
          updatedAt: Date.now(),
        },
        currentSlide: newSlides[newIndex],
      };
    }),
  duplicateSlide: (id) =>
    set((state) => {
      if (!state.project) return state;
      const slideIndex = state.project.slides.findIndex((s) => s.id === id);
      if (slideIndex === -1) return state;
      const originalSlide = state.project.slides[slideIndex];
      const newSlide = {
        ...originalSlide,
        id: `slide-${Date.now()}`,
        title: `${originalSlide.title} (Copy)`,
        elements: [...originalSlide.elements], // Deep copy needed in production
      };
      const newSlides = [
        ...state.project.slides.slice(0, slideIndex + 1),
        newSlide,
        ...state.project.slides.slice(slideIndex + 1),
      ];
      return {
        project: {
          ...state.project,
          slides: newSlides,
          currentSlideIndex: slideIndex + 1,
          updatedAt: Date.now(),
        },
        currentSlide: newSlide,
      };
    }),

  // Templates
  selectedTemplate: null,
  setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),

  // Devices
  selectedDevice: 'iphone15pro',
  setSelectedDevice: (deviceId) => set({ selectedDevice: deviceId }),

  // Background
  backgroundType: 'gradient',
  backgroundColor: '#A8C0D8',
  gradientColors: ['#A8C0D8', '#6991F0'],
  gradientDirection: 'bottom',
  setBackground: (type, options) =>
    set({
      backgroundType: type,
      ...(type === 'solid' && { backgroundColor: options?.color }),
      ...(type === 'gradient' && {
        gradientColors: options?.colors || ['#A8C0D8', '#6991F0'],
        gradientDirection: options?.direction || 'bottom',
      }),
    }),

  // Typography
  selectedFont: 'Inter',
  setSelectedFont: (font) => set({ selectedFont: font }),

  // Export
  isExporting: false,
  setIsExporting: (isExporting) => set({ isExporting }),

  // UI State
  selectedElement: null,
  setSelectedElement: (elementId) => set({ selectedElement: elementId }),
  showLayerPanel: true,
  setShowLayerPanel: (show) => set({ showLayerPanel: show }),
}));
