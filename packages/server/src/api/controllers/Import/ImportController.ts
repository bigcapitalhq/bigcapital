import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { defaultTo } from 'lodash';
import BaseController from '@/api/controllers/BaseController';
import { ServiceError } from '@/exceptions';
import { ImportResourceApplication } from '@/services/Import/ImportResourceApplication';
import { uploadImportFile } from './_utils';
import { parseJsonSafe } from '@/utils/parse-json-safe';

@Service()
export class ImportController extends BaseController {
  @Inject()
  private importResourceApp: ImportResourceApplication;

  /**
   * Router constructor method.
   */
  public router() {
    const router = Router();

    router.post(
      '/file',
      uploadImportFile.single('file'),
      this.importValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.fileUpload.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:import_id/import',
      this.asyncMiddleware(this.import.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:import_id/mapping',
      [
        param('import_id').exists().isString(),
        body('mapping').exists().isArray({ min: 1 }),
        body('mapping.*.group').optional(),
        body('mapping.*.from').exists(),
        body('mapping.*.to').exists(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.mapping.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/sample',
      [query('resource').exists(), query('format').optional()],
      this.validationResult,
      this.downloadImportSample.bind(this),
      this.catchServiceErrors
    );
    router.get(
      '/:import_id',
      this.asyncMiddleware(this.getImportFileMeta.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/:import_id/preview',
      this.asyncMiddleware(this.preview.bind(this)),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Import validation schema.
   * @returns {ValidationSchema[]}
   */
  private get importValidationSchema() {
    return [body('resource').exists(), body('params').optional()];
  }

  /**
   * Imports xlsx/csv to the given resource type.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async fileUpload(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const body = this.matchedBodyData(req);
    const params = defaultTo(parseJsonSafe(body.params), {});

    try {
      const data = await this.importResourceApp.import(
        tenantId,
        body.resource,
        req.file.filename,
        params
      );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Maps the columns of the imported file.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async mapping(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;
    const body = this.matchedBodyData(req);

    try {
      const mapping = await this.importResourceApp.mapping(
        tenantId,
        importId,
        body?.mapping
      );
      return res.status(200).send(mapping);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Preview the imported file before actual importing.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async preview(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;

    try {
      const preview = await this.importResourceApp.preview(tenantId, importId);

      return res.status(200).send(preview);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Importing the imported file to the application storage.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async import(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;

    try {
      const result = await this.importResourceApp.process(tenantId, importId);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the csv/xlsx sample sheet of the given resource name.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async downloadImportSample(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { format, resource } = this.matchedQueryData(req);

    try {
      const result = this.importResourceApp.sample(tenantId, resource, format);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the import file meta.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getImportFileMeta(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;

    try {
      const result = await this.importResourceApp.importMeta(
        tenantId,
        importId
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transforms service errors to response.
   * @param {Error}
   * @param {Request} req
   * @param {Response} res
   * @param {ServiceError} error
   */
  private catchServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'INVALID_MAP_ATTRS') {
        return res.status(400).send({
          errors: [{ type: 'INVALID_MAP_ATTRS' }],
        });
      }
      if (error.errorType === 'DUPLICATED_FROM_MAP_ATTR') {
        return res.status(400).send({
          errors: [{ type: 'DUPLICATED_FROM_MAP_ATTR' }],
        });
      }
      if (error.errorType === 'DUPLICATED_TO_MAP_ATTR') {
        return res.status(400).send({
          errors: [{ type: 'DUPLICATED_TO_MAP_ATTR' }],
        });
      }
      if (error.errorType === 'IMPORTED_FILE_EXTENSION_INVALID') {
        return res.status(400).send({
          errors: [{ type: 'IMPORTED_FILE_EXTENSION_INVALID' }],
        });
      }
    }
    next(error);
  }
}
