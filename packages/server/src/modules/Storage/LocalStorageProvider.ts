import * as fs from 'node:fs';
import * as path from 'node:path';
import { StorageEngine } from 'multer';
import { ConfigService } from '@nestjs/config';
import {
  StorageProvider,
  StorageGetResult,
  PresignedUrlOptions,
} from './StorageProvider';
import { LocalMulterStorage } from './LocalMulterStorage';

/**
 * Local-filesystem-backed storage provider. Stores files at
 * `{basePath}/{orgId}/{uuid}` and serves them through the existing
 * authenticated API endpoints.
 */
export class LocalStorageProvider extends StorageProvider {
  private readonly basePath: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.basePath = this.configService.get<string>(
      'storage.localPath',
      '/data/attachments',
    );
  }

  /**
   * Creates a local-disk multer storage engine that writes files to
   * `{basePath}/{orgId}/{uuid}` and sets `file.key` for downstream
   * compatibility with the upload metadata service.
   */
  createMulterStorage(getOrganizationId: () => string): StorageEngine {
    return new LocalMulterStorage(this.basePath, getOrganizationId);
  }

  /**
   * Reads a file from the local filesystem.
   */
  async getObject(key: string): Promise<StorageGetResult> {
    const filePath = path.join(this.basePath, key);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Attachment file not found: ${key}`);
    }
    const body = await fs.promises.readFile(filePath);

    return { body };
  }

  /**
   * Returns the authenticated API endpoint path for downloading the file.
   * Local storage has no pre-signing concept — files are served through
   * the normal authenticated `GET /attachments/:id` endpoint.
   */
  async getPresignedUrl(
    key: string,
    options?: PresignedUrlOptions,
  ): Promise<string> {
    return `/attachments/${key}`;
  }

  /**
   * Deletes a file from the local filesystem.
   */
  async deleteObject(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);

    try {
      await fs.promises.unlink(filePath);
    } catch (err: any) {
      // Tolerate missing files — the DB record will still be cleaned up.
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
    // Clean up the org directory if it's now empty.
    const dir = path.dirname(filePath);
    try {
      const remaining = await fs.promises.readdir(dir);
      if (remaining.length === 0) {
        await fs.promises.rmdir(dir);
      }
    } catch {
      // Non-critical; ignore cleanup failures.
    }
  }

  /**
   * Validates that the local storage path exists and is writable.
   */
  validate(): void {
    if (!fs.existsSync(this.basePath)) {
      try {
        fs.mkdirSync(this.basePath, { recursive: true });
      } catch (err: any) {
        throw new Error(
          `Local storage path "${this.basePath}" does not exist and could not be created: ${err.message}`,
        );
      }
    }
    try {
      fs.accessSync(this.basePath, fs.constants.W_OK | fs.constants.R_OK);
    } catch {
      throw new Error(
        `Local storage path "${this.basePath}" is not readable/writable`,
      );
    }
  }
}
