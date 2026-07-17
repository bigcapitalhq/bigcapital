import { NextFunction, Request, Response } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { StorageProvider } from '../Storage/StorageProvider';
import { STORAGE_PROVIDER } from '../Storage/Storage.module';

/**
 * Middleware to ensure that the configured storage provider is properly
 * set up before allowing uploads.
 *
 * Renamed from `S3UploadPipeline` — the `AttachmentUploadPipeline` export
 * name is kept as an alias for backward compatibility.
 */
@Injectable()
export class StorageUploadPipeline {
  constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,
  ) {}

  /**
   * Validates that the storage provider is properly configured.
   * Throws if required configuration is missing.
   * @param req The HTTP request object.
   * @param res The HTTP response object.
   * @param next The callback to pass control to the next middleware function.
   */
  public validateStorageConfigured(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    this.storageProvider.validate();
    next();
  }
}

/**
 * Backward-compatible alias for the original class name used in imports.
 */
export const AttachmentUploadPipeline = StorageUploadPipeline;
