import { Inject, Service } from 'typedi';
import { Router, NextFunction, Response } from 'express';
import { check } from 'express-validator';
import { Request } from 'express-validator/src/base';
import EasySmsIntegration from '@/services/SmsIntegration/EasySmsIntegration';
import BaseController from '../BaseController';

@Service()
export default class EasySmsIntegrationController extends BaseController {
  @Inject()
  easySmsIntegrationService: EasySmsIntegration;

  /**
   * Controller router.
   */
  public router = () => {
    const router = Router();

    router.post(
      '/easysms/integrate',
      [check('token').exists()],
      this.integrationEasySms
    );
    router.post(
      '/easysms/disconnect',
      this.disconnectEasysms
    )
    router.get('/easysms', this.getIntegrationMeta);

    return router;
  };

  /**
   * Easysms integration API.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - Next function.
   */
  private integrationEasySms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const easysmsIntegrateDTO = this.matchedBodyData(req);

    try {
      await this.easySmsIntegrationService.integrate(
        tenantId,
        easysmsIntegrateDTO
      );
      return res.status(200).send({
        message:
          'The system has been integrated with Easysms sms gateway successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the Easysms integration meta.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private getIntegrationMeta = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      const data = await this.easySmsIntegrationService.getIntegrationMeta(
        tenantId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  private disconnectEasysms = async (
    req: Request,
    res: Response,
    next: NextFunction    
  ) => {
    const { tenantId } = req;

    try {
      await this.easySmsIntegrationService.disconnect(
        tenantId,
      );
      return res.status(200).send({
        message: 'The sms gateway integration has been disconnected successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
