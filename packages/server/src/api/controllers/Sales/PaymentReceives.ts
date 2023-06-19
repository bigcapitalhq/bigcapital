import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import { Inject, Service } from 'typedi';
import {
  AbilitySubject,
  IPaymentReceiveDTO,
  PaymentReceiveAction,
  SaleInvoiceAction,
} from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import PaymentReceiveService from '@/services/Sales/PaymentReceives/PaymentsReceives';
import PaymentReceivesPages from '@/services/Sales/PaymentReceives/PaymentReceivesPages';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import PaymentReceiveNotifyBySms from '@/services/Sales/PaymentReceives/PaymentReceiveSmsNotify';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import GetPaymentReceivePdf from '@/services/Sales/PaymentReceives/GetPaymentReceivePdf';

/**
 * Payments receives controller.
 * @service
 */
@Service()
export default class PaymentReceivesController extends BaseController {
  @Inject()
  paymentReceiveService: PaymentReceiveService;

  @Inject()
  PaymentReceivesPages: PaymentReceivesPages;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  paymentReceiveSmsNotify: PaymentReceiveNotifyBySms;

  @Inject()
  paymentReceivePdf: GetPaymentReceivePdf;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/:id',
      CheckPolicies(PaymentReceiveAction.Edit, AbilitySubject.PaymentReceive),
      this.editPaymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.editPaymentReceive.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/notify-by-sms',
      CheckPolicies(
        PaymentReceiveAction.NotifyBySms,
        AbilitySubject.PaymentReceive
      ),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.paymentReceiveNotifyBySms),
      this.handleServiceErrors
    );
    router.get(
      '/:id/sms-details',
      CheckPolicies(
        PaymentReceiveAction.NotifyBySms,
        AbilitySubject.PaymentReceive
      ),
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.paymentReceiveSmsDetails),
      this.handleServiceErrors
    );
    router.post(
      '/',
      CheckPolicies(PaymentReceiveAction.Create, AbilitySubject.PaymentReceive),
      [...this.newPaymentReceiveValidation],
      this.validationResult,
      asyncMiddleware(this.newPaymentReceive.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id/edit-page',
      CheckPolicies(PaymentReceiveAction.Edit, AbilitySubject.PaymentReceive),
      this.paymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.getPaymentReceiveEditPage.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/new-page/entries',
      CheckPolicies(PaymentReceiveAction.View, AbilitySubject.PaymentReceive),
      [query('customer_id').exists().isNumeric().toInt()],
      this.validationResult,
      asyncMiddleware(this.getPaymentReceiveNewPageEntries.bind(this)),
      this.getPaymentReceiveNewPageEntries.bind(this)
    );
    router.get(
      '/:id/invoices',
      CheckPolicies(PaymentReceiveAction.View, AbilitySubject.PaymentReceive),
      this.paymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.getPaymentReceiveInvoices.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(PaymentReceiveAction.View, AbilitySubject.PaymentReceive),
      this.paymentReceiveValidation,
      this.asyncMiddleware(this.getPaymentReceive.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(PaymentReceiveAction.View, AbilitySubject.PaymentReceive),
      this.validatePaymentReceiveList,
      this.validationResult,
      asyncMiddleware(this.getPaymentReceiveList.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse
    );
    router.delete(
      '/:id',
      CheckPolicies(PaymentReceiveAction.Delete, AbilitySubject.PaymentReceive),
      this.paymentReceiveValidation,
      this.validationResult,
      asyncMiddleware(this.deletePaymentReceive.bind(this)),
      this.handleServiceErrors
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
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('payment_date').exists(),
      check('reference_no').optional(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('payment_receive_no').optional({ nullable: true }).trim().escape(),
      check('statement').optional().trim().escape(),

      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').isArray({ min: 1 }),

      check('entries.*.id').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.index').optional().isNumeric().toInt(),
      check('entries.*.invoice_id').exists().isNumeric().toInt(),
      check('entries.*.payment_amount').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Payment receive list validation schema.
   */
  get validatePaymentReceiveList(): ValidationChain[] {
    return [
      query('stringified_filter_roles').optional().isJSON(),

      query('view_slug').optional({ nullable: true }).isString().trim(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
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
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async newPaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const paymentReceive: IPaymentReceiveDTO = this.matchedBodyData(req);

    try {
      const storedPaymentReceive =
        await this.paymentReceiveService.createPaymentReceive(
          tenantId,
          paymentReceive,
          user
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
    const { tenantId, user } = req;
    const { id: paymentReceiveId } = req.params;

    const paymentReceive: IPaymentReceiveDTO = this.matchedBodyData(req);

    try {
      await this.paymentReceiveService.editPaymentReceive(
        tenantId,
        paymentReceiveId,
        paymentReceive,
        user
      );
      return res.status(200).send({
        id: paymentReceiveId,
        message: 'The payment receive has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given payment receive id.
   * @param {Request} req
   * @param {Response} res
   */
  async deletePaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      await this.paymentReceiveService.deletePaymentReceive(
        tenantId,
        paymentReceiveId,
        user
      );

      return res.status(200).send({
        id: paymentReceiveId,
        message: 'The payment receive has been deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve sale invoices that associated with the given payment receive.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getPaymentReceiveInvoices(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const saleInvoices =
        await this.paymentReceiveService.getPaymentReceiveInvoices(
          tenantId,
          paymentReceiveId
        );

      return res.status(200).send(this.transfromToResponse({ saleInvoices }));
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
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { paymentReceives, pagination, filterMeta } =
        await this.paymentReceiveService.listPaymentReceives(tenantId, filter);

      return res.status(200).send({
        payment_receives: this.transfromToResponse(paymentReceives),
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve payment receive new page receivable entries.
   * @param {Request} req - Request.
   * @param {Response} res - Response.
   */
  async getPaymentReceiveNewPageEntries(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { customerId } = this.matchedQueryData(req);

    try {
      const entries = await this.PaymentReceivesPages.getNewPageEntries(
        tenantId,
        customerId
      );
      return res.status(200).send({
        entries: this.transfromToResponse(entries),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the given payment receive details.
   * @async
   * @param {Request} req -
   * @param {Response} res -
   */
  async getPaymentReceiveEditPage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, user } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const { paymentReceive, entries } =
        await this.PaymentReceivesPages.getPaymentReceiveEditPage(
          tenantId,
          paymentReceiveId,
          user
        );

      return res.status(200).send({
        payment_receive: this.transfromToResponse({ ...paymentReceive }),
        entries: this.transfromToResponse([...entries]),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the payment receive details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getPaymentReceive(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const paymentReceive = await this.paymentReceiveService.getPaymentReceive(
        tenantId,
        paymentReceiveId
      );

      const ACCEPT_TYPE = {
        APPLICATION_PDF: 'application/pdf',
        APPLICATION_JSON: 'application/json',
      };
      res.format({
        [ACCEPT_TYPE.APPLICATION_JSON]: () => {
          return res.status(200).send({
            payment_receive: this.transfromToResponse(paymentReceive),
          });
        },
        [ACCEPT_TYPE.APPLICATION_PDF]: async () => {
          const pdfContent = await this.paymentReceivePdf.getPaymentReceivePdf(
            tenantId,
            paymentReceive
          );
          res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfContent.length,
          });
          res.send(pdfContent);
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Payment receive notify customer by sms.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public paymentReceiveNotifyBySms = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const paymentReceive = await this.paymentReceiveSmsNotify.notifyBySms(
        tenantId,
        paymentReceiveId
      );
      return res.status(200).send({
        id: paymentReceive.id,
        message: 'The payment notification has been sent successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public paymentReceiveSmsDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const smsDetails = await this.paymentReceiveSmsNotify.smsDetails(
        tenantId,
        paymentReceiveId
      );
      return res.status(200).send({
        data: smsDetails,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param error
   * @param req
   * @param res
   * @param next
   */
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      if (error.errorType === 'DEPOSIT_ACCOUNT_INVALID_TYPE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_INVALID_TYPE', code: 300 }],
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
      if (error.errorType === 'ENTRIES_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'INVALID_PAYMENT_AMOUNT') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_PAYMENT_AMOUNT', code: 1000 }],
        });
      }
      if (error.errorType === 'INVOICES_NOT_DELIVERED_YET') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'INVOICES_NOT_DELIVERED_YET',
              code: 200,
              data: {
                not_delivered_invoices_ids:
                  error.payload.notDeliveredInvoices.map(
                    (invoice) => invoice.id
                  ),
              },
            },
          ],
        });
      }
      if (error.errorType === 'PAYMENT_RECEIVE_NO_IS_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PAYMENT_RECEIVE_NO_IS_REQUIRED', code: 1100 }],
        });
      }
      if (error.errorType === 'PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PAYMENT_CUSTOMER_SHOULD_NOT_UPDATE', code: 1200 }],
        });
      }
      if (error.errorType === 'PAYMENT_RECEIVE_NO_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PAYMENT_RECEIVE_NO_REQUIRED', code: 1300 }],
        });
      }
      if (error.errorType === 'CUSTOMER_HAS_NO_PHONE_NUMBER') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_HAS_NO_PHONE_NUMBER', code: 1800 }],
        });
      }
      if (error.errorType === 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_SMS_NOTIFY_PHONE_INVALID', code: 1900 }],
        });
      }
      if (error.errorType === 'TRANSACTIONS_DATE_LOCKED') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'TRANSACTIONS_DATE_LOCKED',
              code: 4000,
              data: { ...error.payload },
            },
          ],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_CURRENCY_INVALID') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PAYMENT_ACCOUNT_CURRENCY_INVALID', code: 2000 }],
        });
      }
    }
    next(error);
  }
}
