// Dynamic Supabase storage utility to avoid bundling issues
// Uses dynamic imports to load Supabase only when needed

import { logger } from './logger';

let supabaseClient: any = null;

// Initialize Supabase client dynamically
async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Check if environment variables are properly configured (not placeholder values)
    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'your_supabase_project_url' ||
        supabaseAnonKey === 'your_supabase_anon_key') {
      logger.warn('Storage service not configured - using fallback storage');
      throw new Error('Supabase environment variables not configured');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test the connection
    const { error: testError } = await supabaseClient
      .from('users')
      .select('count', { count: 'exact', head: true })
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') { // PGRST116 is "table not found" which is OK
      logger.warn('Storage service connection test failed:', testError);
      throw new Error('Supabase connection failed');
    }
    
    return supabaseClient;
  } catch (error) {
    logger.warn('Storage service initialization failed, will use fallback:', error);
    throw error;
  }
}

// Image compression utility (browser-safe)
export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    if (!ctx) {
      reject(new Error('Canvas not supported'));
      return;
    }
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      }, 'image/jpeg', quality);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Generate unique filename
export const generateFileName = (originalName: string, prefix = ''): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  return `${prefix}${timestamp}-${randomString}.${extension}`;
};

// Upload image to Supabase storage with dynamic loading
export const uploadAdImageDynamic = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  url: string;
  path: string;
  size: number;
  success: boolean;
}> => {
  try {
    onProgress?.(10);
    
    // Try to load Supabase client
    const supabase = await getSupabaseClient();
    
    onProgress?.(20);
    
    // Compress image
    const compressedBlob = await compressImage(file, 1920, 0.85);
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
    
    onProgress?.(40);
    
    // Generate filename
    const fileName = generateFileName(file.name, 'ad-');
    const filePath = `original/${fileName}`;
    
    onProgress?.(60);
    
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
      size: compressedFile.size,
      success: true
    };
    
  } catch (error) {
    logger.error('Storage service upload failed:', error);
    // Return fallback result
    return {
      url: '',
      path: '',
      size: file.size,
      success: false
    };
  }
};

// Fallback upload (converts to base64)
export const uploadAdImageFallback = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  url: string;
  path: string;
  size: number;
  success: boolean;
}> => {
  return new Promise((resolve, reject) => {
    onProgress?.(10);
    
    const reader = new FileReader();
    
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = 10 + (e.loaded / e.total) * 80;
        onProgress?.(Math.round(progress));
      }
    };
    
    reader.onload = (e) => {
      onProgress?.(100);
      if (e.target && typeof e.target.result === 'string') {
        resolve({
          url: e.target.result,
          path: 'base64-fallback',
          size: file.size,
          success: true
        });
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Smart upload - tries Supabase first, falls back to base64
export const uploadAdImageSmart = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{
  url: string;
  path: string;
  size: number;
  isSupabase: boolean;
}> => {
  try {
    // Try Supabase upload first
    const result = await uploadAdImageDynamic(file, onProgress);
    
    if (result.success && result.url) {
      return {
        url: result.url,
        path: result.path,
        size: result.size,
        isSupabase: true
      };
    }
  } catch (error) {
    logger.warn('Storage service upload failed, using fallback:', error);
  }
  
  // Fallback to base64
  try {
    const fallbackResult = await uploadAdImageFallback(file, onProgress);
    return {
      url: fallbackResult.url,
      path: fallbackResult.path,
      size: fallbackResult.size,
      isSupabase: false
    };
  } catch (error) {
    throw new Error('Both upload methods failed');
  }
};

// Validation utilities
export const validateFileSize = (file: File, maxSizeMB = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};