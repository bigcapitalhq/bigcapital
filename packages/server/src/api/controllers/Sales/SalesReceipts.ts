import { Router, Request, Response, NextFunction } from 'express';
import { body, check, param, query } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '../BaseController';
import {
  ISaleReceiptDTO,
  SaleReceiptMailOpts,
  SaleReceiptMailOptsDTO,
} from '@/interfaces/SaleReceipt';
import { ServiceError } from '@/exceptions';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, DiscountType, SaleReceiptAction } from '@/interfaces';
import { SaleReceiptApplication } from '@/services/Sales/Receipts/SaleReceiptApplication';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class SalesReceiptsController extends BaseController {
  @Inject()
  private saleReceiptsApplication: SaleReceiptApplication;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/:id/close',
      CheckPolicies(SaleReceiptAction.Edit, AbilitySubject.SaleReceipt),
      [...this.specificReceiptValidationSchema],
      this.validationResult,
      asyncMiddleware(this.closeSaleReceipt.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/notify-by-sms',
      CheckPolicies(SaleReceiptAction.NotifyBySms, AbilitySubject.SaleReceipt),
      [param('id').exists().isInt().toInt()],
      this.asyncMiddleware(this.saleReceiptNotifyBySms),
      this.handleServiceErrors
    );
    router.get(
      '/:id/sms-details',
      CheckPolicies(SaleReceiptAction.NotifyBySms, AbilitySubject.SaleReceipt),
      [param('id').exists().isInt().toInt()],
      this.saleReceiptSmsDetails,
      this.handleServiceErrors
    );
    router.post(
      '/:id/mail',
      [
        ...this.specificReceiptValidationSchema,
        body('subject').isString().optional(),

        body('from').isString().optional(),

        body('to').isArray().exists(),
        body('to.*').isString().isEmail().optional(),

        body('cc').isArray().optional({ nullable: true }),
        body('cc.*').isString().isEmail().optional(),

        body('bcc').isArray().optional({ nullable: true }),
        body('bcc.*').isString().isEmail().optional(),

        body('body').isString().optional(),
        body('attach_receipt').optional().isBoolean().toBoolean(),
      ],
      this.validationResult,
      asyncMiddleware(this.sendSaleReceiptMail.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id/mail',
      [...this.specificReceiptValidationSchema],
      this.validationResult,
      asyncMiddleware(this.getSaleReceiptMail.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(SaleReceiptAction.Edit, AbilitySubject.SaleReceipt),
      [
        ...this.specificReceiptValidationSchema,
        ...this.salesReceiptsValidationSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editSaleReceipt.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/',
      CheckPolicies(SaleReceiptAction.Create, AbilitySubject.SaleReceipt),
      this.salesReceiptsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.newSaleReceipt.bind(this)),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(SaleReceiptAction.Delete, AbilitySubject.SaleReceipt),
      this.specificReceiptValidationSchema,
      this.validationResult,
      asyncMiddleware(this.deleteSaleReceipt.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(SaleReceiptAction.View, AbilitySubject.SaleReceipt),
      this.listSalesReceiptsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getSalesReceipts.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse
    );
    router.get(
      '/state',
      CheckPolicies(SaleReceiptAction.View, AbilitySubject.SaleReceipt),
      asyncMiddleware(this.getSaleReceiptState.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(SaleReceiptAction.View, AbilitySubject.SaleReceipt),
      [...this.specificReceiptValidationSchema],
      this.validationResult,
      asyncMiddleware(this.getSaleReceipt.bind(this)),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Sales receipt validation schema.
   * @return {Array}
   */
  private get salesReceiptsValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('deposit_account_id').exists().isNumeric().toInt(),
      check('receipt_date').exists().isISO8601(),
      check('receipt_number').optional().trim(),
      check('reference_no').optional().trim(),
      check('closed').default(false).isBoolean().toBoolean(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').exists().isArray({ min: 1 }),

      check('entries.*.id').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.discount_type')
        .default(DiscountType.Percentage)
        .isString()
        .isIn([DiscountType.Percentage, DiscountType.Amount]),

      check('entries.*.description').optional({ nullable: true }).trim(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),

      check('receipt_message').optional().trim(),

      check('statement').optional().trim(),
      check('attachments').isArray().optional(),
      check('attachments.*.key').exists().isString(),

      // # Pdf template
      check('pdf_template_id').optional({ nullable: true }).isNumeric().toInt(),

      // # Discount
      check('discount').optional({ nullable: true }).isNumeric().toFloat(),
      check('discount_type')
        .optional({ nullable: true })
        .isString()
        .isIn([DiscountType.Percentage, DiscountType.Amount]),

      // # Adjustment
      check('adjustment').optional({ nullable: true }).isNumeric().toFloat(),
    ];
  }

  /**
   * Specific sale receipt validation schema.
   */
  private get specificReceiptValidationSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * List sales receipts validation schema.
   */
  private get listSalesReceiptsValidationSchema() {
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
   * Creates a new receipt.
   * @param {Request} req
   * @param {Response} res
   */
  private async newSaleReceipt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const saleReceiptDTO: ISaleReceiptDTO = this.matchedBodyData(req);

    try {
      // Store the given sale receipt details with associated entries.
      const storedSaleReceipt =
        await this.saleReceiptsApplication.createSaleReceipt(
          tenantId,
          saleReceiptDTO
        );
      return res.status(200).send({
        id: storedSaleReceipt.id,
        message: 'Sale receipt has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the sale receipt with associated entries and journal transactions.
   * @param {Request} req
   * @param {Response} res
   */
  private async deleteSaleReceipt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    try {
      // Deletes the sale receipt.
      await this.saleReceiptsApplication.deleteSaleReceipt(
        tenantId,
        saleReceiptId
      );
      return res.status(200).send({
        id: saleReceiptId,
        message: 'Sale receipt has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit the sale receipt details with associated entries and re-write
   * journal transaction on the same date.
   * @param {Request} req -
   * @param {Response} res -
   */
  private async editSaleReceipt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;
    const saleReceipt = this.matchedBodyData(req);

    try {
      // Update the given sale receipt details.
      await this.saleReceiptsApplication.editSaleReceipt(
        tenantId,
        saleReceiptId,
        saleReceipt
      );
      return res.status(200).send({
        id: saleReceiptId,
        message: 'Sale receipt has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks the given the sale receipt as closed.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async closeSaleReceipt(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    try {
      // Update the given sale receipt details.
      await this.saleReceiptsApplication.closeSaleReceipt(
        tenantId,
        saleReceiptId
      );
      return res.status(200).send({
        id: saleReceiptId,
        message: 'Sale receipt has been closed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listing sales receipts.
   * @param {Request} req
   * @param {Response} res
   */
  private async getSalesReceipts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    try {
      const salesReceiptsWithPagination =
        await this.saleReceiptsApplication.getSaleReceipts(tenantId, filter);

      return res.status(200).send(salesReceiptsWithPagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the sale receipt with associated entries.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getSaleReceipt(req: Request, res: Response) {
    const { id: saleReceiptId } = req.params;
    const { tenantId } = req;

    const accept = this.accepts(req);

    const acceptType = accept.types([
      ACCEPT_TYPE.APPLICATION_JSON,
      ACCEPT_TYPE.APPLICATION_PDF,
      ACCEPT_TYPE.APPLICATION_TEXT_HTML,
    ]);
    // Retrieves receipt in pdf format.
    if (ACCEPT_TYPE.APPLICATION_PDF == acceptType) {
      const [pdfContent, filename] =
        await this.saleReceiptsApplication.getSaleReceiptPdf(
          tenantId,
          saleReceiptId
        );
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(pdfContent);
      // Retrieves receipt in json format.
    } else if (ACCEPT_TYPE.APPLICATION_TEXT_HTML === acceptType) {
      const htmlContent = await this.saleReceiptsApplication.getSaleReceiptHtml(
        tenantId,
        saleReceiptId
      );
      res.send({ htmlContent });
    } else {
      const saleReceipt = await this.saleReceiptsApplication.getSaleReceipt(
        tenantId,
        saleReceiptId
      );
      return res.status(200).send({ saleReceipt });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getSaleReceiptState(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    // Retrieves receipt in pdf format.
    try {
      const data = await this.saleReceiptsApplication.getSaleReceiptState(
        tenantId
      );
      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sale receipt notification via SMS.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public saleReceiptNotifyBySms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: receiptId } = req.params;

    try {
      const saleReceipt =
        await this.saleReceiptsApplication.saleReceiptNotifyBySms(
          tenantId,
          receiptId
        );
      return res.status(200).send({
        id: saleReceipt.id,
        message:
          'The sale receipt notification via sms has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sale receipt sms details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public saleReceiptSmsDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: receiptId } = req.params;

    try {
      const smsDetails =
        await this.saleReceiptsApplication.getSaleReceiptSmsDetails(
          tenantId,
          receiptId
        );
      return res.status(200).send({
        data: smsDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sends mail notification of the given sale receipt.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public sendSaleReceiptMail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: receiptId } = req.params;
    const receiptMailDTO: SaleReceiptMailOptsDTO = this.matchedBodyData(req, {
      includeOptionals: false,
    });

    try {
      await this.saleReceiptsApplication.sendSaleReceiptMail(
        tenantId,
        receiptId,
        receiptMailDTO
      );
      return res.status(200).send({
        code: 200,
        message:
          'The sale receipt notification via sms has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves the default mail options of the given sale receipt.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public getSaleReceiptMail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: receiptId } = req.params;

    try {
      const data = await this.saleReceiptsApplication.getSaleReceiptMailState(
        tenantId,
        receiptId
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
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'SALE_RECEIPT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_RECEIPT_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'DEPOSIT_ACCOUNT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET', code: 300 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'NOT_SELL_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELL_ABLE_ITEMS', code: 600 }],
        });
      }
      if (error.errorType === 'SALE.RECEIPT.NOT.FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 700 }],
        });
      }
      if (error.errorType === 'DEPOSIT.ACCOUNT.NOT.EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 800 }],
        });
      }
      if (error.errorType === 'SALE_RECEIPT_NUMBER_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_RECEIPT_NUMBER_NOT_UNIQUE', code: 900 }],
        });
      }
      if (error.errorType === 'SALE_RECEIPT_IS_ALREADY_CLOSED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_RECEIPT_IS_ALREADY_CLOSED', code: 1000 }],
        });
      }
      if (error.errorType === 'SALE_RECEIPT_NO_IS_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'SALE_RECEIPT_NO_IS_REQUIRED',
              message: 'The sale receipt number is required.',
              code: 1100,
            },
          ],
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
