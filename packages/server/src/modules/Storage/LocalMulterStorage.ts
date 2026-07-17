import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { StorageEngine } from 'multer';

/**
 * Custom multer storage engine that writes uploads to the local filesystem
 * and sets `file.key` to `{orgId}/{uuid}` for compatibility with the
 * existing upload metadata service (which reads `file.key`).
 */
export class LocalMulterStorage implements StorageEngine {
  constructor(
    private readonly basePath: string,
    private readonly getOrganizationId: () => string,
  ) {}

  _handleFile(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, info?: Partial<Express.Multer.File>) => void,
  ) {
    const organizationId = this.getOrganizationId();
    if (!organizationId) {
      return cb(new Error('Tenant context required for upload.'));
    }

    const uuid = randomUUID();
    const key = `${organizationId}/${uuid}`;
    const dir = path.join(this.basePath, organizationId);
    const filePath = path.join(this.basePath, organizationId, uuid);

    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (err: any) {
      return cb(
        new Error(`Failed to create storage directory: ${err.message}`),
      );
    }

    const outStream = fs.createWriteStream(filePath);
    file.stream.pipe(outStream);

    outStream.on('error', (err) => {
      // Attempt cleanup on write failure.
      try {
        fs.unlinkSync(filePath);
      } catch {
        // Ignore cleanup errors.
      }
      cb(err);
    });

    outStream.on('finish', () => {
      cb(null, {
        size: outStream.bytesWritten,
        // Set `key` to match the multer-s3 convention so that
        // UploadDocument.ts can read `file.key` without changes.
        key,
        path: filePath,
      } as any);
    });
  }

  _removeFile(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ) {
    const filePath = (file as any).path;
    if (filePath) {
      fs.unlink(filePath, cb);
    } else {
      cb(null);
    }
  }
}
