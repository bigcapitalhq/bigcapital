import { NextFunction, Request, Response, Router } from 'express';
import { Service, Inject } from 'typedi';
import { StripePaymentService } from '@/services/StripePayment/StripePaymentService';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { StripeIntegrationApplication } from './StripeIntegrationApplication';

@Service()
export class StripeIntegrationController {
  @Inject()
  private stripePaymentService: StripePaymentService;

  @Inject()
  private stripeIntegrationApp: StripeIntegrationApplication;

  router() {
    const router = Router();

    router.post('/account', asyncMiddleware(this.createAccount.bind(this)));
    router.post(
      '/account_session',
      asyncMiddleware(this.createAccountSession.bind(this))
    );
    return router;
  }

  public async createAccount(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const accountId = await this.stripeIntegrationApp.createStripeAccount(
        tenantId
      );

      res
        .status(201)
        .json({
          accountId,
          message: 'The Stripe account has been created successfully.',
        });
    } catch (error) {
      next(error);
    }
  }

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
