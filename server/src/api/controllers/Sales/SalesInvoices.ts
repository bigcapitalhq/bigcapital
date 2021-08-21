import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import BaseController from '../BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import SaleInvoiceService from 'services/Sales/SalesInvoices';
import ItemsService from 'services/Items/ItemsService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { ServiceError } from 'exceptions';
import { ISaleInvoiceDTO, ISaleInvoiceCreateDTO } from 'interfaces';
import SaleInvoicePdf from 'services/Sales/SaleInvoicePdf';

const ACCEPT_TYPE = {
  APPLICATION_PDF: 'application/pdf',
  APPLICATION_JSON: 'application/json',
};
@Service()
export default class SaleInvoicesController extends BaseController {
  @Inject()
  itemsService: ItemsService;

  @Inject()
  saleInvoiceService: SaleInvoiceService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  saleInvoicePdf: SaleInvoicePdf;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
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
      [...this.specificSaleInvoiceValidation],
      this.validationResult,
      asyncMiddleware(this.deliverSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
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
      this.specificSaleInvoiceValidation,
      this.validationResult,
      asyncMiddleware(this.deleteSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/payable',
      [...this.dueSalesInvoicesListValidationSchema],
      this.validationResult,
      asyncMiddleware(this.getPayableInvoices.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      this.specificSaleInvoiceValidation,
      this.validationResult,
      asyncMiddleware(this.getSaleInvoice.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
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
      check('invoice_date').exists().isISO8601(),
      check('due_date').exists().isISO8601(),
      check('invoice_no').optional().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('delivered').default(false).isBoolean().toBoolean(),

      check('invoice_message').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),

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
          return res.status(200).send(this.transfromToResponse({ saleInvoice }));
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
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    try {
      const { salesInvoices, filterMeta, pagination } =
        await this.saleInvoiceService.salesInvoicesList(tenantId, filter);

      return res.status(200).send({
        sales_invoices: this.transfromToResponse(salesInvoices),
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
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
        sales_invoices: this.transfromToResponse(salesInvoices),
      });
    } catch (error) {
      next(error);
    }
  }

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
    }
    next(error);
  }
}
