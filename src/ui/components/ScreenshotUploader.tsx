import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import screenshotEngine from '../../engines/screenshotEngine';

export default function ScreenshotUploader() {
  const canvas = useStore((state) => state.canvas);
  const selectedDevice = useStore((state) => state.selectedDevice);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      // Load screenshot
      const screenshotInfo = await screenshotEngine.loadFromFile(file);
      setUploadedImages([...uploadedImages, screenshotInfo.url]);

      // Add to canvas if canvas exists
      if (canvas) {
        await screenshotEngine.addToCanvas(canvas, screenshotInfo.url, {
          scale: 0.5,
        });
      }
    } catch (error) {
      console.error('Error loading screenshot:', error);
      alert('Failed to load screenshot');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    await handleFileSelect(files);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700 uppercase tracking-wide">
        Screenshots
      </h3>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          Click or drag screenshot here
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PNG, JPG, WEBP supported
        </p>
      </div>

      {/* Uploaded Images List */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Uploaded ({uploadedImages.length})
          </p>
          {uploadedImages.map((imageUrl, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
            >
              <img
                src={imageUrl}
                alt={`Screenshot ${index + 1}`}
                className="w-12 h-12 object-cover rounded"
              />
              <span className="flex-1 text-sm text-gray-700 truncate">
                Screenshot {index + 1}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 Tip: Upload screenshots and they'll be automatically added to the canvas.
          Select a device frame to properly mask screenshots.
        </p>
      </div>
    </div>
  );
}
