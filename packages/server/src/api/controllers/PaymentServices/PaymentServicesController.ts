import { Service, Inject } from 'typedi';
import { Request, Response, Router, NextFunction } from 'express';
import { body, param } from 'express-validator';
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
    router.get('/state', this.getPaymentMethodsState.bind(this));
    router.post(
      '/:paymentMethodId',
      [
        param('paymentMethodId').exists(),
        body('name').optional().isString(),
        body('options.bankAccountId').optional().isNumeric(),
        body('options.clearningAccountId').optional().isNumeric(),
        body('options.showVisa').optional().isBoolean(),
        body('options.showMasterCard').optional().isBoolean(),
        body('options.showDiscover').optional().isBoolean(),
        body('options.showAmer').optional().isBoolean(),
        body('options.showJcb').optional().isBoolean(),
        body('options.showDiners').optional().isBoolean(),
      ],
      this.validationResult,
      asyncMiddleware(this.updatePaymentMethod.bind(this))
    );

    return router;
  }

  /**
   * Retrieve accounts types list.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @return {Promise<Response | void>}
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

  /**
   * Edits the given payment method settings.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @return {Promise<Response | void>}
   */
  private async updatePaymentMethod(
    req: Request<{ paymentMethodId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { paymentMethodId } = req.params;
    const updatePaymentMethodDTO = this.matchedBodyData(req);

    try {
      await this.paymentServicesApp.editPaymentMethod(
        tenantId,
        paymentMethodId,
        updatePaymentMethodDTO
      );
      return res.status(200).send({
        id: paymentMethodId,
        message: 'The given payment method has been updated.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the payment state providing state.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @param {NextFunction} next - Next function.
   * @return {Promise<Response | void>}
   */
  private async getPaymentMethodsState(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      const paymentMethodsState =
        await this.paymentServicesApp.getPaymentMethodsState(tenantId);

      return res.status(200).send({ data: paymentMethodsState });
    } catch (error) {
      next(error);
    }
  }
}
