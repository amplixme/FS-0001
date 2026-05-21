import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import api from '@/services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten imágenes JPG, PNG o WEBP';
    }

    if (file.size > maxSize) {
      return 'La imagen no puede superar los 5MB';
    }

    return null;
  };

  const handleFile = async (file) => {
    if (!file) return;

    setError('');

    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    const localPreview = URL.createObjectURL(file);

    setPreview(localPreview);
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append('image', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total,
          );

          setProgress(percent);
        },
      });

      const uploadedUrl = response.data.url;

      setPreview(uploadedUrl);

      onChange(uploadedUrl);
    } catch (error) {
      setError(
        error.response?.data?.error?.message ||
          'Error al subir la imagen',
      );

      setPreview('');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setProgress(0);
    setError('');

    onChange('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <Card
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-dashed cursor-pointer ${isDragging ? 'bg-blue-50 border-blue-500' : 'hover:bg-muted/40'} transition-colors`}
        >
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />

            <p className="font-medium text-sm">
              Arrastra una imagen o haz click para subir
            </p>

            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG o WEBP — máximo 5MB
            </p>
          </div>
        </Card>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl border"
          />

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={handleRemove}
            className="absolute top-3 right-3 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Subiendo imagen...
          </div>

          <Progress value={progress} />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageUpload;