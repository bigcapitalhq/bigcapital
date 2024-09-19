import { NextFunction, Request, Response, Router } from 'express';
import { Service, Inject } from 'typedi';
import { StripePaymentService } from '@/services/StripePayment/StripePaymentService';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { StripeIntegrationApplication } from './StripeIntegrationApplication';
import { StripePaymentApplication } from '@/services/StripePayment/StripePaymentApplication';

@Service()
export class StripeIntegrationController {
  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private stripeIntegrationApp: StripeIntegrationApplication;

  @Inject()
  private stripePaymentApp: StripePaymentApplication;

  router() {
    const router = Router();

    router.post('/account', asyncMiddleware(this.createAccount.bind(this)));
    router.post(
      '/account_session',
      asyncMiddleware(this.createAccountSession.bind(this))
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
      const accountId = await this.stripeIntegrationApp.createStripeAccount(
        tenantId
      );

      res.status(201).json({
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
  public async createAccountSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { account } = req.body;
    try {
      const clientSecret = await this.stripePaymentService.createAccountSession(
        account
      );
      res.status(200).json({ clientSecret });
    } catch (error) {
      next(error);
    }
  }
}
