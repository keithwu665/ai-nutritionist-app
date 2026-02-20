import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

interface BodyPhotosUploadProps {
  onUploadSuccess?: () => void;
}

export function BodyPhotosUpload({ onUploadSuccess }: BodyPhotosUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const uploadMutation = trpc.bodyPhotos.uploadFile.useMutation();

  // Handle iOS keyboard visibility to keep CTA in view
  useEffect(() => {
    const handleViewportChange = () => {
      // When keyboard opens/closes, scroll the upload button into view
      if (contentRef.current) {
        const button = contentRef.current.querySelector('button[type="button"]');
        if (button && document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
          // Small delay to let keyboard animation complete
          setTimeout(() => {
            button?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 300);
        }
      }
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!file) {
      newErrors.file = '請選擇照片';
    }

    if (!date) {
      newErrors.date = '請選擇日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log('FILE_SELECTED', { name: selectedFile?.name, size: selectedFile?.size, type: selectedFile?.type });
    
    if (!selectedFile) return;

    // Clear previous file error
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.file;
      return newErrors;
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      console.log('INVALID_FILE_TYPE', { type: selectedFile.type });
      setErrors(prev => ({
        ...prev,
        file: '無效的文件類型。請上傳 JPG、PNG 或 WebP。'
      }));
      return;
    }

    // Validate file size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      console.log('FILE_TOO_LARGE', { size: selectedFile.size, maxSize: MAX_SIZE });
      setErrors(prev => ({
        ...prev,
        file: '文件過大。最大大小為 10MB。'
      }));
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    console.log('[UPLOAD] Button clicked', { file: file?.name, date, preview: !!preview });
    
    if (!validateForm()) {
      console.log('[UPLOAD] Validation failed', { file: !!file, date: !!date });
      return;
    }

    if (!file || !preview) {
      console.log('[UPLOAD] Missing file or preview');
      setErrors(prev => ({
        ...prev,
        file: '請選擇照片'
      }));
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      console.log('[UPLOAD] Invalid date format', { date });
      setErrors(prev => ({
        ...prev,
        date: '日期格式無效 (應為 YYYY-MM-DD)'
      }));
      return;
    }

    setIsLoading(true);
    console.log('[UPLOAD] Starting upload', { fileName: file.name, fileSize: file.size, mimeType: file.type, uploadedAt: date });
    try {
      // Convert base64 preview to base64 data
      const base64Data = preview.split(',')[1];
      console.log('[UPLOAD] Base64 data prepared', { length: base64Data.length });

      console.log('[UPLOAD] Calling uploadFile mutation', { uploadedAt: date });
      await uploadMutation.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        base64Data,
        description: description || undefined,
        tags: tags || undefined,
        uploadedAt: date,
      });

      console.log('[UPLOAD] Mutation completed successfully');
      
      // Reset form
      setFile(null);
      setPreview(null);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setTags('');
      setErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Invalidate queries to refresh the gallery
      console.log('[UPLOAD] Invalidating bodyPhotos query');
      await queryClient.invalidateQueries({ queryKey: ['bodyPhotos'] });
      console.log('[UPLOAD] Upload success - calling onUploadSuccess callback');
      onUploadSuccess?.();
    } catch (error) {
      console.error('[UPLOAD] Upload failed', error);
      const errorMsg = error instanceof Error ? error.message : '未知錯誤';
      console.error('[UPLOAD] Error message:', errorMsg);
      setErrors(prev => ({
        ...prev,
        submit: `上傳失敗: ${errorMsg}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={contentRef}
      className="flex flex-col h-full max-h-[min(90vh,720px)] overflow-hidden"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇照片 *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">支援: JPG, PNG, WebP (最大 10MB)</p>
            {errors.file && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{errors.file}</p>
              </div>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">預覽</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md border border-gray-200"
              />
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期 *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors(prev => {
                  const newErrors = { ...prev };
                  delete newErrors.date;
                  return newErrors;
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.date && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{errors.date}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如: 前視圖 - 開始"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              標籤
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如: front,start"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">用逗號分隔多個標籤</p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer with Upload Button */}
      <div
        className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-2"
        style={{
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
        }}
      >
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '上傳中...' : '上傳照片'}
        </button>
      </div>
    </div>
  );
}
