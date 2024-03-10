import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
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
  private importResource: ImportResourceInjectable;

  @Inject()
  private importResourceApp: ImportResourceApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    // router.post(
    //   '/:import_id/import',
    //   this.asyncMiddleware(this.import.bind(this)),
    //   this.catchServiceErrors
    // );
    router.post(
      '/file',
      // [...this.importValidationSchema],
      upload.single('file'),
      this.asyncMiddleware(this.fileUpload.bind(this))
      // this.catchServiceErrors
    );
    // router.post(
    //   '/:import_id/mapping',
    //   this.asyncMiddleware(this.mapping.bind(this)),
    //   this.catchServiceErrors
    // );
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
  get importValidationSchema() {
    return [query('resource').exists().isString().toString()];
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
  async mapping(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      await this.importResource.mapping(tenantId);
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
  async preview(req: Request, res: Response, next: NextFunction) {}

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async import(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { import_id: importId } = req.params;

    try {
      await this.importResource.importFile(tenantId, importId);

      return res.status(200).send({});
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
