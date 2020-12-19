import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import BaseController from '../BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import SaleInvoiceService from 'services/Sales/SalesInvoices';
import ItemsService from 'services/Items/ItemsService';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { ServiceError } from 'exceptions';
import { ISaleInvoiceDTO, ISalesInvoicesFilter } from 'interfaces';

@Service()
export default class SaleInvoicesController extends BaseController {
  @Inject()
  itemsService: ItemsService;

  @Inject()
  saleInvoiceService: SaleInvoiceService;

  @Inject()
  dynamicListService: DynamicListingService;

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
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
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
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
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
    const { tenantId } = req;
    const saleInvoiceOTD: ISaleInvoiceDTO = this.matchedBodyData(req);

    try {
      // Creates a new sale invoice with associated entries.
      const storedSaleInvoice = await this.saleInvoiceService.createSaleInvoice(
        tenantId,
        saleInvoiceOTD
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
    const { tenantId } = req;
    const { id: saleInvoiceId } = req.params;
    const saleInvoiceOTD: ISaleInvoiceDTO = this.matchedBodyData(req);

    try {
      // Update the given sale invoice details.
      await this.saleInvoiceService.editSaleInvoice(
        tenantId,
        saleInvoiceId,
        saleInvoiceOTD
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
    const { tenantId } = req;
    const { id: saleInvoiceId } = req.params;

    try {
      await this.saleInvoiceService.deliverSaleInvoice(tenantId, saleInvoiceId);

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
    const { tenantId } = req;

    try {
      // Deletes the sale invoice with associated entries and journal transaction.
      await this.saleInvoiceService.deleteSaleInvoice(tenantId, saleInvoiceId);

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
   * @param {Request} req
   * @param {Response} res
   */
  async getSaleInvoice(req: Request, res: Response, next: NextFunction) {
    const { id: saleInvoiceId } = req.params;
    const { tenantId } = req;

    try {
      const saleInvoice = await this.saleInvoiceService.getSaleInvoice(
        tenantId,
        saleInvoiceId
      );
      return res.status(200).send({ sale_invoice: saleInvoice });
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
    const filter: ISalesInvoicesFilter = {
      filterRoles: [],
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      ...this.matchedQueryData(req),
    };
    if (filter.stringifiedFilterRoles) {
      filter.filterRoles = JSON.parse(filter.stringifiedFilterRoles);
    }

    try {
      const {
        salesInvoices,
        filterMeta,
        pagination,
      } = await this.saleInvoiceService.salesInvoicesList(tenantId, filter);
      return res.status(200).send({
        sales_invoices: salesInvoices,
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
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'INVOICE_NUMBER_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 200 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_NOT_FOUND') {
        return res.status(404).send({
          errors: [{ type: 'SALE.INVOICE.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'ENTRIES_ITEMS_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_ITEMS_IDS_NOT_EXISTS', code: 200 }],
        });
      }
      if (error.errorType === 'NOT_SELLABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELLABLE_ITEMS', code: 200 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_NO_NOT_UNIQUE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_NO_NOT_UNIQUE', code: 200 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'NOT_SELL_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELL_ABLE_ITEMS', code: 200 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'SALE_INVOICE_ALREADY_DELIVERED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_INVOICE_ALREADY_DELIVERED', code: 200 }],
        });
      }
    }
    next(error);
  }
}
