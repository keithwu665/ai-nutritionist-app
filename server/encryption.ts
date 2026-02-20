import crypto from 'crypto';

// Get encryption key from environment or generate a default for development
const ENCRYPTION_KEY = process.env.METADATA_ENCRYPTION_KEY || 'dev-key-32-chars-minimum-length!';

if (ENCRYPTION_KEY.length < 32) {
  console.warn('[Encryption] Key is less than 32 characters. Using padded key for development only.');
}

// Pad or truncate key to 32 bytes
const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32), 'utf-8');

export function encryptMetadata(plaintext: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[Encryption] Failed to encrypt metadata:', error);
    // Fail open: return plaintext if encryption fails
    return plaintext;
  }
}

export function decryptMetadata(encrypted: string): string {
  try {
    // Handle plaintext (for backwards compatibility)
    if (!encrypted.includes(':')) {
      return encrypted;
    }
    
    const parts = encrypted.split(':');
    if (parts.length !== 3) {
      return encrypted;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    
    return decrypted;
  } catch (error) {
    console.error('[Encryption] Failed to decrypt metadata:', error);
    // Fail open: return encrypted value if decryption fails
    return encrypted;
  }
}
