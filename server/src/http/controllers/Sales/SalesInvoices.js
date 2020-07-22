import express from 'express';
import { check, param, query } from 'express-validator';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import SaleInvoiceService from '@/services/Sales/SaleInvoice';
import ItemsService from '@/services/Items/ItemsService';
import CustomersService from '@/services/Customers/CustomersService';
import { SaleInvoice } from '@/models';
import DynamicListing, { DYNAMIC_LISTING_ERRORS } from '@/services/DynamicListing/DynamicListing';
import DynamicListingBuilder from '../../../services/DynamicListing/DynamicListingBuilder';
import {
  dynamicListingErrorsToResponse
} from '@/services/DynamicListing/hasDynamicListing';

export default {
  router() {
    const router = express.Router();

    router.post(
      '/',
      this.newSaleInvoice.validation,
      validateMiddleware,
      asyncMiddleware(this.newSaleInvoice.handler)
    );
    router.post(
      '/:id',
      this.editSaleInvoice.validation,
      validateMiddleware,
      asyncMiddleware(this.editSaleInvoice.handler)
    );
    router.delete(
      '/:id',
      this.deleteSaleInvoice.validation,
      validateMiddleware,
      asyncMiddleware(this.deleteSaleInvoice.handler)
    );
    router.get(
      '/',
      this.getSalesInvoices.validation,
      asyncMiddleware(this.getSalesInvoices.handler)
    );
    return router;
  },

  /**
   * Creates a new sale invoice.
   */
  newSaleInvoice: {
    validation: [
      check('customer_id').exists().isNumeric().toInt(),
      check('invoice_date').exists().isISO8601(),
      check('due_date').exists().isISO8601(),
      check('invoice_no').exists().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('status').exists().trim().escape(),

      check('invoice_message').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const errorReasons = [];
      const saleInvoice = { ...req.body };
      const isInvoiceNoExists = await SaleInvoiceService.isSaleInvoiceNumberExists(
        saleInvoice.invoice_no
      );
      if (isInvoiceNoExists) {
        errorReasons.push({ type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 200 });
      }
      const entriesItemsIds = saleInvoice.entries.map((e) => e.item_id);
      const isItemsIdsExists = await ItemsService.isItemsIdsExists(
        entriesItemsIds
      );
      if (isItemsIdsExists.length > 0) {
        errorReasons.push({ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 });
      }
      // Validate the customer id exists.
      const isCustomerIDExists = await CustomersService.isCustomerExists(
        saleInvoice.customer_id
      );
      if (!isCustomerIDExists) {
        errorReasons.push({ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Creates a new sale invoice with associated entries.
      const storedSaleInvoice = await SaleInvoiceService.createSaleInvoice(
        saleInvoice
      );
      return res.status(200).send({ id: storedSaleInvoice.id });
    },
  },

  /**
   * Edit sale invoice details.
   */
  editSaleInvoice: {
    validation: [
      param('id').exists().isNumeric().toInt(),

      check('customer_id').exists().isNumeric().toInt(),
      check('invoice_date').exists(),
      check('due_date').exists(),
      check('invoice_no').exists().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('status').exists().trim().escape(),

      check('invoice_message').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const { id: saleInvoiceId } = req.params;
      const saleInvoice = { ...req.body };
      const isSaleInvoiceExists = await SaleInvoiceService.isSaleInvoiceExists(
        saleInvoiceId
      );
      if (!isSaleInvoiceExists) {
        return res
          .status(404)
          .send({ type: 'SALE.INVOICE.NOT.FOUND', code: 200 });
      }
      const errorReasons = [];

      // Validate the invoice number uniqness.
      const isInvoiceNoExists = await SaleInvoiceService.isSaleInvoiceNumberExists(
        saleInvoice.invoice_no,
        saleInvoiceId
      );
      if (isInvoiceNoExists) {
        errorReasons.push({ type: 'SALE.INVOICE.NUMBER.IS.EXISTS', code: 200 });
      }
      // Validate sale invoice entries items IDs.
      const entriesItemsIds = saleInvoice.entries.map((e) => e.item_id);
      const isItemsIdsExists = await ItemsService.isItemsIdsExists(
        entriesItemsIds
      );
      if (isItemsIdsExists.length > 0) {
        errorReasons.push({ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 });
      }
      // Validate the customer id exists.
      const isCustomerIDExists = await CustomersService.isCustomerExists(
        saleInvoice.customer_id
      );
      if (!isCustomerIDExists) {
        errorReasons.push({ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Update the given sale invoice details.
      await SaleInvoiceService.editSaleInvoice(saleInvoiceId, saleInvoice);

      return res.status(200).send({ id: saleInvoice.id });
    },
  },

  /**
   * Deletes the sale invoice with associated entries and journal transactions.
   */
  deleteSaleInvoice: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const { id: saleInvoiceId } = req.params;
      const isSaleInvoiceExists = await SaleInvoiceService.isSaleInvoiceExists(
        saleInvoiceId
      );
      if (!isSaleInvoiceExists) {
        return res
          .status(404)
          .send({ errors: [{ type: 'SALE.INVOICE.NOT.FOUND', code: 200 }] });
      }
      // Deletes the sale invoice with associated entries and journal transaction.
      await SaleInvoiceService.deleteSaleInvoice(saleInvoiceId);

      return res.status(200).send();
    },
  },

  /**
   * Retrieve paginated sales invoices with custom view metadata.
   */
  getSalesInvoices: {
    validation: [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ],
    async handler(req, res) {
      const filter = {
        filter_roles: [],
        sort_order: 'asc',
        ...req.query,
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }
      const { SaleInvoice, Resource } = req.models;
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
      const viewMeta = View.query()
        .modify('allMetadata')
        .modify('specificOrFavourite', filter.custom_view_id)
        .first();

      const listingBuilder = new DynamicListingBuilder();
      const errorReasons = [];

      listingBuilder.addModelClass(SaleInvoice);
      listingBuilder.addCustomViewId(filter.custom_view_id);
      listingBuilder.addFilterRoles(filter.filter_roles);
      listingBuilder.addSortBy(filter.sort_by, filter.sort_order);
      listingBuilder.addView(viewMeta);

      const dynamicListing = new DynamicListing(dynamicListingBuilder);

      if (dynamicListing instanceof Error) {
        const errors = dynamicListingErrorsToResponse(dynamicListing);
        errorReasons.push(...errors);
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const salesInvoices = await SaleInvoice.query().onBuild((builder) => {
        dynamicListing.buildQuery()(builder);
      });

      return res.status(200).send({
        sales_invoices: salesInvoices,
        ...(viewMeta
          ? {
              customViewId: viewMeta.id,
            }
          : {}),
      });
    },
  },
};
