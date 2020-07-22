
import express from 'express';
import { check, param } from 'express-validator';
import BaseController from '@/http/controllers/BaseController';
import BillPaymentsService from '@/services/Purchases/BillPayments';

export default class BillsPayments extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post('/', [
        ...this.billPaymentSchemaValidation,
      ],
      this.validatePaymentAccount,
      this.validatePaymentNumber,
      this.validateItemsIds,
      this.createBillPayment,
    );
    router.delete('/:id',
      this.validateBillPaymentExistance,
      this.deleteBillPayment,
    );
    return router;
  }

  /**
   * Bill payments schema validation.
   */
  static get billPaymentSchemaValidation() {
    return [
      check('payment_account_id').exists().isNumeric().toInt(),
      check('payment_number').exists().trim().escape(),
      check('payment_date').exists(),
      check('description').optional().trim().escape(),
      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
    ];
  }

  /**
   * Validates the bill payment existance. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateBillPaymentExistance(req, res, next) {
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
  static async validatePaymentAccount(req, res, next) {
    const isAccountExists = AccountsService.isAccountExists(req.body.payment_account_id);

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
  static async validatePaymentNumber(req, res, next) {
    const isNumberExists = await BillPaymentsService.isBillNoExists(req.body.payment_number);

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
  static async validateItemsIds(req, res, next) {
    const itemsIds = req.body.entries.map((e) => e.item_id);
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
   * Creates a bill payment.
   * @async
   * @param {Request} req 
   * @param {Response} res 
   * @param {Response} res 
   */
  static async createBillPayment(req, res) {
    const billPayment = { ...req.body };
    const storedPayment = await BillPaymentsService.createBillPayment(billPayment);

    return res.status(200).send({ id: storedPayment.id });
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response} res 
   */
  static async deleteBillPayment(req, res) {

  }
}