import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import { IPaymentReceiveDTO } from 'interfaces';
import BaseController from 'api/controllers/BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import PaymentReceiveService from 'services/Sales/PaymentsReceives';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { ServiceError } from 'exceptions';

/**
 * Payments receives controller.
 * @service
 */
@Service()
export default class PaymentReceivesController extends BaseController {
  @Inject()
  paymentReceiveService: PaymentReceiveService;

  @Inject()
  dynamicListService: DynamicListingService;
 
  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/:id',
      this.editPaymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.editPaymentReceive.bind(this)),
      this.handleServiceErrors,
    );
    router.post(
      '/',
      this.newPaymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.newPaymentReceive.bind(this)),
      this.handleServiceErrors,
    );
    router.get(
      '/:id',
      this.paymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.getPaymentReceive.bind(this)),
      this.handleServiceErrors,
    );
    router.get(
      '/',
      this.validatePaymentReceiveList,
      this.validationResult,
      asyncMiddleware(this.getPaymentReceiveList.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse,
    );
    router.delete(
      '/:id',
      this.paymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.deletePaymentReceive.bind(this)),
      this.handleServiceErrors,
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
   * Edit payment receive validation.
   */
  get editPaymentReceiveValidation() {
    return [
      param('id').exists().isNumeric().toInt(),
      ...this.paymentReceiveSchema,
    ];
  }

  /**
   * Records payment receive to the given customer with associated invoices.
   */
  async newPaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const paymentReceive: IPaymentReceiveDTO = this.matchedBodyData(req);

    try {
      const storedPaymentReceive = await this.paymentReceiveService
        .createPaymentReceive(
          tenantId,
          paymentReceive,
        );
      return res.status(200).send({
        id: storedPaymentReceive.id,
        message: 'The payment receive has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit the given payment receive.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async editPaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    const paymentReceive: IPaymentReceiveDTO = this.matchedBodyData(req);

    try {
      await this.paymentReceiveService.editPaymentReceive(
        tenantId, paymentReceiveId, paymentReceive,
      );
      return res.status(200).send({ id: paymentReceiveId });  
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delets the given payment receive id.
   * @param {Request} req
   * @param {Response} res
   */
  async deletePaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      await this.paymentReceiveService.deletePaymentReceive(tenantId, paymentReceiveId);

      return res.status(200).send({
        id: paymentReceiveId,
        message: 'The payment receive has been deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the given payment receive details.
   * @asycn
   * @param {Request} req -
   * @param {Response} res -
   */
  async getPaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const paymentReceive = await this.paymentReceiveService.getPaymentReceive(
        tenantId, paymentReceiveId
      );
      return res.status(200).send({ paymentReceive });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve payment receive list with pagination metadata.
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response} 
   */
  async getPaymentReceiveList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      filterRoles: [],
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    if (filter.stringifiedFilterRoles) {
      filter.filterRoles = JSON.parse(filter.stringifiedFilterRoles);
    }

    try {
      const {
        paymentReceives,
        pagination,
        filterMeta,
      } = await this.paymentReceiveService.listPaymentReceives(tenantId, filter);

      return res.status(200).send({
        payment_receives: paymentReceives,
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles service errors.
   * @param error 
   * @param req 
   * @param res 
   * @param next 
   */
  handleServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'DEPOSIT_ACCOUNT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 }],
        });
      }
      if (error.errorType === 'PAYMENT_RECEIVE_NO_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PAYMENT_RECEIVE_NO_EXISTS', code: 300 }],
        });
      }
      if (error.errorType === 'PAYMENT_RECEIVE_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PAYMENT_RECEIVE_NOT_EXISTS', code: 300 }],
        });
      }
      if (error.errorType === 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET_TYPE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET_TYPE', code: 300 }],
        });
      }
      if (error.errorType === 'INVALID_PAYMENT_AMOUNT_INVALID') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_PAYMENT_AMOUNT', code: 300 }],
        });
      }
      if (error.errorType === 'INVOICES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVOICES_IDS_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 300 }],
        });
      }
    }
    next(error);
  }
}
