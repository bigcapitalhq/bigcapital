import express from 'express';
import { check, param, query } from 'express-validator';
import { ItemEntry } from '@/models';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import CustomersService from '@/services/Customers/CustomersService';
import AccountsService from '@/services/Accounts/AccountsService';
import ItemsService from '@/services/Items/ItemsService';
import SaleReceiptService from '@/services/Sales/SalesReceipts';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import {
  dynamicListingErrorsToResponse
} from '@/services/DynamicListing/HasDynamicListing';

export default class SalesReceiptsController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post(
      '/:id', [
        ...this.specificReceiptValidationSchema,
        ...this.salesReceiptsValidationSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateSaleReceiptExistance),
      asyncMiddleware(this.validateReceiptCustomerExistance),
      asyncMiddleware(this.validateReceiptDepositAccountExistance),
      asyncMiddleware(this.validateReceiptItemsIdsExistance),
      asyncMiddleware(this.validateReceiptEntriesIds),
      asyncMiddleware(this.editSaleReceipt)
    );
    router.post(
      '/',
      this.salesReceiptsValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateReceiptCustomerExistance),
      asyncMiddleware(this.validateReceiptDepositAccountExistance),
      asyncMiddleware(this.validateReceiptItemsIdsExistance),
      asyncMiddleware(this.newSaleReceipt)
    );
    router.delete(
      '/:id',
      this.specificReceiptValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateSaleReceiptExistance),
      asyncMiddleware(this.deleteSaleReceipt)
    );
    router.get(
      '/',
      this.listSalesReceiptsValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.listingSalesReceipts)
    );
    return router;
  }

  /**
   * Sales receipt validation schema.
   * @return {Array}
   */
  static get salesReceiptsValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('receipt_date').exists().isISO8601(),
      check('send_to_email').optional().isEmail(),
      check('reference_no').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
      
      check('entries.*.id').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toInt(),
      check('entries.*.discount').optional().isNumeric().toInt(),

      check('receipt_message').optional().trim().escape(),
      check('statement').optional().trim().escape(),
    ];
  }

  /**
   * Specific sale receipt validation schema.
   */
  static get specificReceiptValidationSchema() {
    return [
      param('id').exists().isNumeric().toInt()
    ];
  }

  /**
   * List sales receipts validation schema.
   */
  static get listSalesReceiptsValidationSchema() {
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
   * Validate whether sale receipt exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async validateSaleReceiptExistance(req, res, next) {
    const { id: saleReceiptId } = req.params;
    const isSaleReceiptExists = await SaleReceiptService.isSaleReceiptExists(
      saleReceiptId
    );
    if (!isSaleReceiptExists) {
      return res.status(404).send({
        errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale receipt customer exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateReceiptCustomerExistance(req, res, next) {
    const saleReceipt = { ...req.body };
    const isCustomerExists = await CustomersService.isCustomerExists(
      saleReceipt.customer_id
    );
    if (!isCustomerExists) {
      return res.status(400).send({ 
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale receipt deposit account exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateReceiptDepositAccountExistance(req, res, next) {
    const saleReceipt = { ...req.body };
    const isDepositAccountExists = await AccountsService.isAccountExists(
      saleReceipt.deposit_account_id
    );
    if (!isDepositAccountExists) {
      return res.status(400).send({
        errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate whether receipt items ids exist on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateReceiptItemsIdsExistance(req, res, next) {
    const saleReceipt = { ...req.body };    
    const estimateItemsIds = saleReceipt.entries.map((e) => e.item_id);
    const notFoundItemsIds = await ItemsService.isItemsIdsExists(
      estimateItemsIds
    );
    if (notFoundItemsIds.length > 0) {
      return res.status(400).send({ errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }] });
    }
    next();
  }

  /**
   * Validate receipt entries ids existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateReceiptEntriesIds(req, res, next) {
    const saleReceipt = { ...req.body };
    const { id: saleReceiptId } = req.params;

    // Validate the entries IDs that not stored or associated to the sale receipt.
    const notExistsEntriesIds = await SaleReceiptService.isSaleReceiptEntriesIDsExists(
      saleReceiptId,
      saleReceipt
    );
    if (notExistsEntriesIds.length > 0) {
      return res.status(400).send({ errors: [{
          type: 'ENTRIES.IDS.NOT.FOUND',
          code: 500,
        }]
      });
    }
    next();
  }

  /**
   * Creates a new receipt.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async newSaleReceipt(req, res) {
    const saleReceipt = {
      ...req.body,
      entries: req.body.entries.map((entry) => ({
        ...entry,
        amount: ItemEntry.calcAmount(entry),
      })),
    };

    // Store the given sale receipt details with associated entries.
    const storedSaleReceipt = await SaleReceiptService.createSaleReceipt(
      saleReceipt
    );
    return res.status(200).send({ id: storedSaleReceipt.id });
  }

  /**
   * Deletes the sale receipt with associated entries and journal transactions.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async deleteSaleReceipt(req, res) {
    const { id: saleReceiptId } = req.params;

    // Deletes the sale receipt.
    await SaleReceiptService.deleteSaleReceipt(saleReceiptId);

    return res.status(200).send({ id: saleReceiptId });  
  }

  /**
   * Edit the sale receipt details with associated entries and re-write
   * journal transaction on the same date.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async editSaleReceipt(req, res) {
    const { id: saleReceiptId } = req.params;
    const saleReceipt = { ...req.body };
    const errorReasons = [];
    
    // Handle all errors with reasons messages.
    if (errorReasons.length > 0) {
      return res.boom.badRequest(null, { errors: errorReasons });
    }
    // Update the given sale receipt details.
    await SaleReceiptService.editSaleReceipt(saleReceiptId, saleReceipt);

    return res.status(200).send();
  }

  /**
   * Listing sales receipts.
   * @param {Request} req 
   * @param {Response} res
   */
  static async listingSalesReceipts(req, res) {
    const filter = {
      filter_roles: [],
      sort_order: 'asc',
      page: 1,
      page_size: 10,
      ...req.query,
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
      builder.withGraphFetched('entries');
      dynamicListing.buildQuery()(builder);
    }).pagination(filter.page - 1, filter.page_size);

    return res.status(200).send({
      sales_receipts: {
        ...salesReceipts,
        ...(viewMeta ? {
          view_meta: {
            customViewId: viewMeta.id,
          }        
        } : {}),
      },
    });
  }
};
