import express from 'express';
import { check, param } from 'express-validator';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import PaymentReceiveService from '@/services/Sales/PaymentReceive';
import CustomersService from '@/services/Customers/CustomersService';
import SaleInvoicesService from '@/services/Sales/SaleInvoice';
import AccountsService from '@/services/Accounts/AccountsService';

export default class PaymentReceivesController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post('/',
      this.newPaymentReceiveValidation,
      validateMiddleware,
      this.validatePaymentReceiveNoExistance,
      this.validateCustomerExistance,
      this.validateDepositAccount,
      this.validateInvoicesIDs,
      asyncMiddleware(this.newPaymentReceive),
    );
    router.post('/:id',
      this.editPaymentReceiveValidation,
      validateMiddleware,
      this.validatePaymentReceiveNoExistance,
      this.validateCustomerExistance,
      this.validateDepositAccount,
      this.validateInvoicesIDs,
      asyncMiddleware(this.editPaymentReceive),
    );
    router.get('/:id',
      this.paymentReceiveValidation,
      validateMiddleware,
      this.validatePaymentReceiveExistance,
      asyncMiddleware(this.getPaymentReceive),
    );
    router.delete('/:id',
      this.paymentReceiveValidation,
      validateMiddleware,
      this.validatePaymentReceiveExistance,
      asyncMiddleware(this.deletePaymentReceive),
    );
    return router;
  }

  /**
   * Validates the payment receive number existance.
   */
  static async validatePaymentReceiveNoExistance(req, res, next) {
    const isPaymentNoExists = await PaymentReceiveService.isPaymentReceiveNoExists(
      req.body.payment_receive_no,
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
   */
  static async validatePaymentReceiveExistance(req, res, next) {
    const isPaymentNoExists = await PaymentReceiveService.isPaymentReceiveExists(
      req.params.id,
    );
    if (!isPaymentNoExists) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT.RECEIVE.NO.EXISTS', code: 600 }],
      });
    }
    next();
  }

  /**
   * Validate the deposit account id existance.
   */
  static async validateDepositAccount(req, res, next) {
    const isDepositAccExists = await AccountsService.isAccountExists(
      req.body.deposit_account_id,
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
  static async validateCustomerExistance(req, res, next) {
    const isCustomerExists = await CustomersService.isCustomerExists(
      req.body.customer_id,
    );
    if (!isCustomerExists) {
      return res.status(400).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validates the invoices IDs existance.
   */
  static async validateInvoicesIDs(req, res, next) {
    const invoicesIds = req.body.entries.map((e) => e.invoice_id);
    const notFoundInvoicesIDs = await SaleInvoicesService.isInvoicesExist(invoicesIds);

    if (notFoundInvoicesIDs.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'INVOICES.IDS.NOT.FOUND', code: 500 }],
      });
    }
    next();
  }

  /**
   * Payment receive schema.
   * @return {Array}
   */
  static get paymentReceiveSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('payment_date').exists(),
      check('reference_no').optional(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('payment_receive_no').exists().trim().escape(),
      check('entries').isArray({ min: 1 }),
      check('entries.*.invoice_id').exists().isNumeric().toInt(),
      check('entries.*.payment_amount').exists().isNumeric().toInt(),
    ];
  }

  static get newPaymentReceiveValidation() {
    return [...this.paymentReceiveSchema];
  }

  /**
   * Records payment receive to the given customer with associated invoices.
   */
  static async newPaymentReceive(req, res) {
    const paymentReceive = { ...req.body };
    const storedPaymentReceive = await PaymentReceiveService.createPaymentReceive(paymentReceive);

    return res.status(200).send({ id: storedPaymentReceive.id });
  }

  /**
   * Edit payment receive validation.
   */
  static get editPaymentReceiveValidation() {
    return [
      param('id').exists().isNumeric().toInt(),
      ...this.paymentReceiveSchema,
    ];
  }

  /**
   * Edit the given payment receive. 
   * @param {Request} req 
   * @param {Response} res 
   */
  static async editPaymentReceive(req, res) {
    const paymentReceive = { ...req.body };
    const { id: paymentReceiveId } = req.params;
    await PaymentReceiveService.editPaymentReceive(paymentReceiveId, paymentReceive);

    return res.status(200).send({ id: paymentReceiveId });
  }

  /**
   * Validate payment receive parameters.
   */
  static get paymentReceiveValidation() {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Delets the given payment receive id.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async deletePaymentReceive(req, res) {
    const { id: paymentReceiveId } = req.params;
    await PaymentReceiveService.deletePaymentReceive(paymentReceiveId);

    return res.status(200).send({ id: paymentReceiveId });
  }

  /**
   * Retrieve the given payment receive details.
   * @asycn
   * @param {Request} req -
   * @param {Response} res -
   */
  static async getPaymentReceive(req, res) {
    const { id: paymentReceiveId } = req.params;
    const paymentReceive = await PaymentReceiveService.getPaymentReceive(paymentReceiveId);

    return res.status(200).send({ paymentReceive });
  }
}