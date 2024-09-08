import { NextFunction, Request, Response, Router } from 'express';
import { Service, Inject } from 'typedi';
import { StripePaymentService } from '@/services/StripePayment/StripePaymentService';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';

@Service()
export class StripeIntegrationController {
  @Inject()
  private stripePaymentService: StripePaymentService;

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
    try {
      const accountId = await this.stripePaymentService.createAccount();
      res.status(201).json({ accountId });
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
