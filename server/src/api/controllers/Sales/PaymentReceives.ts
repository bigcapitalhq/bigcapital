import { Router, Request, Response } from 'express';
import { check, param, query, ValidationChain, matchedData } from 'express-validator';
import { difference } from 'lodash';
import { Inject, Service } from 'typedi';
import { IPaymentReceive, IPaymentReceiveOTD } from 'interfaces';
import BaseController from 'api/controllers/BaseController';
import validateMiddleware from 'api/middleware/validateMiddleware';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import PaymentReceiveService from 'services/Sales/PaymentsReceives';
import SaleInvoiceService from 'services/Sales/SalesInvoices';
import AccountsService from 'services/Accounts/AccountsService';

/**
 * Payments receives controller.
 * @service
 */
@Service()
export default class PaymentReceivesController extends BaseController {
  @Inject()
  paymentReceiveService: PaymentReceiveService;

  @Inject()
  accountsService: AccountsService;

  @Inject()
  saleInvoiceService: SaleInvoiceService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/:id',
      this.editPaymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveExistance.bind(this)),
      asyncMiddleware(this.validatePaymentReceiveNoExistance.bind(this)),
      asyncMiddleware(this.validateCustomerExistance.bind(this)),
      asyncMiddleware(this.validateDepositAccount.bind(this)),
      asyncMiddleware(this.validateInvoicesIDs.bind(this)),
      asyncMiddleware(this.validateEntriesIdsExistance.bind(this)),
      asyncMiddleware(this.validateInvoicesPaymentsAmount.bind(this)),
      asyncMiddleware(this.editPaymentReceive.bind(this)),
    );
    router.post(
      '/',
      this.newPaymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveNoExistance.bind(this)),
      asyncMiddleware(this.validateCustomerExistance.bind(this)),
      asyncMiddleware(this.validateDepositAccount.bind(this)),
      asyncMiddleware(this.validateInvoicesIDs.bind(this)),
      asyncMiddleware(this.validateInvoicesPaymentsAmount.bind(this)),
      asyncMiddleware(this.newPaymentReceive.bind(this)),
    );
    router.get(
      '/:id',
      this.paymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveExistance.bind(this)),
      asyncMiddleware(this.getPaymentReceive.bind(this))
    );
    router.get(
      '/',
      this.validatePaymentReceiveList,
      validateMiddleware,
      asyncMiddleware(this.getPaymentReceiveList.bind(this)),
    );
    router.delete(
      '/:id',
      this.paymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveExistance.bind(this)),
      asyncMiddleware(this.deletePaymentReceive.bind(this)),
    );
    return router;
  }

  /**
   * Payment receive schema.
   * @return {Array}
   */
  get paymentReceiveSchema(): ValidationChain[] {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('payment_date').exists(),
      check('reference_no').optional(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('payment_receive_no').exists().trim().escape(),
      check('statement').optional().trim().escape(),

      check('entries').isArray({ min: 1 }),

      check('entries.*.invoice_id').exists().isNumeric().toInt(),
      check('entries.*.payment_amount').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Payment receive list validation schema.
   */
  get validatePaymentReceiveList(): ValidationChain[] {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ]
  }

  /**
   * Validate payment receive parameters.
   */
  get paymentReceiveValidation() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * New payment receive validation schema.
   * @return {Array}
   */
  get newPaymentReceiveValidation() {
    return [...this.paymentReceiveSchema];
  }

  /**
   * Validates the payment receive number existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validatePaymentReceiveNoExistance(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const isPaymentNoExists = await this.paymentReceiveService.isPaymentReceiveNoExists(
      tenantId,
      req.body.payment_receive_no,
      req.params.id,
    );
    if (isPaymentNoExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.RECEIVE.NUMBER.EXISTS', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validates the payment receive existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validatePaymentReceiveExistance(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const isPaymentNoExists = await this.paymentReceiveService
      .isPaymentReceiveExists(
        tenantId,
        req.params.id
      );
    if (!isPaymentNoExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.RECEIVE.NOT.EXISTS', code: 600 }],
      });
    }
    next();
  }

  /**
   * Validate the deposit account id existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateDepositAccount(req: Request, res: Response, next: Function) {
    const tenantId = req.tenantId;
    const isDepositAccExists = await this.accountsService.isAccountExists(
      tenantId,
      req.body.deposit_account_id
    );
    if (!isDepositAccExists) {
      return res.status(400).send({
        errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validates the `customer_id` existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateCustomerExistance(req: Request, res: Response, next: Function) {
    const  { Customer } = req.models;

    const isCustomerExists = await Customer.query().findById(req.body.customer_id);

    if (!isCustomerExists) {
      return res.status(400).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates the invoices IDs existance.
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  async validateInvoicesIDs(req: Request, res: Response, next: Function) {
    const paymentReceive = { ...req.body };
    const { tenantId } = req;
    const invoicesIds = paymentReceive.entries
      .map((e) => e.invoice_id);

    const notFoundInvoicesIDs = await this.saleInvoiceService.isInvoicesExist(
      tenantId,
      invoicesIds,
      paymentReceive.customer_id,
    );
    if (notFoundInvoicesIDs.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'INVOICES.IDS.NOT.FOUND', code: 500 }],
      });
    }
    next();
  }

  /**
   * Validates entries invoice payment amount.
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  async validateInvoicesPaymentsAmount(req: Request, res: Response, next: Function) {
    const { SaleInvoice } = req.models;
    const invoicesIds = req.body.entries.map((e) => e.invoice_id);

    const storedInvoices = await SaleInvoice.query()
      .whereIn('id', invoicesIds);

    const storedInvoicesMap = new Map(
      storedInvoices.map((invoice) => [invoice.id, invoice])
    );
    const hasWrongPaymentAmount: any[] = [];

    req.body.entries.forEach((entry, index: number) => {
      const entryInvoice = storedInvoicesMap.get(entry.invoice_id);
      const { dueAmount } = entryInvoice;

      if (dueAmount < entry.payment_amount) {
        hasWrongPaymentAmount.push({ index, due_amount: dueAmount });
      }
    });
    if (hasWrongPaymentAmount.length > 0) {
      return res.status(400).send({
        errors: [
          {
            type: 'INVOICE.PAYMENT.AMOUNT',
            code: 200,
            indexes: hasWrongPaymentAmount,
          },
        ],
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
    const paymentReceive = { id: req.params.id, ...req.body };
    const entriesIds = paymentReceive.entries
      .filter(entry => entry.id)
      .map(entry => entry.id);

    const { PaymentReceiveEntry } = req.models;

    const storedEntries = await PaymentReceiveEntry.query()
      .where('payment_receive_id', paymentReceive.id);

    const storedEntriesIds = storedEntries.map((entry) => entry.id);    
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ENTEIES.IDS.NOT.FOUND', code: 800 }],
      });
    }
    next();
  }

  /**
   * Records payment receive to the given customer with associated invoices.
   */
  async newPaymentReceive(req: Request, res: Response) {
    const { tenantId } = req;
    const paymentReceive: IPaymentReceiveOTD = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    });

    const storedPaymentReceive = await this.paymentReceiveService
      .createPaymentReceive(
        tenantId,
        paymentReceive,
      );
    return res.status(200).send({ id: storedPaymentReceive.id });
  }

  /**
   * Edit payment receive validation.
   */
  get editPaymentReceiveValidation() {
    return [
      param('id').exists().isNumeric().toInt(),
      ...this.paymentReceiveSchema,
    ];
  }

  /**
   * Edit the given payment receive.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async editPaymentReceive(req: Request, res: Response) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;
    const { PaymentReceive } = req.models;

    const paymentReceive: IPaymentReceiveOTD = matchedData(req, {
      locations: ['body'],
    });

    // Retrieve the payment receive before updating.
    const oldPaymentReceive: IPaymentReceive = await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .withGraphFetched('entries')
      .first();

    await this.paymentReceiveService.editPaymentReceive(
      tenantId,
      paymentReceiveId,
      paymentReceive,
      oldPaymentReceive,
    );
    return res.status(200).send({ id: paymentReceiveId });
  }

  /**
   * Delets the given payment receive id.
   * @param {Request} req
   * @param {Response} res
   */
  async deletePaymentReceive(req: Request, res: Response) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;
    const { PaymentReceive } = req.models;

    const storedPaymentReceive = await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .withGraphFetched('entries')
      .first();

    await this.paymentReceiveService.deletePaymentReceive(
      tenantId,
      paymentReceiveId,
      storedPaymentReceive
    );
    return res.status(200).send({ id: paymentReceiveId });
  }

  /**
   * Retrieve the given payment receive details.
   * @asycn
   * @param {Request} req -
   * @param {Response} res -
   */
  async getPaymentReceive(req: Request, res: Response) {
    const { id: paymentReceiveId } = req.params;
    const paymentReceive = await PaymentReceiveService.getPaymentReceive(
      paymentReceiveId
    );
    return res.status(200).send({ paymentReceive });
  }

  /**
   * Retrieve payment receive list with pagination metadata.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response} 
   */
  async getPaymentReceiveList(req: Request, res: Response) {
  
  }
}
