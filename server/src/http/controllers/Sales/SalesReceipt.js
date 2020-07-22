import express from 'express';
import { check, param, query } from 'express-validator';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import CustomersService from '@/services/Customers/CustomersService';
import AccountsService from '@/services/Accounts/AccountsService';
import ItemsService from '@/services/Items/ItemsService';
import SaleReceiptService from '@/services/Sales/SalesReceipt';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import {
  dynamicListingErrorsToResponse
} from '@/services/DynamicListing/HasDynamicListing';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.post(
      '/:id',
      this.editSaleReceipt.validation,
      validateMiddleware,
      asyncMiddleware(this.editSaleReceipt.handler)
    );
    router.post(
      '/',
      this.newSaleReceipt.validation,
      validateMiddleware,
      asyncMiddleware(this.newSaleReceipt.handler)
    );
    router.delete(
      '/:id',
      this.deleteSaleReceipt.handler,
      validateMiddleware,
      asyncMiddleware(this.deleteSaleReceipt.handler)
    );
    router.get(
      '/',
      this.listingSalesReceipts.validation,
      validateMiddleware,
      asyncMiddleware(this.listingSalesReceipts.handler)
    );
    return router;
  },

  /**
   * Creates a new receipt.
   */
  newSaleReceipt: {
    validation: [
      check('customer_id').exists().isNumeric().toInt(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('receipt_date').exists().isISO8601(),
      check('send_to_email').optional().isEmail(),
      check('reference_no').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),

      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toInt(),
      check('entries.*.discount').optional().isNumeric().toInt(),

      
      check('receipt_message').optional().trim().escape(),
      check('statement').optional().trim().escape(),
    ],
    async handler(req, res) {
      const saleReceipt = { ...req.body };

      const isCustomerExists = await CustomersService.isCustomerExists(
        saleReceipt.customer_id
      );
      const isDepositAccountExists = await AccountsService.isAccountExists(
        saleReceipt.deposit_account_id
      );
      const errorReasons = [];

      if (!isCustomerExists) {
        errorReasons.push({ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 });
      }
      if (!isDepositAccountExists) {
        errorReasons.push({ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 });
      }
      // Validate items ids in estimate entries exists.
      const estimateItemsIds = saleReceipt.entries.map((e) => e.item_id);
      const notFoundItemsIds = await ItemsService.isItemsIdsExists(
        estimateItemsIds
      );
      if (notFoundItemsIds.length > 0) {
        errorReasons.push({ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Store the given sale receipt details with associated entries.
      const storedSaleReceipt = await SaleReceiptService.createSaleReceipt(
        saleReceipt
      );

      return res.status(200).send({ id: storedSaleReceipt.id });
    },
  },

  /**
   * Deletes the sale receipt with associated entries and journal transactions.
   */
  deleteSaleReceipt: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const { id: saleReceiptId } = req.params;
      const isSaleReceiptExists = await SaleReceiptService.isSaleReceiptExists(
        saleReceiptId
      );

      if (!isSaleReceiptExists) {
        return res.status(404).send({
          errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 200 }],
        });
      }
      // Deletes the sale receipt.
      await SaleReceiptService.deleteSaleReceipt(saleReceiptId);

      return res.status(200).send({ id: saleReceiptId });
    },
  },

  /**
   * Edit the sale receipt details with associated entries and re-write
   * journal transaction on the same date.
   */
  editSaleReceipt: {
    validation: [
      param('id').exists().isNumeric().toInt(),

      check('customer_id').exists().isNumeric().toInt(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('receipt_date').exists().isISO8601(),
      check('send_to_email').optional().isEmail(),
      check('reference_no').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toInt(),
      check('entries.*.discount').optional().isNumeric().toInt(),

      check('receipt_message').optional().trim().escape(),
      check('statement').optional().trim().escape(),
    ],
    async handler(req, res) {
      const { id: saleReceiptId } = req.params;
      const saleReceipt = { ...req.body };

      const isSaleReceiptExists = await SaleReceiptService.isSaleReceiptExists(
        saleReceiptId
      );
      if (!isSaleReceiptExists) {
        return res.status(404).send({
          errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 200 }],
        });
      }
      const isCustomerExists = await CustomersService.isCustomerExists(
        saleReceipt.customer_id
      );
      const isDepositAccountExists = await AccountsService.isAccountsExists(
        saleReceipt.deposit_account_id
      );
      const errorReasons = [];

      if (!isCustomerExists) {
        errorReasons.push({ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 });
      }
      if (!isDepositAccountExists) {
        errorReasons.push({ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 });
      }
      // Validate items ids in estimate entries exists.
      const entriesItemsIDs = saleReceipt.entries.map((e) => e.item_id);
      const notFoundItemsIds = await ItemsService.isItemsIdsExists(
        entriesItemsIDs
      );
      if (notFoundItemsIds.length > 0) {
        errorReasons.push({ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 });
      }
      // Validate the entries IDs that not stored or associated to the sale receipt.
      const notExistsEntriesIds = await SaleReceiptService.isSaleReceiptEntriesIDsExists(
        saleReceiptId,
        saleReceipt
      );
      if (notExistsEntriesIds.length > 0) {
        errorReasons.push({
          type: 'ENTRIES.IDS.NOT.FOUND',
          code: 500,
        });
      }
      // Handle all errors with reasons messages.
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
      // Update the given sale receipt details.
      await SaleReceiptService.editSaleReceipt(saleReceiptId, saleReceipt);

      return res.status(200).send();
    },
  },

  /**
   * Listing sales receipts.
   */
  listingSalesReceipts: {
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
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }
      const { SaleReceipt, Resource, View } = req.models;
      const resource = await Resource.tenant().query()
        .remember()
        .where('name', 'sales_receipts')
        .withGraphFetched('fields')
        .first();

      if (!resource) {
        return res.status(400).send({
          errors: [{ type: 'RESOURCE.NOT.FOUND', code: 200, }],
        });
      }
      const viewMeta = await View.query()
        .modify('allMetadata')
        .modify('specificOrFavourite', filter.custom_view_id)
        .where('resource_id', resource.id)
        .first();

      const listingBuilder = new DynamicListingBuilder();
      const errorReasons = [];

      listingBuilder.addView(viewMeta);
      listingBuilder.addModelClass(SaleReceipt);
      listingBuilder.addCustomViewId(filter.custom_view_id);
      listingBuilder.addFilterRoles(filter.filter_roles);
      listingBuilder.addSortBy(filter.sort_by, filter.sort_order);

      const dynamicListing = new DynamicListing(listingBuilder);

      if (dynamicListing instanceof Error) {
        const errors = dynamicListingErrorsToResponse(dynamicListing);
        errorReasons.push(...errors);
      }
      const salesReceipts = await SaleReceipt.query().onBuild((builder) => {
        dynamicListing.buildQuery()(builder);
        return builder;
      });

      return res.status(200).send({
        sales_receipts: salesReceipts,
        ...(viewMeta ? {
          customViewId: viewMeta.id,
        } : {}),
      });
    },
  },
};
