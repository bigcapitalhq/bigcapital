import express from 'express';
import { check, param, query } from 'express-validator';
import { ItemEntry } from '@/models';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import SaleInvoiceService from '@/services/Sales/SaleInvoice';
import ItemsService from '@/services/Items/ItemsService';
import CustomersService from '@/services/Customers/CustomersService';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import { dynamicListingErrorsToResponse } from '@/services/DynamicListing/hasDynamicListing';
import { SaleInvoice } from '../../../models';
import { difference } from 'lodash';

export default class SaleInvoicesController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post(
      '/',
      this.saleInvoiceValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateInvoiceNumberUnique),
      asyncMiddleware(this.validateInvoiceItemsIdsExistance),
      asyncMiddleware(this.newSaleInvoice)
    );
    router.post(
      '/:id',
      [
        ...this.saleInvoiceValidationSchema,
        ...this.specificSaleInvoiceValidation,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateInvoiceExistance),
      asyncMiddleware(this.validateInvoiceNumberUnique),
      asyncMiddleware(this.validateInvoiceItemsIdsExistance),
      asyncMiddleware(this.valdiateInvoiceEntriesIdsExistance),
      asyncMiddleware(this.validateEntriesIdsExistance),
      asyncMiddleware(this.editSaleInvoice)
    );
    router.delete(
      '/:id',
      this.specificSaleInvoiceValidation,
      validateMiddleware,
      asyncMiddleware(this.validateInvoiceExistance),
      asyncMiddleware(this.deleteSaleInvoice)
    );
    router.get(
      '/:id',
      this.specificSaleInvoiceValidation,
      validateMiddleware,
      asyncMiddleware(this.validateInvoiceExistance),
      asyncMiddleware(this.getSaleInvoice)
    );
    router.get(
      '/',
      this.saleInvoiceListValidationSchema,
      asyncMiddleware(this.getSalesInvoices)
    );    
    return router;
  }

  /**
   * Sale invoice validation schema.
   */
  static get saleInvoiceValidationSchema() {
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
  static get specificSaleInvoiceValidation() {
    return [param('id').exists().isNumeric().toInt()];
  }

  static get saleInvoiceListValidationSchema() {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ];
  }

  /**
   * Validate whether sale invoice customer exists on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateInvoiceCustomerExistance(req, res, next) {
    const saleInvoice = { ...req.body };
    const isCustomerIDExists = await CustomersService.isCustomerExists(
      saleInvoice.customer_id
    );
    if (!isCustomerIDExists) {
      return res.status(400).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale invoice items ids esits on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateInvoiceItemsIdsExistance(req, res, next) {
    const saleInvoice = { ...req.body };
    const entriesItemsIds = saleInvoice.entries.map((e) => e.item_id);
    const isItemsIdsExists = await ItemsService.isItemsIdsExists(
      entriesItemsIds
    );
    if (isItemsIdsExists.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale invoice number unqiue on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateInvoiceNumberUnique(req, res, next) {
    const saleInvoice = { ...req.body };
    const isInvoiceNoExists = await SaleInvoiceService.isSaleInvoiceNumberExists(
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
  static async validateInvoiceExistance(req, res, next) {
    const { id: saleInvoiceId } = req.params;
    const isSaleInvoiceExists = await SaleInvoiceService.isSaleInvoiceExists(
      saleInvoiceId
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
  static async valdiateInvoiceEntriesIdsExistance(req, res, next) {
    const saleInvoice = { ...req.body };
    const entriesItemsIds = saleInvoice.entries.map((e) => e.item_id);

    const isItemsIdsExists = await ItemsService.isItemsIdsExists(
      entriesItemsIds
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
  static async validateEntriesIdsExistance(req, res, next) {
    const { id: saleInvoiceId } = req.params;
    const saleInvoice = { ...req.body };
    const entriesIds = saleInvoice.entries
      .filter(e => e.id)
      .map(e => e.id);

    const storedEntries = await ItemEntry.tenant().query()
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
   * Creates a new sale invoice.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async newSaleInvoice(req, res) {
    const errorReasons = [];
    const saleInvoice = {
      ...req.body,
      entries: req.body.entries.map((entry) => ({
        ...entry,
        amount: ItemEntry.calcAmount(entry),
      })),
    };
    // Creates a new sale invoice with associated entries.
    const storedSaleInvoice = await SaleInvoiceService.createSaleInvoice(
      saleInvoice
    );
    return res.status(200).send({ id: storedSaleInvoice.id });
  }

  /**
   * Edit sale invoice details.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async editSaleInvoice(req, res) {
    const { id: saleInvoiceId } = req.params;
    const saleInvoice = { ...req.body };

    // Update the given sale invoice details.
    await SaleInvoiceService.editSaleInvoice(saleInvoiceId, saleInvoice);

    return res.status(200).send({ id: saleInvoice.id });
  }

  /**
   * Deletes the sale invoice with associated entries and journal transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async deleteSaleInvoice(req, res) {
    const { id: saleInvoiceId } = req.params;
    // Deletes the sale invoice with associated entries and journal transaction.
    await SaleInvoiceService.deleteSaleInvoice(saleInvoiceId);

    return res.status(200).send({ id: saleInvoiceId });
  }

  /**
   * Retrieve the sale invoice with associated entries.
   * @param {Request} req
   * @param {Response} res
   */
  static async getSaleInvoice(req, res) {
    const { id: saleInvoiceId } = req.params;
    const saleInvoice = await SaleInvoiceService.getSaleInvoiceWithEntries(
      saleInvoiceId
    );
    return res.status(200).send({ sale_invoice: saleInvoice });
  }

  /**
   * Retrieve paginated sales invoices with custom view metadata.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async getSalesInvoices(req, res) {
    const filter = {
      filter_roles: [],
      sort_order: 'asc',
      ...req.query,
    };
    if (filter.stringified_filter_roles) {
      filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
    }
    const { SaleInvoice, View, Resource } = req.models;
    const resource = await Resource.query()
      .remember()
      .where('name', 'sales_invoices')
      .withGraphFetched('fields')
      .first();

    if (!resource) {
      return res.status(400).send({
        errors: [{ type: 'SALES_INVOICES_RESOURCE_NOT_FOUND', code: 200 }],
      });
    }
    const viewMeta = await View.query()
      .modify('allMetadata')
      .modify('specificOrFavourite', filter.custom_view_id)
      .where('resource_id', resource.id)
      .first();

    const listingBuilder = new DynamicListingBuilder();
    const errorReasons = [];

    listingBuilder.addModelClass(SaleInvoice);
    listingBuilder.addCustomViewId(filter.custom_view_id);
    listingBuilder.addFilterRoles(filter.filter_roles);
    listingBuilder.addSortBy(filter.sort_by, filter.sort_order);
    listingBuilder.addView(viewMeta);

    const dynamicListing = new DynamicListing(listingBuilder);

    if (dynamicListing instanceof Error) {
      const errors = dynamicListingErrorsToResponse(dynamicListing);
      errorReasons.push(...errors);
    }
    if (errorReasons.length > 0) {
      return res.status(400).send({ errors: errorReasons });
    }
    const salesInvoices = await SaleInvoice.query().onBuild((builder) => {
      builder.withGraphFetched('entries');
      dynamicListing.buildQuery()(builder);
    }).pagination(filter.page - 1, filter.page_size);

    return res.status(200).send({
      sales_invoices: { 
        ...salesInvoices,
        ...(viewMeta
          ? {
            view_meta: {
              customViewId: viewMeta.id,
            }
          }
          : {}),
      },
    });
  }
}
