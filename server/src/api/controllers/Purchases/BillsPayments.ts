
import { Router, Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import { check, param, query, ValidationChain, matchedData } from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import validateMiddleware from 'api/middleware/validateMiddleware';
import BaseController from 'api/controllers/BaseController';
import BillPaymentsService from 'services/Purchases/BillPayments';
import AccountsService from 'services/Accounts/AccountsService';

/**
 * Bills payments controller.
 * @service
 */
@Service()
export default class BillsPayments extends BaseController {
  @Inject()
  billPaymentService: BillPaymentsService;

  @Inject()
  accountsService: AccountsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post('/', [
        ...this.billPaymentSchemaValidation,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentVendorExistance.bind(this)),
      asyncMiddleware(this.validatePaymentAccount.bind(this)),
      asyncMiddleware(this.validatePaymentNumber.bind(this)),
      asyncMiddleware(this.validateEntriesBillsExistance.bind(this)),
      asyncMiddleware(this.validateVendorsDueAmount.bind(this)),
      asyncMiddleware(this.createBillPayment.bind(this)),
    );
    router.post('/:id', [
       ...this.billPaymentSchemaValidation,
       ...this.specificBillPaymentValidateSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentVendorExistance.bind(this)),
      asyncMiddleware(this.validatePaymentAccount.bind(this)),
      asyncMiddleware(this.validatePaymentNumber.bind(this)),
      asyncMiddleware(this.validateEntriesIdsExistance.bind(this)),
      asyncMiddleware(this.validateEntriesBillsExistance.bind(this)),
      asyncMiddleware(this.validateVendorsDueAmount.bind(this)),
      asyncMiddleware(this.editBillPayment.bind(this)),
    )
    router.delete('/:id',
      this.specificBillPaymentValidateSchema,
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentExistance.bind(this)),
      asyncMiddleware(this.deleteBillPayment.bind(this)),
    );
    router.get('/:id',
      this.specificBillPaymentValidateSchema,
      validateMiddleware,
      asyncMiddleware(this.validateBillPaymentExistance.bind(this)),
      asyncMiddleware(this.getBillPayment.bind(this)),
    );
    router.get('/', 
      this.listingValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.getBillsPayments.bind(this))
    );
    return router;
  }

  /**
   * Bill payments schema validation.
   */
  get billPaymentSchemaValidation(): ValidationChain[] {
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
  get specificBillPaymentValidateSchema(): ValidationChain[] {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Bills payment list validation schema.
   */
  get listingValidationSchema(): ValidationChain[] {
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
   * Validate whether the bill payment vendor exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateBillPaymentVendorExistance(req: Request, res: Response, next: any ) {
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
  async validateBillPaymentExistance(req: Request, res: Response, next: any ) {
    const { id: billPaymentId } = req.params;
    const { BillPayment } = req.models;
    const foundBillPayment = await BillPayment.query().findById(billPaymentId);

    if (!foundBillPayment) {
      return res.status(404).send({
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
  async validatePaymentAccount(req: Request, res: Response, next: any) {
    const { tenantId } = req;
    const billPayment = { ...req.body };

    const isAccountExists = await this.accountsService.isAccountExists(
      tenantId,
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
  async validatePaymentNumber(req: Request, res: Response, next: any) {
    const billPayment = { ...req.body };
    const { id: billPaymentId } = req.params;
    const { BillPayment } = req.models;
  
    const foundBillPayment = await BillPayment.query()
      .onBuild((builder: any) => {
        builder.where('payment_number', billPayment.payment_number)
        if (billPaymentId) {
          builder.whereNot('id', billPaymentId);
        }
      })
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
  async validateEntriesBillsExistance(req: Request, res: Response, next: any) {
    const { Bill } = req.models;
    const billPayment = { ...req.body };
    const entriesBillsIds = billPayment.entries.map((e: any) => e.bill_id);

    // Retrieve not found bills that associated to the given vendor id.
    const notFoundBillsIds = await Bill.getNotFoundBills(
      entriesBillsIds,
      billPayment.vendor_id,
    );
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
  async validateVendorsDueAmount(req: Request, res: Response, next: Function) {
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
   * Validate the payment receive entries IDs existance. 
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response}
   */
  async validateEntriesIdsExistance(req: Request, res: Response, next: Function) {
    const { BillPaymentEntry } = req.models;

    const billPayment = { id: req.params.id, ...req.body };
    const entriesIds = billPayment.entries
      .filter((entry: any) => entry.id)
      .map((entry: any) => entry.id);

    const storedEntries = await BillPaymentEntry.query()
      .where('bill_payment_id', billPayment.id);

    const storedEntriesIds = storedEntries.map((entry: any) => entry.id);    
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
  async createBillPayment(req: Request, res: Response) {
    const { tenantId } = req;

    const billPayment = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const storedPayment = await this.billPaymentService
      .createBillPayment(tenantId, billPayment);

    return res.status(200).send({ id: storedPayment.id });
  }

  /**
   * Edits the given bill payment details.
   * @param {Request} req 
   * @param {Response} res 
   */
  async editBillPayment(req: Request, res: Response) {
    const { tenantId } = req;

    const billPayment = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const { id: billPaymentId } = req.params;
    const { BillPayment } = req.models;

    const oldBillPayment = await BillPayment.query()
      .where('id', billPaymentId)
      .withGraphFetched('entries')
      .first();

    await this.billPaymentService.editBillPayment(
      tenantId,
      billPaymentId,
      billPayment,
      oldBillPayment,
    );
    return res.status(200).send({ id: 1 });
  }

  /**
   * Deletes the bill payment and revert the journal
   * transactions with accounts balance.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response} res -
   */
  async deleteBillPayment(req: Request, res: Response) {
    const { tenantId } = req;

    const { id: billPaymentId } = req.params;
    const billPayment = req.body;

    await this.billPaymentService.deleteBillPayment(tenantId, billPaymentId);

    return res.status(200).send({ id: billPaymentId });
  }

  /**
   * Retrieve the bill payment.
   * @param {Request} req 
   * @param {Response} res 
   */
  async getBillPayment(req: Request, res: Response) {
    const { tenantId } = req;
    const { id: billPaymentId } = req.params;

    const billPayment = await this.billPaymentService
      .getBillPaymentWithMetadata(tenantId, billPaymentId);

    return res.status(200).send({ bill_payment: { ...billPayment } });
  }

  /**
   * Retrieve bills payments listing with pagination metadata. 
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  async getBillsPayments(req: Request, res: Response) {

  }
}