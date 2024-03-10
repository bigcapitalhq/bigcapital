import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query, body, param } from 'express-validator';
import Multer from 'multer';
import BaseController from '@/api/controllers/BaseController';
import { ServiceError } from '@/exceptions';
import { ImportResourceInjectable } from '@/services/Import/ImportResourceInjectable';
import { ImportResourceApplication } from '@/services/Import/ImportResourceApplication';

const upload = Multer({
  dest: './public/imports',
  limits: { fileSize: 5 * 1024 * 1024 },
});

@Service()
export class ImportController extends BaseController {
  @Inject()
  private importResourceApp: ImportResourceApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post(
      '/:import_id/import',
      this.asyncMiddleware(this.import.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/file',
      upload.single('file'),
      this.importValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.fileUpload.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:import_id/mapping',
      [
        param('import_id').exists().isString(),
        body('mapping').exists().isArray({ min: 1 }),
        body('mapping.*.from').exists(),
        body('mapping.*.to').exists(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.mapping.bind(this)),
      this.catchServiceErrors
    );
    // router.get(
    //   '/:import_id/preview',
    //   this.asyncMiddleware(this.preview.bind(this)),
    //   this.catchServiceErrors
    // );
    return router;
  }

  /**
   * Import validation schema.
   * @returns {ValidationSchema[]}
   */
  private get importValidationSchema() {
    return [
      body('resource').exists(),
    //   body('file').custom((value, { req }) => {
    //     if (!value) {
    //       throw new Error('File is required');
    //     }
    //     if (!['xlsx', 'csv'].includes(value.split('.').pop())) {
    //       throw new Error('File must be in xlsx or csv format');
    //     }
    //     return true;
    //   }),
    // ];
  }

  /**
   * Imports xlsx/csv to the given resource type.
   *
   * - Save the xlsx/csv file and give it a random name.
   * - Save the file metadata on the DB storage.
   * -
   *
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async fileUpload(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const data = await this.importResourceApp.import(
        tenantId,
        req.body.resource,
        req.file.path,
        req.file.filename
      );
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  private   async mapping(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;
    const body = this.matchedBodyData(req);

    try {
      await this.importResourceApp.mapping(tenantId, importId, body?.mapping);

      return res.status(200).send({
        id: importId,
        message: 'The given import sheet has mapped successfully.'
      })
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  private async preview(req: Request, res: Response, next: NextFunction) {}

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  private async import(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;

    try {
      await this.importResourceApp.process(tenantId, importId);

      return res.status(200).send({
        id: importId,
        message: 'Importing the uploaded file is importing.'
      });
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
    }
    next(error);
  }
}
