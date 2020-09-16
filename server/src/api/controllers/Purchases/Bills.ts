import { Router, Request, Response } from 'express';
import { check, param, query, matchedData } from 'express-validator';
import { Service, Inject } from 'typedi';
import { difference } from 'lodash';
import { BillOTD } from 'interfaces';
import validateMiddleware from 'api/middleware/validateMiddleware';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BillsService from 'services/Purchases/Bills';
import BaseController from 'api/controllers/BaseController';
import ItemsService from 'services/Items/ItemsService';
import TenancyService from 'services/Tenancy/TenancyService';

@Service()
export default class BillsController extends BaseController {
  @Inject()
  itemsService: ItemsService;

  @Inject()
  billsService: BillsService;

  @Inject()
  tenancy: TenancyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      [...this.billValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateVendorExistance.bind(this)),
      asyncMiddleware(this.validateItemsIds.bind(this)),
      asyncMiddleware(this.validateBillNumberExists.bind(this)),
      asyncMiddleware(this.validateNonPurchasableEntriesItems.bind(this)),
      asyncMiddleware(this.newBill.bind(this))
    );
    router.post(
      '/:id',
      [...this.billValidationSchema, ...this.specificBillValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateBillExistance.bind(this)),
      asyncMiddleware(this.validateVendorExistance.bind(this)),
      asyncMiddleware(this.validateItemsIds.bind(this)),
      asyncMiddleware(this.validateEntriesIdsExistance.bind(this)),
      asyncMiddleware(this.validateNonPurchasableEntriesItems.bind(this)),
      asyncMiddleware(this.editBill.bind(this))
    );
    router.get(
      '/:id',
      [...this.specificBillValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateBillExistance.bind(this)),
      asyncMiddleware(this.getBill.bind(this))
    );
    router.get(
      '/',
      [...this.billsListingValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.listingBills.bind(this))
    );
    router.delete(
      '/:id',
      [...this.specificBillValidationSchema],
      validateMiddleware,
      asyncMiddleware(this.validateBillExistance.bind(this)),
      asyncMiddleware(this.deleteBill.bind(this))
    );
    return router;
  }

  /**
   * Common validation schema.
   */
  get billValidationSchema() {
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
  get specificBillValidationSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Bills list validation schema.
   */
  get billsListingValidationSchema() {
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
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateVendorExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const { Vendor } = req.models;

    const isVendorExists = await Vendor.query().findById(req.body.vendor_id);

    if (!isVendorExists) {
      return res.status(400).send({
        errors: [{ type: 'VENDOR.ID.NOT.FOUND', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validates the given bill existance.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateBillExistance(req: Request, res: Response, next: Function) {
    const billId: number = req.params.id;
    const { tenantId } = req;

    const isBillExists = await this.billsService.isBillExists(tenantId, billId);

    if (!isBillExists) {
      return res.status(400).send({
        errors: [{ type: 'BILL.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates the entries items ids.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateItemsIds(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const itemsIds = req.body.entries.map((e) => e.item_id);

    const notFoundItemsIds = await this.itemsService.isItemsIdsExists(tenantId, itemsIds);

    if (notFoundItemsIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.IDS.NOT.FOUND', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validates the bill number existance.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateBillNumberExists(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const isBillNoExists = await this.billsService.isBillNoExists(
      tenantId, req.body.bill_number,
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
  async validateEntriesIdsExistance(req: Request, res: Response, next: Function) {
    const { id: billId } = req.params;
    const bill = { ...req.body };
    const { ItemEntry } = req.models;

    const entriesIds = bill.entries.filter((e) => e.id).map((e) => e.id);

    const storedEntries = await ItemEntry.query()
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
   * Validate the entries items that not purchase-able. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateNonPurchasableEntriesItems(req: Request, res: Response, next: Function) {
    const { Item } = req.models;
    const bill = { ...req.body };
    const itemsIds = bill.entries.map(e => e.item_id);
    
    const purchasbleItems = await Item.query()
      .where('purchasable', true)
      .whereIn('id', itemsIds);

    const purchasbleItemsIds = purchasbleItems.map((item) => item.id);
    const notPurchasableItems = difference(itemsIds, purchasbleItemsIds);

    if (notPurchasableItems.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'NOT.PURCHASE.ABLE.ITEMS', code: 600 }],
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
  async newBill(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const { ItemEntry } = req.models;

    const billOTD: BillOTD = matchedData(req, {
      locations: ['body'],
      includeOptionals: true
    });
    const storedBill = await this.billsService.createBill(tenantId, billOTD);

    return res.status(200).send({ id: storedBill.id });
  }

  /**
   * Edit bill details with associated entries and rewrites journal transactions.
   * @param {Request} req
   * @param {Response} res
   */
  async editBill(req: Request, res: Response) {
    const { id: billId } = req.params;
    const { ItemEntry } = req.models;
    const { tenantId } = req;

    const billOTD: BillOTD = matchedData(req, {
      locations: ['body'],
      includeOptionals: true
    });
    const editedBill = await this.billsService.editBill(tenantId, billId, billOTD);

    return res.status(200).send({ id: billId });
  }

  /**
   * Retrieve the given bill details with associated item entries.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async getBill(req: Request, res: Response) {
    const { tenantId } = req;
    const { id: billId } = req.params;

    const bill = await this.billsService.getBillWithMetadata(tenantId, billId);

    return res.status(200).send({ bill });
  }

  /**
   * Deletes the given bill with associated entries and journal transactions.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  async deleteBill(req: Request, res: Response) {
    const billId = req.params.id;
    const { tenantId } = req;

    await this.billsService.deleteBill(tenantId, billId);

    return res.status(200).send({ id: billId });
  }

  /**
   * Listing bills with pagination meta.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  async listingBills(req: Request, res: Response) {

  }
}
