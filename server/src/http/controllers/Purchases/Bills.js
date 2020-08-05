import express from 'express';
import { check, param, query } from 'express-validator';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import BillsService from '@/services/Purchases/Bills';
import BaseController from '@/http/controllers/BaseController';
import VendorsServices from '@/services/Vendors/VendorsService';
import ItemsService from '@/services/Items/ItemsService';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import { dynamicListingErrorsToResponse } from '@/services/DynamicListing/HasDynamicListing';
import { difference } from 'lodash';

export default class BillsController extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post(
      '/',
      [...this.billValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateVendorExistance),
      asyncMiddleware(this.validateItemsIds),
      asyncMiddleware(this.validateBillNumberExists),
      asyncMiddleware(this.newBill)
    );
    router.post(
      '/:id',
      [...this.billValidationSchema, ...this.specificBillValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateBillExistance),
      asyncMiddleware(this.validateVendorExistance),
      asyncMiddleware(this.validateItemsIds),
      asyncMiddleware(this.validateEntriesIdsExistance),
      asyncMiddleware(this.editBill)
    );
    router.get(
      '/:id',
      [...this.specificBillValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateBillExistance),
      asyncMiddleware(this.getBill)
    );
    router.get(
      '/',
      [...this.billsListingValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.listingBills)
    );
    router.delete(
      '/:id',
      [...this.specificBillValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateBillExistance),
      asyncMiddleware(this.deleteBill)
    );
    return router;
  }

  /**
   * Common validation schema.
   */
  static get billValidationSchema() {
    return [
      check('bill_number').exists().trim().escape(),
      check('bill_date').exists().isISO8601(),
      check('due_date').optional().isISO8601(),
      check('vendor_id').exists().isNumeric().toInt(),
      check('note').optional().trim().escape(),
      check('entries').isArray({ min: 1 }),

      check('entries.*.id').optional().isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
    ];
  }

  /**
   * Bill validation schema.
   */
  static get specificBillValidationSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Bills list validation schema.
   */
  static get billsListingValidationSchema() {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ];
  }

  /**
   * Validates whether the vendor is exist.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateVendorExistance(req, res, next) {
    const isVendorExists = await VendorsServices.isVendorExists(
      req.body.vendor_id
    );
    if (!isVendorExists) {
      return res.status(400).send({
        errors: [{ type: 'VENDOR.ID.NOT.FOUND', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validates the given bill existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateBillExistance(req, res, next) {
    const isBillExists = await BillsService.isBillExists(req.params.id);
    if (!isBillExists) {
      return res.status(400).send({
        errors: [{ type: 'BILL.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates the entries items ids.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateItemsIds(req, res, next) {
    const itemsIds = req.body.entries.map((e) => e.item_id);
    const notFoundItemsIds = await ItemsService.isItemsIdsExists(itemsIds);
    if (notFoundItemsIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.IDS.NOT.FOUND', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validates the bill number existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateBillNumberExists(req, res, next) {
    const isBillNoExists = await BillsService.isBillNoExists(
      req.body.bill_number
    );

    if (isBillNoExists) {
      return res.status(400).send({
        errors: [{ type: 'BILL.NUMBER.EXISTS', code: 500 }],
      });
    }
    next();
  }

  /**
   * Validates the entries ids existance on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateEntriesIdsExistance(req, res, next) {
    const { id: billId } = req.params;
    const bill = { ...req.body };
    const { ItemEntry } = req.models;

    const entriesIds = bill.entries.filter((e) => e.id).map((e) => e.id);

    const storedEntries = await ItemEntry.tenant()
      .query()
      .whereIn('reference_id', [billId])
      .whereIn('reference_type', ['Bill']);

    const storedEntriesIds = storedEntries.map((entry) => entry.id);
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);
    if (notFoundEntriesIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'BILL.ENTRIES.IDS.NOT.FOUND', code: 600 }],
      });
    }
    next();
  }

  /**
   * Creates a new bill and records journal transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async newBill(req, res, next) {
    const { ItemEntry } = req.models;

    const bill = {
      ...req.body,
      entries: req.body.entries.map((entry) => ({
        ...entry,
        amount: ItemEntry.calcAmount(entry),
      })),
    };
    const storedBill = await BillsService.createBill(bill);

    return res.status(200).send({ id: storedBill.id });
  }

  /**
   * Edit bill details with associated entries and rewrites journal transactions.
   * @param {Request} req
   * @param {Response} res
   */
  static async editBill(req, res) {
    const { ItemEntry } = req.models;
    const { id: billId } = req.params;
    const bill = {
      ...req.body,
      entries: req.body.entries.map((entry) => ({
        ...entry,
        amount: ItemEntry.calcAmount(entry),
      })),
    };
    const editedBill = await BillsService.editBill(billId, bill);

    return res.status(200).send({ id: billId });
  }

  /**
   * Retrieve the given bill details with associated item entries.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  static async getBill(req, res) {
    const { id: billId } = req.params;
    const bill = await BillsService.getBillWithMetadata(billId);

    return res.status(200).send({ bill });
  }

  /**
   * Deletes the given bill with associated entries and journal transactions.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  static async deleteBill(req, res) {
    const billId = req.params.id;
    await BillsService.deleteBill(billId);

    return res.status(200).send({ id: billId });
  }

  /**
   * Listing bills with pagination meta.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  static async listingBills(req, res) {
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
    const { Bill, View, Resource } = req.models;
    const resource = await Resource.query()
      .remember()
      .where('name', 'bills')
      .withGraphFetched('fields')
      .first();

    if (!resource) {
      return res.status(400).send({
        errors: [{ type: 'BILLS_RESOURCE_NOT_FOUND', code: 200 }],
      });
    }
    const viewMeta = await View.query()
      .modify('allMetadata')
      .modify('specificOrFavourite', filter.custom_view_id)
      .where('resource_id', resource.id)
      .first();

    const listingBuilder = new DynamicListingBuilder();
    const errorReasons = [];

    listingBuilder.addModelClass(Bill);
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
    const bills = await Bill.query()
      .onBuild((builder) => {
        dynamicListing.buildQuery()(builder);
        builder.withGraphFetched('vendor');
        return builder;
      })
      .pagination(filter.page - 1, filter.page_size);

    return res.status(200).send({
      bills: {
        ...bills,
        ...(viewMeta
          ? {
              view_meta: {
                customViewId: viewMeta.id,
              },
            }
          : {}),
      },
    });
  }
}
