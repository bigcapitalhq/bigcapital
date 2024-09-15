import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import { GetInvoicePaymentLinkMetadata } from '@/services/Sales/Invoices/GetInvoicePaymentLinkMetadata';

@Service()
export class PublicSharableLinkController extends BaseController {
  @Inject()
  private getSharableLinkMetaService: GetInvoicePaymentLinkMetadata;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/sharable-links/meta/invoice/:linkId',
      [param('linkId').exists()],
      this.validationResult,
      this.getPaymentLinkPublicMeta.bind(this),
      this.validationResult
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
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { linkId } = req.params;

    try {
      const data =
        await this.getSharableLinkMetaService.getInvoicePaymentLinkMeta(linkId);

      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }
}
