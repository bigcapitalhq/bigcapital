import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AbilitySubject, PaymentReceiveAction } from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { GenerateShareLink } from '@/services/Sales/Invoices/GenerateeInvoicePaymentLink';

@Service()
export class ShareLinkController extends BaseController {
  @Inject()
  private generateShareLinkService: GenerateShareLink;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/payment-links/generate',
      CheckPolicies(PaymentReceiveAction.Edit, AbilitySubject.PaymentReceive),
      [
        body('transaction_type').exists(),
        body('transaction_id').exists().isNumeric().toInt(),
        body('publicity').optional(),
        body('expiry_date').optional({ nullable: true }),
      ],
      this.validationResult,
      asyncMiddleware(this.generateShareLink.bind(this))
    );
    return router;
  }

  /**
   * Generates sharable link for the given transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async generateShareLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { transactionType, transactionId, publicity, expiryDate } =
      this.matchedBodyData(req);

    try {
      const link = await this.generateShareLinkService.generatePaymentLink(
        tenantId,
        transactionId,
        publicity,
        expiryDate
      );
      res.status(200).json({ link });
    } catch (error) {
      next(error);
    }
  }
}
