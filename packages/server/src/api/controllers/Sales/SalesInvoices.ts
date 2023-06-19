import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import BaseController from '../BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import SaleInvoiceService from '@/services/Sales/SalesInvoices';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import {
  ISaleInvoiceDTO,
  ISaleInvoiceCreateDTO,
  SaleInvoiceAction,
  AbilitySubject,
} from '@/interfaces';
import SaleInvoicePdf from '@/services/Sales/SaleInvoicePdf';
import SaleInvoiceWriteoff from '@/services/Sales/SaleInvoiceWriteoff';
import SaleInvoiceNotifyBySms from '@/services/Sales/SaleInvoiceNotifyBySms';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import InvoicePaymentsService from '@/services/Sales/Invoices/InvoicePaymentsService';

const ACCEPT_TYPE = {
  APPLICATION_PDF: 'application/pdf',
  APPLICATION_JSON: 'application/json',
};
@Service()
export default class SaleInvoicesController extends BaseController {
  @Inject()
  saleInvoiceService: SaleInvoiceService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  saleInvoicePdf: SaleInvoicePdf;

  @Inject()
  saleInvoiceWriteoff: SaleInvoiceWriteoff;

  @Inject()
  saleInvoiceSmsNotify: SaleInvoiceNotifyBySms;

  @Inject()
  invoicePaymentsService: InvoicePaymentsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(SaleInvoiceAction.Create, AbilitySubject.SaleInvoice),
      [
        ...this.saleInvoiceValidationSchema,
        check('from_estimate_id').optional().isNumeric().toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.newSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/deliver',
      CheckPolicies(SaleInvoiceAction.Edit, AbilitySubject.SaleInvoice),
      [...this.specificSaleInvoiceValidation],
      this.validationResult,
      asyncMiddleware(this.deliverSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/writeoff',
      CheckPolicies(SaleInvoiceAction.Writeoff, AbilitySubject.SaleInvoice),
      [
        param('id').exists().isInt().toInt(),

        check('expense_account_id').exists().isInt().toInt(),
        check('reason').exists().trim(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.writeoffSaleInvoice),
      this.handleServiceErrors
    );
    router.post(
      '/:id/writeoff/cancel',
      CheckPolicies(SaleInvoiceAction.Writeoff, AbilitySubject.SaleInvoice),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.cancelWrittenoffSaleInvoice),
      this.handleServiceErrors
    );
    router.post(
      '/:id/notify-by-sms',
      CheckPolicies(SaleInvoiceAction.NotifyBySms, AbilitySubject.SaleInvoice),
      [
        param('id').exists().isInt().toInt(),
        check('notification_key').exists().isIn(['details', 'reminder']),
      ],
      this.validationResult,
      this.asyncMiddleware(this.saleInvoiceNotifyBySms),
      this.handleServiceErrors
    );
    router.get(
      '/:id/sms-details',
      CheckPolicies(SaleInvoiceAction.NotifyBySms, AbilitySubject.SaleInvoice),
      [
        param('id').exists().isInt().toInt(),
        query('notification_key').exists().isIn(['details', 'reminder']),
      ],
      this.validationResult,
      this.asyncMiddleware(this.saleInvoiceSmsDetails),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(SaleInvoiceAction.Edit, AbilitySubject.SaleInvoice),
      [
        ...this.saleInvoiceValidationSchema,
        ...this.specificSaleInvoiceValidation,
      ],
      this.validationResult,
      asyncMiddleware(this.editSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(SaleInvoiceAction.Delete, AbilitySubject.SaleInvoice),
      this.specificSaleInvoiceValidation,
      this.validationResult,
      asyncMiddleware(this.deleteSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/payable',
      CheckPolicies(SaleInvoiceAction.View, AbilitySubject.SaleInvoice),
      [...this.dueSalesInvoicesListValidationSchema],
      this.validationResult,
      asyncMiddleware(this.getPayableInvoices.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id/payment-transactions',
      [param('id').exists().isString()],
      this.validationResult,
      this.asyncMiddleware(this.getInvoicePaymentTransactions),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(SaleInvoiceAction.View, AbilitySubject.SaleInvoice),
      this.specificSaleInvoiceValidation,
      this.validationResult,
      asyncMiddleware(this.getSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(SaleInvoiceAction.View, AbilitySubject.SaleInvoice),
      this.saleInvoiceListValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getSalesInvoices.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse
    );
    return router;
  }

  /**
   * Sale invoice validation schema.
   */
  get saleInvoiceValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('invoice_date').exists().isISO8601().toDate(),
      check('due_date').exists().isISO8601().toDate(),
      check('invoice_no').optional().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('delivered').default(false).isBoolean().toBoolean(),

      check('invoice_message').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),

      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
      check('project_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').exists().isArray({ min: 1 }),

      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.project_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),

      check('entries.*.project_ref_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.project_ref_type')
        .optional({ nullable: true })
        .isString()
        .toUpperCase()
        .isIn(['TASK', 'BILL', 'EXPENSE']),
      check('entries.*.project_ref_invoiced_amount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
    ];
  }

  /**
   * Specific sale invoice validation schema.
   */
  get specificSaleInvoiceValidation() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Sales invoices list validation schema.
   */
  get saleInvoiceListValidationSchema() {
    return [
      query('view_slug').optional({ nullable: true }).isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Due sale invoice list validation schema.
   */
  get dueSalesInvoicesListValidationSchema() {
    return [query('customer_id').optional().isNumeric().toInt()];
  }

  /**
   * Creates a new sale invoice.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async newSaleInvoice(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const saleInvoiceDTO: ISaleInvoiceCreateDTO = this.matchedBodyData(req);

    try {
      // Creates a new sale invoice with associated entries.
      const storedSaleInvoice = await this.saleInvoiceService.createSaleInvoice(
        tenantId,
        saleInvoiceDTO,
        user
      );
      return res.status(200).send({
        id: storedSaleInvoice.id,
        message: 'The sale invoice has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit sale invoice details.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async editSaleInvoice(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: saleInvoiceId } = req.params;
    const saleInvoiceOTD: ISaleInvoiceDTO = this.matchedBodyData(req);

    try {
      // Update the given sale invoice details.
      await this.saleInvoiceService.editSaleInvoice(
        tenantId,
        saleInvoiceId,
        saleInvoiceOTD,
        user
      );
      return res.status(200).send({
        id: saleInvoiceId,
        message: 'The sale invoice has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deliver the given sale invoice.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async deliverSaleInvoice(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: saleInvoiceId } = req.params;

    try {
      await this.saleInvoiceService.deliverSaleInvoice(
        tenantId,
        saleInvoiceId,
        user
      );
      return res.status(200).send({
        id: saleInvoiceId,
        message: 'The given sale invoice has been delivered successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the sale invoice with associated entries and journal transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async deleteSaleInvoice(req: Request, res: Response, next: NextFunction) {
    const { id: saleInvoiceId } = req.params;
    const { tenantId, user } = req;

    try {
      // Deletes the sale invoice with associated entries and journal transaction.
      await this.saleInvoiceService.deleteSaleInvoice(
        tenantId,
        saleInvoiceId,
        user
      );

      return res.status(200).send({
        id: saleInvoiceId,
        message: 'The sale invoice has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the sale invoice with associated entries.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   */
  async getSaleInvoice(req: Request, res: Response, next: NextFunction) {
    const { id: saleInvoiceId } = req.params;
    const { tenantId, user } = req;

    try {
      const saleInvoice = await this.saleInvoiceService.getSaleInvoice(
        tenantId,
        saleInvoiceId,
        user
      );
      // Response formatter.
      res.format({
        // JSON content type.
        [ACCEPT_TYPE.APPLICATION_JSON]: () => {
          return res
            .status(200)
            .send(this.transformToResponse({ saleInvoice }));
        },
        // PDF content type.
        [ACCEPT_TYPE.APPLICATION_PDF]: async () => {
          const pdfContent = await this.saleInvoicePdf.saleInvoicePdf(
            tenantId,
            saleInvoice
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
   * Retrieve paginated sales invoices with custom view metadata.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  public async getSalesInvoices(
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
      const { salesInvoices, filterMeta, pagination } =
        await this.saleInvoiceService.salesInvoicesList(tenantId, filter);

      return res.status(200).send({
        sales_invoices: this.transformToResponse(salesInvoices),
        pagination: this.transformToResponse(pagination),
        filter_meta: this.transformToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve due sales invoices.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   * @return {Response|void}
   */
  public async getPayableInvoices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { customerId } = this.matchedQueryData(req);

    try {
      const salesInvoices = await this.saleInvoiceService.getPayableInvoices(
        tenantId,
        customerId
      );
      return res.status(200).send({
        sales_invoices: this.transformToResponse(salesInvoices),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Written-off sale invoice.
   * @param {Request} req
   * @param {Response} res
   * @param next
   */
  public writeoffSaleInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;

    const writeoffDTO = this.matchedBodyData(req);

    try {
      const saleInvoice = await this.saleInvoiceWriteoff.writeOff(
        tenantId,
        invoiceId,
        writeoffDTO
      );

      return res.status(200).send({
        id: saleInvoice.id,
        message: 'The given sale invoice has been written-off successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cancel the written-off sale invoice.
   * @param {Request} req
   * @param {Response} res
   * @param next
   */
  public cancelWrittenoffSaleInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;

    try {
      const saleInvoice = await this.saleInvoiceWriteoff.cancelWrittenoff(
        tenantId,
        invoiceId
      );
      return res.status(200).send({
        id: saleInvoice.id,
        message:
          'The given sale invoice has been canceled write-off successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sale invoice notify customer by sms.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public saleInvoiceNotifyBySms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;

    const invoiceNotifySmsDTO = this.matchedBodyData(req);

    try {
      const saleInvoice = await this.saleInvoiceSmsNotify.notifyBySms(
        tenantId,
        invoiceId,
        invoiceNotifySmsDTO.notificationKey
      );
      return res.status(200).send({
        id: saleInvoice.id,
        message:
          'The sale invoice sms notification has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sale invoice SMS details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public saleInvoiceSmsDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;
    const smsDetailsDTO = this.matchedQueryData(req);

    try {
      const invoiceSmsDetails = await this.saleInvoiceSmsNotify.smsDetails(
        tenantId,
        invoiceId,
        smsDetailsDTO
      );
      return res.status(200).send({
        data: invoiceSmsDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the invoice payment transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  public getInvoicePaymentTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: invoiceId } = req.params;

    try {
      const invoicePayments =
        await this.invoicePaymentsService.getInvoicePayments(
          tenantId,
          invoiceId
        );

      return res.status(200).send({
        data: invoicePayments,
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
  private handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'INVOICE_NUMBER_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 100 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_NOT_FOUND') {
        return res.status(404).send({
          errors: [{ type: 'SALE.INVOICE.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'ENTRIES_ITEMS_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_ITEMS_IDS_NOT_EXISTS', code: 300 }],
        });
      }
      if (error.errorType === 'NOT_SELLABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELLABLE_ITEMS', code: 400 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_NO_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_NO_NOT_UNIQUE', code: 500 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 600 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 700 }],
        });
      }
      if (error.errorType === 'NOT_SELL_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELL_ABLE_ITEMS', code: 800 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 900 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_ALREADY_DELIVERED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_ALREADY_DELIVERED', code: 1000 }],
        });
      }
      if (error.errorType === 'INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES', code: 1100 },
          ],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'FROM_SALE_ESTIMATE_NOT_FOUND', code: 1200 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_CONVERTED_TO_INVOICE') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'SALE_ESTIMATE_IS_ALREADY_CONVERTED_TO_INVOICE',
              code: 1300,
            },
          ],
        });
      }
      if (error.errorType === 'INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT', code: 1400 },
          ],
        });
      }
      if (error.errorType === 'SALE_INVOICE_NO_IS_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_NO_IS_REQUIRED', code: 1500 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_NOT_WRITTEN_OFF') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_NOT_WRITTEN_OFF', code: 1600 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_ALREADY_WRITTEN_OFF') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_ALREADY_WRITTEN_OFF', code: 1700 }],
        });
      }
      if (error.errorType === 'CUSTOMER_HAS_NO_PHONE_NUMBER') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_HAS_NO_PHONE_NUMBER', code: 1800 }],
        });
      }
      if (error.errorType === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID', code: 1800 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_HAS_APPLIED_TO_CREDIT_NOTES') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'SALE_INVOICE_HAS_APPLIED_TO_CREDIT_NOTES', code: 1900 },
          ],
        });
      }
      if (error.errorType === 'TRANSACTIONS_DATE_LOCKED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'TRANSACTIONS_DATE_LOCKED',
              code: 4900,
              data: { ...error.payload },
            },
          ],
        });
      }
    }
    next(error);
  }
}
