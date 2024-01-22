import { Router, Request, Response, NextFunction } from 'express';
import { body, check, param, query } from 'express-validator';
import { Inject, Service } from 'typedi';
import {
  AbilitySubject,
  ISaleEstimateDTO,
  SaleEstimateAction,
  SaleEstimateMailOptionsDTO,
} from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { SaleEstimatesApplication } from '@/services/Sales/Estimates/SaleEstimatesApplication';

const ACCEPT_TYPE = {
  APPLICATION_PDF: 'application/pdf',
  APPLICATION_JSON: 'application/json',
};
@Service()
export default class SalesEstimatesController extends BaseController {
  @Inject()
  private saleEstimatesApplication: SaleEstimatesApplication;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(SaleEstimateAction.Create, AbilitySubject.SaleEstimate),
      [...this.estimateValidationSchema],
      this.validationResult,
      asyncMiddleware(this.newEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/deliver',
      CheckPolicies(SaleEstimateAction.Edit, AbilitySubject.SaleEstimate),
      [...this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.deliverSaleEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/approve',
      CheckPolicies(SaleEstimateAction.Edit, AbilitySubject.SaleEstimate),
      [this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.approveSaleEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/reject',
      CheckPolicies(SaleEstimateAction.Edit, AbilitySubject.SaleEstimate),
      [this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.rejectSaleEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id/sms-details',
      CheckPolicies(
        SaleEstimateAction.NotifyBySms,
        AbilitySubject.SaleEstimate
      ),
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.saleEstimateSmsDetails),
      this.handleServiceErrors
    );
    router.post(
      '/:id/notify-by-sms',
      CheckPolicies(
        SaleEstimateAction.NotifyBySms,
        AbilitySubject.SaleEstimate
      ),
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.saleEstimateNotifyBySms),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(SaleEstimateAction.Edit, AbilitySubject.SaleEstimate),
      [
        ...this.validateSpecificEstimateSchema,
        ...this.estimateValidationSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(SaleEstimateAction.Delete, AbilitySubject.SaleEstimate),
      [this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.deleteEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(SaleEstimateAction.View, AbilitySubject.SaleEstimate),
      this.validateSpecificEstimateSchema,
      this.validationResult,
      asyncMiddleware(this.getEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(SaleEstimateAction.View, AbilitySubject.SaleEstimate),
      this.validateEstimateListSchema,
      this.validationResult,
      asyncMiddleware(this.getEstimates.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse
    );
    router.post(
      '/:id/mail',
      [
        ...this.validateSpecificEstimateSchema,
        body('subject').isString().optional(),
        body('from').isString().optional(),
        body('to').isString().optional(),
        body('body').isString().optional(),
        body('attach_invoice').optional().isBoolean().toBoolean(),
      ],
      this.validationResult,
      asyncMiddleware(this.sendSaleEstimateMail.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id/mail',
      [...this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.getSaleEstimateMail.bind(this)),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Estimate validation schema.
   */
  private get estimateValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('estimate_date').exists().isISO8601().toDate(),
      check('expiration_date').exists().isISO8601().toDate(),
      check('reference').optional(),
      check('estimate_number').optional().trim().escape(),
      check('delivered').default(false).isBoolean().toBoolean(),

      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),

      check('note').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),
      check('send_to_email').optional().trim().escape(),
    ];
  }

  /**
   * Specific sale estimate validation schema.
   */
  private get validateSpecificEstimateSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Sales estimates list validation schema.
   */
  private get validateEstimateListSchema() {
    return [
      query('view_slug').optional().isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Handle create a new estimate with associated entries.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response} res -
   */
  private async newEstimate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const estimateDTO: ISaleEstimateDTO = this.matchedBodyData(req);

    try {
      const storedEstimate =
        await this.saleEstimatesApplication.createSaleEstimate(
          tenantId,
          estimateDTO
        );

      return res.status(200).send({
        id: storedEstimate.id,
        message: 'The sale estimate has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle update estimate details with associated entries.
   * @param {Request} req
   * @param {Response} res
   */
  private async editEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;
    const estimateDTO: ISaleEstimateDTO = this.matchedBodyData(req);

    try {
      // Update estimate with associated estimate entries.
      await this.saleEstimatesApplication.editSaleEstimate(
        tenantId,
        estimateId,
        estimateDTO
      );
      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given estimate with associated entries.
   * @param {Request} req
   * @param {Response} res
   */
  private async deleteEstimate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimatesApplication.deleteSaleEstimate(
        tenantId,
        estimateId
      );
      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deliver the given sale estimate.
   * @param {Request} req
   * @param {Response} res
   */
  private async deliverSaleEstimate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimatesApplication.deliverSaleEstimate(
        tenantId,
        estimateId
      );
      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been delivered successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks the sale estimate as approved.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async approveSaleEstimate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimatesApplication.approveSaleEstimate(
        tenantId,
        estimateId
      );
      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been approved successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks the sale estimate as rejected.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async rejectSaleEstimate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimatesApplication.rejectSaleEstimate(
        tenantId,
        estimateId
      );
      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been rejected successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the given estimate with associated entries.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    const accept = this.accepts(req);

    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_PDF,
    ]);
    // Retrieves estimate in pdf format.
    if (ACCEPT_TYPE.APPLICATION_PDF == acceptType) {
      const pdfContent = await this.saleEstimatesApplication.getSaleEstimatePdf(
        tenantId,
        estimateId
      );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves estimates in json format.
    } else {
      const estimate = await this.saleEstimatesApplication.getSaleEstimate(
        tenantId,
        estimateId
      );
      return res.status(200).send({ estimate });
    }
  }

  /**
   * Retrieve estimates with pagination metadata.
   * @param {Request} req
   * @param {Response} res
   */
  private async getEstimates(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    try {
      const salesEstimatesWithPagination =
        await this.saleEstimatesApplication.getSaleEstimates(tenantId, filter);

      return res.status(200).send(salesEstimatesWithPagination);
    } catch (error) {
      next(error);
    }
  }

  private saleEstimateNotifyBySms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: estimateId } = req.params;

    try {
      const saleEstimate =
        await this.saleEstimatesApplication.notifySaleEstimateBySms(
          tenantId,
          estimateId
        );
      return res.status(200).send({
        id: saleEstimate.id,
        message:
          'The sale estimate sms notification has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the sale estimate sms notification message details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private saleEstimateSmsDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: estimateId } = req.params;

    try {
      const estimateSmsDetails =
        await this.saleEstimatesApplication.getSaleEstimateSmsDetails(
          tenantId,
          estimateId
        );
      return res.status(200).send({
        data: estimateSmsDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Send the sale estimate mail.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private sendSaleEstimateMail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;
    const saleEstimateDTO: SaleEstimateMailOptionsDTO = this.matchedBodyData(
      req,
      {
        includeOptionals: false,
      }
    );
    try {
      await this.saleEstimatesApplication.sendSaleEstimateMail(
        tenantId,
        invoiceId,
        saleEstimateDTO
      );
      return res.status(200).send({
        code: 200,
        message: 'The sale estimate mail has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves the default mail options of the given sale estimate.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getSaleEstimateMail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;

    try {
      const data = await this.saleEstimatesApplication.getSaleEstimateMail(
        tenantId,
        invoiceId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 100 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES.IDS.NOT.EXISTS', code: 200 }],
        });
      }
      if (error.errorType === 'ITEMS_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 }],
        });
      }
      if (error.errorType === 'NOT_PURCHASE_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_PURCHASABLE_ITEMS', code: 400 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_NOT_FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'CUSTOMER_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 600 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NUMBER_EXISTANCE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE', code: 700 }],
        });
      }
      if (error.errorType === 'NOT_SELL_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELL_ABLE_ITEMS', code: 800 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_ALREADY_APPROVED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 1000 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NOT_DELIVERED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_NOT_DELIVERED', code: 1100 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_ALREADY_REJECTED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_ALREADY_REJECTED', code: 1200 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 1300 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NO_IS_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_NO_IS_REQUIRED', code: 1400 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_CONVERTED_TO_INVOICE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_CONVERTED_TO_INVOICE', code: 1500 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_ALREADY_DELIVERED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_ALREADY_DELIVERED', code: 1600 }],
        });
      }
      if (error.errorType === 'CUSTOMER_HAS_NO_PHONE_NUMBER') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_HAS_NO_PHONE_NUMBER', code: 1800 }],
        });
      }
      if (error.errorType === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID', code: 1900 }],
        });
      }
      if (error.errorType === 'TRANSACTIONS_DATE_LOCKED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'TRANSACTIONS_DATE_LOCKED',
              code: 4000,
              data: { ...error.payload },
            },
          ],
        });
      }
      if (error.errorType === 'WAREHOUSE_ID_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'WAREHOUSE_ID_NOT_FOUND', code: 5000 }],
        });
      }
      if (error.errorType === 'BRANCH_ID_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'BRANCH_ID_REQUIRED', code: 5100 }],
        });
      }
      if (error.errorType === 'BRANCH_ID_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'BRANCH_ID_NOT_FOUND', code: 5300 }],
        });
      }
    }
    next(error);
  }
}
