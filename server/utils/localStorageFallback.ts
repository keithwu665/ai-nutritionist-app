import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * Local storage fallback for when Supabase is unavailable
 * Used in sandbox environments without external network access
 */

const LOCAL_STORAGE_DIR = path.join(process.cwd(), '.local-storage', 'food-photos');

// Ensure directory exists
function ensureStorageDir() {
  if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
    fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
    console.log(`[LocalStorage] Created directory: ${LOCAL_STORAGE_DIR}`);
  }
}

export async function createLocalUploadUrl(fileName: string): Promise<{ uploadUrl: string; objectPath: string }> {
  ensureStorageDir();
  
  const fileId = randomUUID();
  const objectPath = `local-storage/${fileId}/${fileName}`;
  const filePath = path.join(LOCAL_STORAGE_DIR, fileId, fileName);
  
  // Ensure subdirectory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  console.log(`[LocalStorage] Created upload URL for: ${objectPath}`);
  
  return {
    uploadUrl: `file://${filePath}`,
    objectPath: objectPath,
  };
}

export async function downloadLocalFile(objectPath: string): Promise<Buffer> {
  ensureStorageDir();
  
  // Extract file ID and name from objectPath (format: local-storage/{fileId}/{fileName})
  const parts = objectPath.split('/');
  if (parts.length < 3 || parts[0] !== 'local-storage') {
    throw new Error(`Invalid local storage path: ${objectPath}`);
  }
  
  const fileId = parts[1];
  const fileName = parts.slice(2).join('/');
  const filePath = path.join(LOCAL_STORAGE_DIR, fileId, fileName);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  console.log(`[LocalStorage] Reading file: ${filePath}`);
  return fs.readFileSync(filePath);
}

export function isLocalStoragePath(objectPath: string): boolean {
  return objectPath.startsWith('local-storage/');
}

export async function saveLocalFile(objectPath: string, data: Buffer): Promise<void> {
  ensureStorageDir();
  
  // Extract file ID and name from objectPath (format: local-storage/{fileId}/{fileName})
  const parts = objectPath.split('/');
  if (parts.length < 3 || parts[0] !== 'local-storage') {
    throw new Error(`Invalid local storage path: ${objectPath}`);
  }
  
  const fileId = parts[1];
  const fileName = parts.slice(2).join('/');
  const filePath = path.join(LOCAL_STORAGE_DIR, fileId, fileName);
  
  // Ensure subdirectory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  
  console.log(`[LocalStorage] Saving file: ${filePath} (${data.length} bytes)`);
  fs.writeFileSync(filePath, data);
  console.log(`[LocalStorage] File saved successfully`);
}
