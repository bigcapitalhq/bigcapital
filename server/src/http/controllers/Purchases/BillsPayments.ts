
import { Router } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import BaseController from '@/http/controllers/BaseController';
import BillPaymentsService from '@/services/Purchases/BillPayments';
import AccountsService from '@/services/Accounts/AccountsService';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import { dynamicListingErrorsToResponse } from '@/services/DynamicListing/hasDynamicListing';

/**
 * Bills payments controller.
 * @controller
 */
export default class BillsPayments extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = Router();

    router.post('/', [
        ...this.billPaymentSchemaValidation,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentVendorExistance),
      asyncMiddleware(this.validatePaymentAccount),
      asyncMiddleware(this.validatePaymentNumber),
      asyncMiddleware(this.validateEntriesBillsExistance),
      asyncMiddleware(this.validateVendorsDueAmount),
      asyncMiddleware(this.createBillPayment),
    );
    router.post('/:id', [
       ...this.billPaymentSchemaValidation,
       ...this.specificBillPaymentValidateSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentVendorExistance),
      asyncMiddleware(this.validatePaymentAccount),
      asyncMiddleware(this.validatePaymentNumber),
      asyncMiddleware(this.validateEntriesBillsExistance),
      asyncMiddleware(this.validateVendorsDueAmount),
      asyncMiddleware(this.editBillPayment),
    )
    router.delete('/:id',
      this.specificBillPaymentValidateSchema,
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentExistance),
      asyncMiddleware(this.deleteBillPayment),
    );
    router.get('/:id',
      this.specificBillPaymentValidateSchema,
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentExistance),
      asyncMiddleware(this.getBillPayment),
    );
    router.get('/', 
      this.listingValidationSchema,
      validateMiddleware,
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
      check('entries.*.bill_id').exists().isNumeric().toInt(),
      check('entries.*.payment_amount').exists().isNumeric().toInt(),
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
    const isVendorExists = await Vendor.query().findById(billPayment.vendor_id);

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
    next();
  }

  /**
   * Validates the payment account. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validatePaymentAccount(req: Request, res: Response, next: any) {
    const billPayment = { ...req.body };
    const isAccountExists = await AccountsService.isAccountExists(
      billPayment.payment_account_id
    );
    if (!isAccountExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates the payment number uniqness. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} res 
   */
  static async validatePaymentNumber(req: Request, res: Response, next: any) {
    const { BillPayment } = req.models;
    const billPayment = { ...req.body };
    const foundBillPayment = await BillPayment.query()
      .where('payment_number', billPayment.payment_number)
      .first();
 
    if (foundBillPayment) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.NUMBER.NOT.UNIQUE', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate whether the entries bills ids exist on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  static async validateEntriesBillsExistance(req: Request, res: Response, next: any) {
    const { Bill } = req.models;
    const billPayment = { ...req.body };
    const entriesBillsIds = billPayment.entries.map((e: any) => e.bill_id);

    const notFoundBillsIds = await Bill.getNotFoundBills(entriesBillsIds);

    if (notFoundBillsIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'BILLS.IDS.NOT.EXISTS', code: 600 }],
      });
    }
    next();
  }

  /**
   * Validate wether the payment amount bigger than the payable amount.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   * @return {void}
   */
  static async validateVendorsDueAmount(req: Request, res: Response, next: Function) {
    const { Bill } = req.models;
    const billsIds = req.body.entries.map((entry: any) => entry.bill_id);
    const storedBills = await Bill.query()
      .whereIn('id', billsIds);

    const storedBillsMap = new Map(
      storedBills.map((bill: any) => [bill.id, bill]),
    );
    interface invalidPaymentAmountError{
      index: number,
      due_amount: number
    };
    const hasWrongPaymentAmount: invalidPaymentAmountError[] = [];
    const { entries } = req.body;

    entries.forEach((entry: any, index: number) => {
      const entryBill = storedBillsMap.get(entry.bill_id);
      const { dueAmount } = entryBill;

      if (dueAmount < entry.payment_amount) {
        hasWrongPaymentAmount.push({ index, due_amount: dueAmount });
      }      
    });
    if (hasWrongPaymentAmount.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'INVALID.BILL.PAYMENT.AMOUNT', code: 400, indexes: hasWrongPaymentAmount }]
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