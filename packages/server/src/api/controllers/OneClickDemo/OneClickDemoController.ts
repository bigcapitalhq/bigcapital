import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import { OneClickDemoApplication } from '@/services/OneClickDemo/OneClickDemoApplication';

@Service()
export class OneClickDemoController extends BaseController {
  @Inject()
  private oneClickDemoApp: OneClickDemoApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post('/one_click', asyncMiddleware(this.oneClickDemo.bind(this)));

    return router;
  }

  /**
   * One-click demo application.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async oneClickDemo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.oneClickDemoApp.createOneClick();

      return res.status(200).send({
        data,
        message: 'The one-click demo has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
