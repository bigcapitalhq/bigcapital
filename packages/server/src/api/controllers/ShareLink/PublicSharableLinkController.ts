import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { PaymentLinksApplication } from '@/services/PaymentLinks/PaymentLinksApplication';

@Service()
export class PublicSharableLinkController extends BaseController {
  @Inject()
  private paymentLinkApp: PaymentLinksApplication;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/:paymentLinkId/invoice',
      [param('paymentLinkId').exists()],
      this.validationResult,
      this.getPaymentLinkPublicMeta.bind(this),
      this.validationResult
    );
    router.get(
      '/:paymentLinkId/invoice/pdf',
      [param('paymentLinkId').exists()],
      this.validationResult,
      this.getPaymentLinkInvoicePdf.bind(this),
      this.validationResult
    );
    router.post(
      '/:paymentLinkId/stripe_checkout_session',
      [param('paymentLinkId').exists()],
      this.validationResult,
      this.createInvoicePaymentLinkCheckoutSession.bind(this)
    );
    return router;
  }

  /**
   * Retrieves the payment link public meta.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  public async getPaymentLinkPublicMeta(
    req: Request<{ paymentLinkId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { paymentLinkId } = req.params;

    try {
      const data = await this.paymentLinkApp.getInvoicePaymentLink(
        paymentLinkId
      );

      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a Stripe checkout session for the given payment link id.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  public async createInvoicePaymentLinkCheckoutSession(
    req: Request<{ paymentLinkId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { paymentLinkId } = req.params;

    try {
      const session =
        await this.paymentLinkApp.createInvoicePaymentCheckoutSession(
          paymentLinkId
        );
      return res.status(200).send(session);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the sale invoice pdf of the given payment link.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getPaymentLinkInvoicePdf(
    req: Request<{ paymentLinkId: string }>,
    res: Response,
    next: NextFunction
  ) {
    const { paymentLinkId } = req.params;

    try {
      const [pdfContent, filename] =
        await this.paymentLinkApp.getPaymentLinkInvoicePdf(paymentLinkId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(pdfContent);
    } catch (error) {
      next(error);
    }
  }
}
