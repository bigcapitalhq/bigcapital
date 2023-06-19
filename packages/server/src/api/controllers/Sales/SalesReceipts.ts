import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import SaleReceiptService from '@/services/Sales/SalesReceipts';
import SaleReceiptsPdfService from '@/services/Sales/Receipts/SaleReceiptsPdfService';
import BaseController from '../BaseController';
import { ISaleReceiptDTO } from '@/interfaces/SaleReceipt';
import { ServiceError } from '@/exceptions';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import SaleReceiptNotifyBySms from '@/services/Sales/SaleReceiptNotifyBySms';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, SaleReceiptAction } from '@/interfaces';

@Service()
export default class SalesReceiptsController extends BaseController {
  @Inject()
  saleReceiptService: SaleReceiptService;

  @Inject()
  saleReceiptsPdf: SaleReceiptsPdfService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  saleReceiptSmsNotify: SaleReceiptNotifyBySms;

  /**
   * Router constructor.
   */
  router() {
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
  get salesReceiptsValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('deposit_account_id').exists().isNumeric().toInt(),
      check('receipt_date').exists().isISO8601(),
      check('receipt_number').optional().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('closed').default(false).isBoolean().toBoolean(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').exists().isArray({ min: 1 }),

      check('entries.*.id').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toInt(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('receipt_message').optional().trim().escape(),
      check('statement').optional().trim().escape(),
    ];
  }

  /**
   * Specific sale receipt validation schema.
   */
  get specificReceiptValidationSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * List sales receipts validation schema.
   */
  get listSalesReceiptsValidationSchema() {
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
  async newSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const saleReceiptDTO: ISaleReceiptDTO = this.matchedBodyData(req);

    try {
      // Store the given sale receipt details with associated entries.
      const storedSaleReceipt = await this.saleReceiptService.createSaleReceipt(
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
  async deleteSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    try {
      // Deletes the sale receipt.
      await this.saleReceiptService.deleteSaleReceipt(tenantId, saleReceiptId);

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
  async editSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;
    const saleReceipt = this.matchedBodyData(req);

    try {
      // Update the given sale receipt details.
      await this.saleReceiptService.editSaleReceipt(
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
  async closeSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    try {
      // Update the given sale receipt details.
      await this.saleReceiptService.closeSaleReceipt(tenantId, saleReceiptId);
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
  async getSalesReceipts(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { data, pagination, filterMeta } =
        await this.saleReceiptService.salesReceiptsList(tenantId, filter);

      const response = this.transformToResponse({
        data,
        pagination,
        filterMeta,
      });
      return res.status(200).send(response);
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
  async getSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { id: saleReceiptId } = req.params;
    const { tenantId } = req;

    try {
      const saleReceipt = await this.saleReceiptService.getSaleReceipt(
        tenantId,
        saleReceiptId
      );

      res.format({
        'application/json': () => {
          return res
            .status(200)
            .send(this.transformToResponse({ saleReceipt }));
        },
        'application/pdf': async () => {
          const pdfContent = await this.saleReceiptsPdf.saleReceiptPdf(
            tenantId,
            saleReceipt
          );
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfContent.length,
          });
          res.send(pdfContent);
        },
      });
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
      const saleReceipt = await this.saleReceiptSmsNotify.notifyBySms(
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
      const smsDetails = await this.saleReceiptSmsNotify.smsDetails(
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
