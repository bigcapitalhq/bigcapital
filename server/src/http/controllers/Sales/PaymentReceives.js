import express from 'express';
import { check, param, query } from 'express-validator';
import { difference } from 'lodash';
import { PaymentReceiveEntry } from '@/models';
import BaseController from '@/http/controllers/BaseController';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import PaymentReceiveService from '@/services/Sales/PaymentsReceives';
import CustomersService from '@/services/Customers/CustomersService';
import SaleInvoicesService from '@/services/Sales/SalesInvoices';
import AccountsService from '@/services/Accounts/AccountsService';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import { dynamicListingErrorsToResponse } from '@/services/DynamicListing/hasDynamicListing';

/**
 * Payments receives controller.
 * @controller
 */
export default class PaymentReceivesController extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post(
      '/:id',
      this.editPaymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveExistance),
      asyncMiddleware(this.validatePaymentReceiveNoExistance),
      asyncMiddleware(this.validateCustomerExistance),
      asyncMiddleware(this.validateDepositAccount),
      asyncMiddleware(this.validateInvoicesIDs),
      asyncMiddleware(this.validateEntriesIdsExistance),
      asyncMiddleware(this.validateInvoicesPaymentsAmount),
      asyncMiddleware(this.editPaymentReceive),
    );
    router.post(
      '/',
      this.newPaymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveNoExistance),
      asyncMiddleware(this.validateCustomerExistance),
      asyncMiddleware(this.validateDepositAccount),
      asyncMiddleware(this.validateInvoicesIDs),
      asyncMiddleware(this.validateInvoicesPaymentsAmount),
      asyncMiddleware(this.newPaymentReceive),
    );
    router.get(
      '/:id',
      this.paymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveExistance),
      asyncMiddleware(this.getPaymentReceive)
    );
    router.get(
      '/',
      this.validatePaymentReceiveList,
      validateMiddleware,
      asyncMiddleware(this.getPaymentReceiveList),
    );
    router.delete(
      '/:id',
      this.paymentReceiveValidation,
      validateMiddleware,
      asyncMiddleware(this.validatePaymentReceiveExistance),
      asyncMiddleware(this.deletePaymentReceive),
    );
    return router;
  }

  /**
   * Validates the payment receive number existance.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validatePaymentReceiveNoExistance(req, res, next) {
    const isPaymentNoExists = await PaymentReceiveService.isPaymentReceiveNoExists(
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
  static async validatePaymentReceiveExistance(req, res, next) {
    const isPaymentNoExists = await PaymentReceiveService.isPaymentReceiveExists(
      req.params.id
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
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async validateDepositAccount(req, res, next) {
    const isDepositAccExists = await AccountsService.isAccountExists(
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
  static async validateCustomerExistance(req, res, next) {
    const isCustomerExists = await CustomersService.isCustomerExists(
      req.body.customer_id
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
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  static async validateInvoicesIDs(req, res, next) {
    const paymentReceive = { ...req.body };
    const invoicesIds = paymentReceive.entries.map((e) => e.invoice_id);
    const notFoundInvoicesIDs = await SaleInvoicesService.isInvoicesExist(
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
  static async validateInvoicesPaymentsAmount(req, res, next) {
    const { SaleInvoice } = req.models;
    const invoicesIds = req.body.entries.map((e) => e.invoice_id);
    const storedInvoices = await SaleInvoice.tenant()
      .query()
      .whereIn('id', invoicesIds);

    const storedInvoicesMap = new Map(
      storedInvoices.map((invoice) => [invoice.id, invoice])
    );
    const hasWrongPaymentAmount = [];

    req.body.entries.forEach((entry, index) => {
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
  static async validateEntriesIdsExistance(req, res, next) {
    const paymentReceive = { id: req.params.id, ...req.body };
    const entriesIds = paymentReceive.entries
      .filter(entry => entry.id)
      .map(entry => entry.id);

    const storedEntries = await PaymentReceiveEntry.tenant().query()
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
      check('statement').optional().trim().escape(),

      check('entries').isArray({ min: 1 }),

      check('entries.*.invoice_id').exists().isNumeric().toInt(),
      check('entries.*.payment_amount').exists().isNumeric().toInt(),
    ];
  }

  /**
   * New payment receive validation schema.
   * @return {Array}
   */
  static get newPaymentReceiveValidation() {
    return [...this.paymentReceiveSchema];
  }

  /**
   * Records payment receive to the given customer with associated invoices.
   */
  static async newPaymentReceive(req, res) {
    const paymentReceive = { ...req.body };
    const storedPaymentReceive = await PaymentReceiveService.createPaymentReceive(
      paymentReceive
    );
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
   * @return {Response}
   */
  static async editPaymentReceive(req, res) {
    const paymentReceive = { ...req.body };
    const { id: paymentReceiveId } = req.params;
    const { PaymentReceive } = req.models;

    // Retrieve the payment receive before updating.
    const oldPaymentReceive = await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .withGraphFetched('entries')
      .first();

    await PaymentReceiveService.editPaymentReceive(
      paymentReceiveId,
      paymentReceive,
      oldPaymentReceive,
    );
    return res.status(200).send({ id: paymentReceiveId });
  }

  /**
   * Validate payment receive parameters.
   */
  static get paymentReceiveValidation() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Delets the given payment receive id.
   * @param {Request} req
   * @param {Response} res
   */
  static async deletePaymentReceive(req, res) {
    const { id: paymentReceiveId } = req.params;

    const { PaymentReceive } = req.models;
    const storedPaymentReceive = await PaymentReceive.query()
      .where('id', paymentReceiveId)
      .withGraphFetched('entries')
      .first();

    await PaymentReceiveService.deletePaymentReceive(
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
  static async getPaymentReceive(req, res) {
    const { id: paymentReceiveId } = req.params;
    const paymentReceive = await PaymentReceiveService.getPaymentReceive(
      paymentReceiveId
    );
    return res.status(200).send({ paymentReceive });
  }

  /**
   * Payment receive list validation schema.
   */
  static get validatePaymentReceiveList() {
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
   * Retrieve payment receive list with pagination metadata.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response} 
   */
  static async getPaymentReceiveList(req, res) {
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
    const { Resource, PaymentReceive, View, Bill } = req.models;
    const resource = await Resource.query()
        .remember()
        .where('name', 'payment_receives')
        .withGraphFetched('fields')
        .first();

    if (!resource) {
      return res.status(400).send({
        errors: [{ type: 'PAYMENT_RECEIVES_RESOURCE_NOT_FOUND', code: 200 }],
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
    const paymentReceives = await PaymentReceive.query().onBuild((builder) => {
      dynamicListing.buildQuery()(builder);
      return builder;
    }).pagination(filter.page - 1, filter.page_size);

    return res.status(200).send({
      payment_receives: {
        ...paymentReceives,
        ...(viewMeta
          ? {
            viewMeta: {
              customViewId: viewMeta.id, 
            }
          }
          : {}),
      },
    });
  }
}
