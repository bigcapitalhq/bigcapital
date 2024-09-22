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
    router.get('/:paymentServiceId', this.getPaymentService.bind(this));
    router.post(
      '/:paymentMethodId',
      [
        param('paymentMethodId').exists(),

        body('name').optional().isString(),
        body('options.bank_account_id').optional().isNumeric(),
        body('options.clearing_account_id').optional().isNumeric(),
      ],
      this.validationResult,
      asyncMiddleware(this.updatePaymentMethod.bind(this))
    );
    router.delete(
      '/:paymentMethodId',
      [param('paymentMethodId').exists()],
      this.validationResult,
      this.deletePaymentMethod.bind(this)
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
   * Retrieves a specific payment service.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   * @param {NextFunction} next - Next function.
   * @return {Promise<Response | void>}
   */
  private async getPaymentService(
    req: Request<{ paymentServiceId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { paymentServiceId } = req.params;

    try {
      const paymentService = await this.paymentServicesApp.getPaymentService(
        tenantId,
        paymentServiceId
      );

      return res.status(200).send({ data: paymentService });
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

  /**
   * Deletes the given payment method.
   * @param {Request<{ paymentMethodId: number }>} req - Request.
   * @param {Response} res - Response.
   * @param {NextFunction} next - Next function.
   * @return {Promise<Response | void>}
   */
  private async deletePaymentMethod(
    req: Request<{ paymentMethodId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { paymentMethodId } = req.params;

    try {
      await this.paymentServicesApp.deletePaymentMethod(
        tenantId,
        paymentMethodId
      );
      return res.status(204).send({
        id: paymentMethodId,
        message: 'The payment method has been deleted.',
      });
    } catch (error) {
      next(error);
    }
  }
}
