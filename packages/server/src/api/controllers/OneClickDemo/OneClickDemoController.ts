import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { body } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import { OneClickDemoApplication } from '@/services/OneClickDemo/OneClickDemoApplication';
import config from '@/config';
@Service()
export class OneClickDemoController extends BaseController {
  @Inject()
  private oneClickDemoApp: OneClickDemoApplication;

  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    // Protects the endpoints if the feature is not enabled.
    const protectMiddleware = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      // Add your protection logic here
      if (config.oneClickDemoAccounts) {
        next();
      } else {
        res.status(403).send({ message: 'Forbidden' });
      }
    };
    router.post(
      '/one_click',
      protectMiddleware,
      asyncMiddleware(this.oneClickDemo.bind(this))
    );
    router.post(
      '/one_click_signin',
      [body('demo_id').exists()],
      this.validationResult,
      protectMiddleware,
      asyncMiddleware(this.oneClickSignIn.bind(this))
    );
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

  /**
   * Sign-in to one-click demo account.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async oneClickSignIn(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { demoId } = this.matchedBodyData(req);

    try {
      const data = await this.oneClickDemoApp.autoSignIn(demoId);

      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
}
