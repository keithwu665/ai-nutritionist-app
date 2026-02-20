import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { trpc } from '@/lib/trpc';
import { useQueryClient } from '@tanstack/react-query';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const uploadMutation = trpc.bodyPhotos.uploadFile.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert('Invalid file type. Please upload JPG, PNG, or WebP.');
      return;
    }

    // Validate file size (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      alert('File too large. Maximum size is 10MB.');
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
    if (!file || !preview) {
      alert('Please select a file first');
      return;
    }

    setIsLoading(true);
    try {
      // Convert base64 preview to base64 data
      const base64Data = preview.split(',')[1];
      
      await uploadMutation.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        base64Data,
        description: description || undefined,
        tags: tags || undefined,
        uploadedAt: date,
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setTags('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Invalidate queries to refresh the gallery
      await queryClient.invalidateQueries({ queryKey: ['bodyPhotos'] });
      onUploadSuccess?.();
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">上傳進度照片</h3>

      {/* File Input */}
      <div className="mb-4">
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
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">預覽</p>
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-md border border-gray-200" />
        </div>
      )}

      {/* Date */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          日期 *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
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
      <div className="mb-4">
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

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoading ? '上傳中...' : '上傳照片'}
      </Button>
    </div>
  );
}
