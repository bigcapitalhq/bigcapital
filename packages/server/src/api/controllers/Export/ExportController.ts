import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { ServiceError } from '@/exceptions';
import { ExportApplication } from '@/services/Export/ExportApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';
import { convertAcceptFormatToFormat } from './_utils';

@Service()
export class ExportController extends BaseController {
  @Inject()
  private exportResourceApp: ExportApplication;

  /**
   * Router constructor method.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      [
        query('resource').exists(),
        query('format').isIn(['csv', 'xlsx']).optional(),
      ],
      this.validationResult,
      this.export.bind(this),
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
      const applicationFormat = convertAcceptFormatToFormat(acceptType);

      const data = await this.exportResourceApp.export(
        tenantId,
        query.resource,
        applicationFormat
      );
      // Retrieves the csv format.
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
        //
      } else if (ACCEPT_TYPE.APPLICATION_PDF === acceptType) {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': data.length,
        });
        res.send(data);
      }
    } catch (error) {
      next(error);
    }
  }
}
