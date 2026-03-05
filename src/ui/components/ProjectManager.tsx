import { Download, Upload, Save, FolderOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ProjectManager() {
  const project = useStore((state) => state.project);
  const setProject = useStore((state) => state.setProject);
  const canvas = useStore((state) => state.canvas);

  const handleSaveProject = () => {
    if (!canvas || !project) {
      alert('No project to save');
      return;
    }

    try {
      const projectData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        project: project,
        canvas: canvas.toJSON(['id']),
      };

      const dataStr = JSON.stringify(projectData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `appmockups_project_${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save project');
    }
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const projectData = JSON.parse(event.target?.result as string);

        // Validate project data
        if (!projectData.project || !projectData.canvas) {
          throw new Error('Invalid project file');
        }

        // Load project
        setProject(projectData.project);

        // Load canvas
        canvas?.loadFromJSON(projectData.canvas, () => {
          canvas?.renderAll();
        });

        alert('Project loaded successfully');
      } catch (error) {
        console.error('Load error:', error);
        alert('Failed to load project. Invalid file format.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Project
      </h3>

      <div className="space-y-2">
        <button
          onClick={handleSaveProject}
          disabled={!project || !canvas}
          className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
        >
          <Save size={18} />
          Save Project
        </button>

        <label className="w-full flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm cursor-pointer">
          <FolderOpen size={18} />
          Load Project
          <input
            type="file"
            accept=".json"
            onChange={handleLoadProject}
            className="hidden"
          />
        </label>
      </div>

      {/* Info */}
      {project && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <strong>Current project:</strong> {project.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {project.slides.length} slides
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 Save your project to continue working on it later.
          All slides, templates, and elements are preserved.
        </p>
      </div>
    </div>
  );
}
