import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { ServiceError } from '@/exceptions';
import { ExportApplication } from '@/services/Export/ExportApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export class ExportController extends BaseController {
  @Inject()
  private exportResourceApp: ExportApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      [
        query('resource').exists(),
        query('format').isIn(['csv', 'xlsx']).optional(),
      ],
      this.validationResult,
      this.export.bind(this),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * Imports xlsx/csv to the given resource type.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async export(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const query = this.matchedQueryData(req);

    try {
      const accept = this.accepts(req);

      const acceptType = accept.types([
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_PDF,
      ]);
      const data = await this.exportResourceApp.export(
        tenantId,
        query.resource,
        acceptType === ACCEPT_TYPE.APPLICATION_XLSX ? 'xlsx' : 'csv'
      );
      if (ACCEPT_TYPE.APPLICATION_CSV === acceptType) {
        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(data);
        // Retrieves the xlsx format.
      } else if (ACCEPT_TYPE.APPLICATION_XLSX === acceptType) {
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(data);
      }
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
      return res.status(400).send({
        errors: [{ type: error.errorType }],
      });
    }

    next(error);
  }
}
