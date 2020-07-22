import express from "express";
import { check, param } from 'express-validator';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import BillsService from "@/services/Purchases/Bills";
import BaseController from '@/http/controllers/BaseController';
import VendorsServices from '@/services/Vendors/VendorsService';
import ItemsService from '@/services/Items/ItemsService';

export default class BillsController extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post('/', [
        ...this.validationSchema,
      ],
      validateMiddleware,
      this.validateVendorExistance,
      this.validateItemsIds,
      this.validateBillNumberExists,
      this.newBill,
    );
    // router.post('/:id', [
    //     ...this.billValidationSchema,
    //     ...this.validationSchema,
    //   ],
    //   validateMiddleware,
    //   this.validateBillExistance,
    //   this.validateVendorExistance,
    //   this.validateItemsIds,
    //   this.editBill,
    // );
    router.delete('/:id', [
        ...this.billValidationSchema,
      ],
      validateMiddleware,
      this.validateBillExistance,
      this.deleteBill
    );
    return router;
  }

  /**
   * Common validation schema.
   */
  static get validationSchema() {
    return [
      check('bill_number').exists().trim().escape(),
      check('bill_date').exists().isISO8601(),
      check('due_date').optional().isISO8601(),
      check('vendor_id').exists().isNumeric().toInt(),
      check('note').optional().trim().escape(),
      check('entries').isArray({ min: 1 }),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
    ]
  }

  static get billValidationSchema() {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  static async validateVendorExistance(req, res, next) {
    const isVendorExists = await VendorsServices.isVendorExists(req.body.vendor_id);
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
   * Validates the bill number existance.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateBillNumberExists(req, res, next) {
    const isBillNoExists = await BillsService.isBillNoExists(req.body.bill_number);

    if (isBillNoExists) {
      return res.status(400).send({
        errors: [{ type: 'BILL.NUMBER.EXISTS', code: 500 }],
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
    const bill = { ...req.body };
    const storedBill = await BillsService.createBill(bill);

    return res.status(200).send({ id: storedBill });
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
}