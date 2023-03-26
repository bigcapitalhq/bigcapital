import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import BaseController from '@/api/controllers/BaseController';
import MiscService from '@/services/Miscellaneous/MiscService';
import DateFormatsService from '@/services/Miscellaneous/DateFormats';

@Service()
export default class MiscController extends BaseController {
  @Inject()
  dateFormatsService: DateFormatsService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.get(
      '/date_formats',
      this.validationResult,
      this.asyncMiddleware(this.dateFormats.bind(this))
    );
    return router;
  }

  /**
   * Retrieve date formats options.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  dateFormats(req: Request, res: Response, next: NextFunction) {
    try {
      const dateFormats = this.dateFormatsService.getDateFormats();

      return res.status(200).send({ data: dateFormats });
    } catch (error) {
      next(error);
    }
  }
}
