import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Image compression utility
export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Generate unique filename with timestamp
export const generateFileName = (originalName: string, prefix = ''): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  return `${prefix}${timestamp}-${randomString}.${extension}`;
};

// Upload image to Supabase storage
export const uploadAdImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  url: string;
  path: string;
  size: number;
}> => {
  try {
    // Compress image first
    onProgress?.(10);
    const compressedBlob = await compressImage(file, 1920, 0.85);
    const compressedFile = new File([compressedBlob!], file.name, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
    
    onProgress?.(30);
    
    // Generate unique filename
    const fileName = generateFileName(file.name, 'ad-');
    const filePath = `original/${fileName}`;
    
    onProgress?.(50);
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('ad-images')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
    
    onProgress?.(80);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('ad-images')
      .getPublicUrl(data.path);
    
    onProgress?.(100);
    
    return {
      url: urlData.publicUrl,
      path: data.path,
      size: compressedFile.size
    };
  } catch (error) {
    logger.error('Image upload error:', error);
    throw error;
  }
};

// Generate thumbnail
export const generateThumbnail = (file: File, size = 300): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Create square thumbnail
      const minDimension = Math.min(img.width, img.height);
      const startX = (img.width - minDimension) / 2;
      const startY = (img.height - minDimension) / 2;
      
      canvas.width = size;
      canvas.height = size;
      
      ctx.drawImage(
        img,
        startX, startY, minDimension, minDimension,
        0, 0, size, size
      );
      
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Upload thumbnail
export const uploadThumbnail = async (originalFile: File, originalPath: string): Promise<string> => {
  try {
    const thumbnailBlob = await generateThumbnail(originalFile, 300);
    const thumbnailFile = new File([thumbnailBlob!], 'thumbnail.jpg', {
      type: 'image/jpeg',
    });
    
    const thumbnailPath = originalPath.replace('original/', 'thumbnails/');
    
    const { data, error } = await supabase.storage
      .from('ad-images')
      .upload(thumbnailPath, thumbnailFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      logger.warn('Thumbnail upload failed:', error);
      return '';
    }
    
    const { data: urlData } = supabase.storage
      .from('ad-images')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    logger.warn('Thumbnail generation failed:', error);
    return '';
  }
};

// Delete uploaded files
export const deleteAdImage = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('ad-images')
      .remove([path]);
    
    if (error) {
      logger.error('Delete failed:', error);
      return false;
    }
    
    // Also try to delete thumbnail
    const thumbnailPath = path.replace('original/', 'thumbnails/');
    await supabase.storage.from('ad-images').remove([thumbnailPath]);
    
    return true;
  } catch (error) {
    logger.error('Delete error:', error);
    return false;
  }
};

// Storage monitoring utilities
export const getStorageUsage = async (): Promise<{
  totalFiles: number;
  totalSize: number;
}> => {
  try {
    const { data, error } = await supabase.storage
      .from('ad-images')
      .list('original', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });
    
    if (error || !data) {
      return { totalFiles: 0, totalSize: 0 };
    }
    
    const totalSize = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    
    return {
      totalFiles: data.length,
      totalSize
    };
  } catch (error) {
    logger.error('Storage usage check failed:', error);
    return { totalFiles: 0, totalSize: 0 };
  }
};

// Utility to check if file size is within limits
export const validateFileSize = (file: File, maxSizeMB = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Utility to validate file type
export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};