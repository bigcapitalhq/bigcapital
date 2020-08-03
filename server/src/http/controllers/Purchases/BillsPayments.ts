
import { Router } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import BaseController from '@/http/controllers/BaseController';
import BillPaymentsService from '@/services/Purchases/BillPayments';
import AccountsService from '@/services/Accounts/AccountsService';
import ItemsService from '@/services/Items/ItemsService';
import { IBillPaymentEntry, IBillPayment } from '@/interfaces/BillPayment';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import { dynamicListingErrorsToResponse } from '@/services/DynamicListing/hasDynamicListing';

export default class BillsPayments extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = Router();

    router.post('/', [
        ...this.billPaymentSchemaValidation,
      ],
      asyncMiddleware(this.validateBillPaymentVendorExistance),
      asyncMiddleware(this.validatePaymentAccount),
      asyncMiddleware(this.validatePaymentNumber),
      asyncMiddleware(this.validateItemsIds),
      asyncMiddleware(this.createBillPayment),
    );
    router.post('/:id', [
       ...this.billPaymentSchemaValidation,
       ...this.specificBillPaymentValidateSchema,
      ],
      asyncMiddleware(this.validateBillPaymentVendorExistance),
      asyncMiddleware(this.validatePaymentAccount),
      asyncMiddleware(this.validatePaymentNumber),
      asyncMiddleware(this.validateItemsIds),
      asyncMiddleware(this.validateEntriesIds),
      asyncMiddleware(this.editBillPayment),
    )
    router.delete('/:id',
      this.specificBillPaymentValidateSchema,
      asyncMiddleware(this.validateBillPaymentExistance),
      asyncMiddleware(this.deleteBillPayment),
    );
    router.get('/:id',
      this.specificBillPaymentValidateSchema,
      asyncMiddleware(this.validateBillPaymentExistance),
      asyncMiddleware(this.getBillPayment),
    );
    router.get('/', 
      this.listingValidationSchema,
      asyncMiddleware(this.getBillsPayments)
    );

    return router;
  }

  /**
   * Bill payments schema validation.
   */
  static get billPaymentSchemaValidation(): ValidationChain[] {
    return [
      check('vendor_id').exists().isNumeric().toInt(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('payment_number').exists().trim().escape(),
      check('payment_date').exists(),
      check('description').optional().trim().escape(),
      check('reference').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
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
   * Specific bill payment schema validation.
   */
  static get specificBillPaymentValidateSchema(): ValidationChain[] {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Validate whether the bill payment vendor exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateBillPaymentVendorExistance(req: Request, res: Response, next: any ) {
    const billPayment = req.body;
    const { Vendor } = req.models;
    const isVendorExists = await Vendor.query('id', billPayment.vendor_id).first();

    if (!isVendorExists) {
      return res.status(400).send({
        errors: [{ type: 'BILL.PAYMENT.VENDOR.NOT.FOUND', code: 500 }],
      });
    }
    next();
  }

  /**
   * Validates the bill payment existance. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateBillPaymentExistance(req: Request, res: Response, next: any ) {
    const foundBillPayment = await BillPaymentsService.isBillPaymentExists(req.params.id);

    if (!foundBillPayment) {
      return res.status(404).sned({
        errors: [{ type: 'BILL.PAYMENT.NOT.FOUND', code: 100 }],
      });
    }
    next(req, res, next);
  }

  /**
   * Validates the payment account. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validatePaymentAccount(req: Request, res: Response, next: any) {
    const billPayment = { ...req.body };
    const isAccountExists = AccountsService.isAccountExists(billPayment);

    if (!isAccountExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 200 }],
      });
    }
    next(req, res, next);
  }

  /**
   * Validates the payment number uniqness. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} res 
   */
  static async validatePaymentNumber(req: Request, res: Response, next: any) {
    const billPayment = { ...req.body };
    const isNumberExists = await BillPaymentsService.isBillNoExists(billPayment);

    if (!isNumberExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.NUMBER.NOT.UNIQUE', code: 300 }],
      });
    }
    next(req, res, next);
  }

  /**
   * validate entries items ids existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateItemsIds(req: Request, res: Response, next: Function) {
    const billPayment: any = { ...req.body };
    const itemsIds = billPayment.entries.map((e) => e.item_id);
    const notFoundItemsIds = await ItemsService.isItemsIdsExists(
      itemsIds
    );
    if (notFoundItemsIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.IDS.NOT.FOUND', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validates the entries ids in edit bill payment.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  static async validateEntriesIds(req: Request, res: Response, next: Function) {
    const { BillPaymentEntry } = req.models;
    const { id: billPaymentId } = req.params;
    const billPayment = { id: billPaymentId, ...req.body };

    const entriesIds = billPayment.entries
      .filter((entry: IBillPaymentEntry) => entry.id)
      .map((entry: IBillPaymentEntry) => entry.id);

    const storedEntries = await BillPaymentEntry.tenant().query()
      .where('bill_payment_id', billPaymentId);

    const storedEntriesIds = storedEntries.map((entry: IBillPaymentEntry) => entry.id);
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ENTEIES.IDS.NOT.FOUND', code: 800 }],
      });
    }
    next();
  }

  /**
   * Creates a bill payment.
   * @async
   * @param {Request} req 
   * @param {Response} res 
   * @param {Response} res 
   */
  static async createBillPayment(req: Request, res: Response) {
    const billPayment = { ...req.body };
    const storedPayment = await BillPaymentsService.createBillPayment(billPayment);

    return res.status(200).send({ id: storedPayment.id });
  }

  /**
   * Edits the given bill payment details.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async editBillPayment(req: Request, res: Response) {
    const billPayment = { ...req.body };

    return res.status(200).send({ id: 1 });
  }

  /**
   * Deletes the bill payment and revert the journal
   * transactions with accounts balance.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response} res -
   */
  static async deleteBillPayment(req: Request, res: Response) {
    const { id: billPaymentId } = req.params;
    const billPayment = req.body;

    await BillPaymentsService.deleteBillPayment(billPaymentId);

    return res.status(200).send({ id: billPaymentId });
  }

  static async getBillPayment(req: Request, res: Response) {

  }

  /**
   * Bills payment list validation schema.
   */
  static get listingValidationSchema(): ValidationChain[] {
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
   * Retrieve bills payments listing with pagination metadata. 
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  static async getBillsPayments(req: Request, res: Response) {
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
    const { BillPayment, View, Resource } = req.models; 

    const resource = await Resource.query()
      .where('name', 'bill_payments')
      .withGraphFetched('fields')
      .first();

    if (!resource) {
      return res.status(400).send({
        errors: [{ type: 'BILL.PAYMENTS.RESOURCE.NOT_FOUND', code: 200 }],
      });
    }

    const viewMeta = await View.query()
      .modify('allMetadata')
      .modify('specificOrFavourite', filter.custom_view_id)
      .where('resource_id', resource.id)
      .first();

    const listingBuilder = new DynamicListingBuilder();
    const errorReasons = [];

    listingBuilder.addModelClass(BillPayment);
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
    const billPayments = await BillPayment.query().onBuild((builder) => {
      dynamicListing.buildQuery()(builder);
      return builder;
    });
    return res.status(200).send({
      billPayments,
      ...(viewMeta
        ? {
            customViewId: viewMeta.id,
          }
        : {}),
    });
  }
}