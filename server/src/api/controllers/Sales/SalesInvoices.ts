import { Router, Request, Response } from 'express';
import { check, param, query, matchedData } from 'express-validator';
import { difference } from 'lodash';
import { raw } from 'objection';
import { Service, Inject } from 'typedi';
import BaseController from '../BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import SaleInvoiceService from 'services/Sales/SalesInvoices';
import ItemsService from 'services/Items/ItemsService';
import { ISaleInvoiceOTD } from 'interfaces';

@Service()
export default class SaleInvoicesController extends BaseController{
  @Inject()
  itemsService: ItemsService;

  @Inject()
  saleInvoiceService: SaleInvoiceService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      this.saleInvoiceValidationSchema,
      this.validationResult,
      asyncMiddleware(this.validateInvoiceCustomerExistance.bind(this)),
      asyncMiddleware(this.validateInvoiceNumberUnique.bind(this)),
      asyncMiddleware(this.validateInvoiceItemsIdsExistance.bind(this)),
      asyncMiddleware(this.validateNonSellableEntriesItems.bind(this)),
      asyncMiddleware(this.newSaleInvoice.bind(this))
    );
    router.post(
      '/:id',
      [
        ...this.saleInvoiceValidationSchema,
        ...this.specificSaleInvoiceValidation,
      ],
      this.validationResult,
      asyncMiddleware(this.validateInvoiceExistance.bind(this)),
      asyncMiddleware(this.validateInvoiceCustomerExistance.bind(this)),
      asyncMiddleware(this.validateInvoiceNumberUnique.bind(this)),
      asyncMiddleware(this.validateInvoiceItemsIdsExistance.bind(this)),
      asyncMiddleware(this.valdiateInvoiceEntriesIdsExistance.bind(this)),
      asyncMiddleware(this.validateEntriesIdsExistance.bind(this)),
      asyncMiddleware(this.validateNonSellableEntriesItems.bind(this)),
      asyncMiddleware(this.editSaleInvoice.bind(this))
    );
    router.delete(
      '/:id',
      this.specificSaleInvoiceValidation,
      this.validationResult,
      asyncMiddleware(this.validateInvoiceExistance.bind(this)),
      asyncMiddleware(this.deleteSaleInvoice.bind(this))
    );
    router.get(
      '/due_invoices',
      this.dueSalesInvoicesListValidationSchema,
      asyncMiddleware(this.getDueSalesInvoice.bind(this)),
    );
    router.get(
      '/:id',
      this.specificSaleInvoiceValidation,
      this.validationResult,
      asyncMiddleware(this.validateInvoiceExistance.bind(this)),
      asyncMiddleware(this.getSaleInvoice.bind(this))
    );
    router.get(
      '/',
      this.saleInvoiceListValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getSalesInvoices.bind(this))
    )
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
      check('invoice_no').exists().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('status').exists().trim().escape(),

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
    return [
      query('customer_id').optional().isNumeric().toInt(), 
    ]
  }

  /**
   * Validate whether sale invoice customer exists on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateInvoiceCustomerExistance(req: Request, res: Response, next: Function) {
    const saleInvoice = { ...req.body };
    const { Customer } = req.models;

    const isCustomerIDExists = await Customer.query().findById(saleInvoice.customer_id);

    if (!isCustomerIDExists) {
      return res.status(400).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale invoice items ids esits on the storage.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {Function} next - 
   */
  async validateInvoiceItemsIdsExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const saleInvoice = { ...req.body };
    const entriesItemsIds = saleInvoice.entries.map((e) => e.item_id);
    
    const isItemsIdsExists = await this.itemsService.isItemsIdsExists(
      tenantId, entriesItemsIds,
    );
    if (isItemsIdsExists.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * 
   * Validate whether sale invoice number unqiue on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateInvoiceNumberUnique(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const saleInvoice = { ...req.body };

    const isInvoiceNoExists = await this.saleInvoiceService.isSaleInvoiceNumberExists(
      tenantId,
      saleInvoice.invoice_no,
      req.params.id
    );
    if (isInvoiceNoExists) {
      return res
        .status(400)
        .send({
          errors: [{ type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 200 }],
        });
    }
    next();
  }

  /**
   * Validate whether sale invoice exists on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateInvoiceExistance(req: Request, res: Response, next: Function) {
    const { id: saleInvoiceId } = req.params;
    const { tenantId } = req;

    const isSaleInvoiceExists = await this.saleInvoiceService.isSaleInvoiceExists(
      tenantId, saleInvoiceId,
    );
    if (!isSaleInvoiceExists) {
      return res
        .status(404)
        .send({ errors: [{ type: 'SALE.INVOICE.NOT.FOUND', code: 200 }] });
    }
    next();
  }

  /**
   * Validate sale invoice entries ids existance on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async valdiateInvoiceEntriesIdsExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const saleInvoice = { ...req.body };
    const entriesItemsIds = saleInvoice.entries.map((e) => e.item_id);

    const isItemsIdsExists = await this.itemsService.isItemsIdsExists(
      tenantId, entriesItemsIds,
    );
    if (isItemsIdsExists.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate whether the sale estimate entries IDs exist on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateEntriesIdsExistance(req: Request, res: Response, next: Function) {
    const { ItemEntry } = req.models;
    const { id: saleInvoiceId } = req.params;
    const saleInvoice = { ...req.body };

    const entriesIds = saleInvoice.entries
      .filter(e => e.id)
      .map(e => e.id);
    
    const storedEntries = await ItemEntry.query()
      .whereIn('reference_id', [saleInvoiceId])
      .whereIn('reference_type', ['SaleInvoice']);

    const storedEntriesIds = storedEntries.map((entry) => entry.id);
    const notFoundEntriesIds = difference(
      entriesIds,
      storedEntriesIds,
    );
    if (notFoundEntriesIds.length > 0) {
      return res.boom.badRequest(null, {
        errors: [{ type: 'SALE.INVOICE.ENTRIES.IDS.NOT.FOUND', code: 500 }],
      });
    }
    next();
  }

  /**
   * Validate the entries items that not sellable. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateNonSellableEntriesItems(req: Request, res: Response, next: Function) {
    const { Item } = req.models;
    const saleInvoice = { ...req.body };
    const itemsIds = saleInvoice.entries.map(e => e.item_id);

    const sellableItems = await Item.query()
      .where('sellable', true)
      .whereIn('id', itemsIds);

    const sellableItemsIds = sellableItems.map((item) => item.id);
    const notSellableItems = difference(itemsIds, sellableItemsIds);

    if (notSellableItems.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'NOT.SELLABLE.ITEMS', code: 600 }],
      });
    }
    next();
  }

  /**
   * Creates a new sale invoice.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async newSaleInvoice(req: Request, res: Response) {
    const { tenantId } = req;
    const saleInvoiceOTD: ISaleInvoiceOTD = matchedData(req, {
      locations: ['body'],
      includeOptionals: true
    });

    // Creates a new sale invoice with associated entries.
    const storedSaleInvoice = await this.saleInvoiceService.createSaleInvoice(
      tenantId, saleInvoiceOTD,
    );
    return res.status(200).send({ id: storedSaleInvoice.id });
  }

  /**
   * Edit sale invoice details.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async editSaleInvoice(req: Request, res: Response) {
    const { tenantId } = req;
    const { id: saleInvoiceId } = req.params;

    const saleInvoiceOTD: ISaleInvoiceOTD = matchedData(req, {
      locations: ['body'],
      includeOptionals: true
    });
    // Update the given sale invoice details.
    await this.saleInvoiceService.editSaleInvoice(tenantId, saleInvoiceId, saleInvoiceOTD);

    return res.status(200).send({ id: saleInvoiceId });
  }

  /**
   * Deletes the sale invoice with associated entries and journal transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async deleteSaleInvoice(req: Request, res: Response) {
    const { id: saleInvoiceId } = req.params;
    const { tenantId } = req;

    // Deletes the sale invoice with associated entries and journal transaction.
    await this.saleInvoiceService.deleteSaleInvoice(tenantId, saleInvoiceId);

    return res.status(200).send({ id: saleInvoiceId });
  }

  /**
   * Retrieve the sale invoice with associated entries.
   * @param {Request} req
   * @param {Response} res
   */
  async getSaleInvoice(req: Request, res: Response) {
    const { id: saleInvoiceId } = req.params;
    const { tenantId } = req;

    const saleInvoice = await this.saleInvoiceService.getSaleInvoiceWithEntries(
      tenantId, saleInvoiceId,
    );
    return res.status(200).send({ sale_invoice: saleInvoice });
  }

  /**
   * Retrieve the due sales invoices for the given customer.
   * @param {Request} req 
   * @param {Response} res 
   */
  async getDueSalesInvoice(req: Request, res: Response) {
    const { Customer, SaleInvoice } = req.models;
    const { tenantId } = req;

    const filter = {
      customer_id: null,
      ...req.query,
    };
    if (filter.customer_id) {
      const foundCustomer = await Customer.query().findById(filter.customer_id);

      if (!foundCustomer) {
        return res.status(200).send({
          errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 200 }],
        });
      }
    }    
    const dueSalesInvoices = await SaleInvoice.query().onBuild((query) => {
      query.where(raw('BALANCE - PAYMENT_AMOUNT > 0'));
      if (filter.customer_id) {
        query.where('customer_id', filter.customer_id);
      }
    });
    return res.status(200).send({
      due_sales_invoices: dueSalesInvoices, 
    });
  }

  /**
   * Retrieve paginated sales invoices with custom view metadata.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async getSalesInvoices(req, res) {
     
  }
}
