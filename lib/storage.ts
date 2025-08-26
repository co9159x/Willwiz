import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface StorageProvider {
  putObject(key: string, buffer: Buffer): Promise<string>;
  getSignedUrl(key: string): Promise<string>;
}

class LocalStorageProvider implements StorageProvider {
  private baseDir = process.env.STORAGE_PATH || '/tmp/my-will-storage';

  async putObject(key: string, buffer: Buffer): Promise<string> {
    await fs.mkdir(this.baseDir, { recursive: true });
    const filePath = path.join(this.baseDir, key);
    await fs.writeFile(filePath, buffer);
    return key;
  }

  async getSignedUrl(key: string): Promise<string> {
    // In development, return a fake signed URL that expires in 1 hour
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    return `${baseUrl}/api/storage/download/${key}?expires=${expires}&signature=fake-dev-signature`;
  }
}

export const storage = new LocalStorageProvider();