import { StorageEngine } from 'multer';

export interface StorageGetResult {
  body: Buffer;
  contentType?: string;
}

export interface PresignedUrlOptions {
  originalName?: string;
  expiresIn?: number;
}

/**
 * Abstract storage provider that decouples file operations from a specific
 * backend (S3, local filesystem, etc.).
 */
export abstract class StorageProvider {
  /**
   * Creates a multer storage engine suitable for this provider.
   * @param getOrganizationId - Callback that returns the current tenant's org ID from the CLS context.
   */
  abstract createMulterStorage(
    getOrganizationId: () => string,
  ): StorageEngine;

  /**
   * Retrieves a stored object by key.
   * @param key - The storage key (e.g. `{orgId}/{uuid}`).
   */
  abstract getObject(key: string): Promise<StorageGetResult>;

  /**
   * Returns a URL for downloading the given object.
   * For S3 this is a time-limited presigned URL; for local storage this is
   * the authenticated API endpoint path.
   * @param key - The storage key.
   * @param options - Optional settings (original filename, expiry).
   */
  abstract getPresignedUrl(
    key: string,
    options?: PresignedUrlOptions,
  ): Promise<string>;

  /**
   * Permanently deletes the stored object.
   * @param key - The storage key.
   */
  abstract deleteObject(key: string): Promise<void>;

  /**
   * Validates that the provider is properly configured.
   * Throws if required configuration is missing.
   */
  abstract validate(): void;
}
