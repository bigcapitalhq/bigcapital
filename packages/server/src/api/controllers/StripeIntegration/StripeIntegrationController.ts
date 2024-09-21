import { NextFunction, Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Service, Inject } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { StripePaymentApplication } from '@/services/StripePayment/StripePaymentApplication';
import BaseController from '../BaseController';

@Service()
export class StripeIntegrationController extends BaseController {
  @Inject()
  private stripePaymentApp: StripePaymentApplication;

  public router() {
    const router = Router();

    router.post('/account', asyncMiddleware(this.createAccount.bind(this)));
    router.post(
      '/account_link',
      [body('stripe_account_id').exists()],
      this.validationResult,
      asyncMiddleware(this.createAccountLink.bind(this))
    );
    router.post(
      '/:linkId/create_checkout_session',
      this.createCheckoutSession.bind(this)
    );
    return router;
  }

  /**
   * Creates a Stripe checkout session for the given payment link id.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response|void>}
   */
  public async createCheckoutSession(
    req: Request<{ linkId: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { linkId } = req.params;
    const { tenantId } = req;

    try {
      const session =
        await this.stripePaymentApp.createSaleInvoiceCheckoutSession(
          tenantId,
          linkId
        );
      return res.status(200).send(session);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new Stripe account.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   * @returns {Promise<void>}
   */
  public async createAccount(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const accountId = await this.stripePaymentApp.createStripeAccount(
        tenantId
      );
      return res.status(201).json({
        accountId,
        message: 'The Stripe account has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new Stripe account session.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   * @returns {Promise<void>}
   */
  public async createAccountLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { stripeAccountId } = this.matchedBodyData(req);

    try {
      const clientSecret = await this.stripePaymentApp.createAccountLink(
        tenantId,
        stripeAccountId
      );
      return res.status(200).json({ clientSecret });
    } catch (error) {
      next(error);
    }
  }
}
