import { Service, Inject } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import { PaymentServicesApplication } from '@/services/PaymentServices/PaymentServicesApplication';

@Service()
export class PaymentServicesController extends BaseController {
  @Inject()
  private paymentServicesApp: PaymentServicesApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      asyncMiddleware(this.getPaymentServicesSpecificInvoice.bind(this))
    );
    return router;
  }

  /**
   * Retrieve accounts types list.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @return {Response}
   */
  private async getPaymentServicesSpecificInvoice(
    req: Request<{ invoiceId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      const paymentServices =
        await this.paymentServicesApp.getPaymentServicesForInvoice(tenantId);

      return res.status(200).send({ paymentServices });
    } catch (error) {
      next(error);
    }
  }
}
