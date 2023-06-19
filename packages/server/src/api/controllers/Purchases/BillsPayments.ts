import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { ServiceError } from '@/exceptions';
import BaseController from '@/api/controllers/BaseController';
import BillPaymentsService from '@/services/Purchases/BillPayments/BillPayments';
import BillPaymentsPages from '@/services/Purchases/BillPayments/BillPaymentsPages';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { AbilitySubject, IPaymentMadeAction } from '@/interfaces';

/**
 * Bills payments controller.
 * @service
 */
@Service()
export default class BillsPayments extends BaseController {
  @Inject()
  billPaymentService: BillPaymentsService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  billPaymentsPages: BillPaymentsPages;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(IPaymentMadeAction.Create, AbilitySubject.PaymentMade),
      [...this.billPaymentSchemaValidation],
      this.validationResult,
      asyncMiddleware(this.createBillPayment.bind(this)),
      this.handleServiceError
    );
    router.post(
      '/:id',
      CheckPolicies(IPaymentMadeAction.Edit, AbilitySubject.PaymentMade),
      [
        ...this.billPaymentSchemaValidation,
        ...this.specificBillPaymentValidateSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editBillPayment.bind(this)),
      this.handleServiceError
    );
    router.delete(
      '/:id',
      CheckPolicies(IPaymentMadeAction.Delete, AbilitySubject.PaymentMade),
      [...this.specificBillPaymentValidateSchema],
      this.validationResult,
      asyncMiddleware(this.deleteBillPayment.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/new-page/entries',
      CheckPolicies(IPaymentMadeAction.View, AbilitySubject.PaymentMade),
      [query('vendor_id').exists()],
      this.validationResult,
      asyncMiddleware(this.getBillPaymentNewPageEntries.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id/edit-page',
      CheckPolicies(IPaymentMadeAction.View, AbilitySubject.PaymentMade),
      this.specificBillPaymentValidateSchema,
      this.validationResult,
      asyncMiddleware(this.getBillPaymentEditPage.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id/bills',
      CheckPolicies(IPaymentMadeAction.View, AbilitySubject.PaymentMade),
      this.specificBillPaymentValidateSchema,
      this.validationResult,
      asyncMiddleware(this.getPaymentBills.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id',
      CheckPolicies(IPaymentMadeAction.View, AbilitySubject.PaymentMade),
      this.specificBillPaymentValidateSchema,
      this.validationResult,
      asyncMiddleware(this.getBillPayment.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/',
      CheckPolicies(IPaymentMadeAction.View, AbilitySubject.PaymentMade),
      this.listingValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getBillsPayments.bind(this)),
      this.handleServiceError,
      this.dynamicListService.handlerErrorsToResponse
    );
    return router;
  }

  /**
   * Bill payments schema validation.
   * @return {ValidationChain[]}
   */
  get billPaymentSchemaValidation(): ValidationChain[] {
    return [
      check('vendor_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('payment_account_id').exists().isNumeric().toInt(),
      check('payment_number').optional({ nullable: true }).trim().escape(),
      check('payment_date').exists(),
      check('statement').optional().trim().escape(),
      check('reference').optional().trim().escape(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.index').optional().isNumeric().toInt(),
      check('entries.*.bill_id').exists().isNumeric().toInt(),
      check('entries.*.payment_amount').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Specific bill payment schema validation.
   * @returns {ValidationChain[]}
   */
  get specificBillPaymentValidateSchema(): ValidationChain[] {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Bills payment list validation schema.
   * @returns {ValidationChain[]}
   */
  get listingValidationSchema(): ValidationChain[] {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Retrieve bill payment new page entries.
   * @param {Request} req -
   * @param {Response} res -
   */
  async getBillPaymentNewPageEntries(req: Request, res: Response) {
    const { tenantId } = req;
    const { vendorId } = this.matchedQueryData(req);

    try {
      const entries = await this.billPaymentsPages.getNewPageEntries(
        tenantId,
        vendorId
      );
      return res.status(200).send({
        entries: this.transformToResponse(entries),
      });
    } catch (error) {}
  }

  /**
   * Retrieve the bill payment edit page details.
   * @param {Request} req
   * @param {Response} res
   */
  async getBillPaymentEditPage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const { id: paymentReceiveId } = req.params;

    try {
      const { billPayment, entries } =
        await this.billPaymentsPages.getBillPaymentEditPage(
          tenantId,
          paymentReceiveId
        );

      return res.status(200).send({
        bill_payment: this.transformToResponse(billPayment),
        entries: this.transformToResponse(entries),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a bill payment.
   * @async
   * @param {Request} req
   * @param {Response} res
   * @param {Response} res
   */
  async createBillPayment(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const billPaymentDTO = this.matchedBodyData(req);

    try {
      const billPayment = await this.billPaymentService.createBillPayment(
        tenantId,
        billPaymentDTO
      );

      return res.status(200).send({
        id: billPayment.id,
        message: 'Payment made has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits the given bill payment details.
   * @param {Request} req
   * @param {Response} res
   */
  async editBillPayment(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const billPaymentDTO = this.matchedBodyData(req);
    const { id: billPaymentId } = req.params;

    try {
      const paymentMade = await this.billPaymentService.editBillPayment(
        tenantId,
        billPaymentId,
        billPaymentDTO
      );
      return res.status(200).send({
        id: paymentMade.id,
        message: 'Payment made has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the bill payment and revert the journal
   * transactions with accounts balance.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response} res -
   */
  async deleteBillPayment(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: billPaymentId } = req.params;

    try {
      await this.billPaymentService.deleteBillPayment(tenantId, billPaymentId);

      return res.status(200).send({
        id: billPaymentId,
        message: 'Payment made has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the bill payment.
   * @param {Request} req
   * @param {Response} res
   */
  async getBillPayment(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: billPaymentId } = req.params;

    try {
      const billPayment = await this.billPaymentService.getBillPayment(
        tenantId,
        billPaymentId
      );

      return res.status(200).send({
        bill_payment: this.transformToResponse(billPayment),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve associated bills for the given payment made.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getPaymentBills(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: billPaymentId } = req.params;

    try {
      const bills = await this.billPaymentService.getPaymentBills(
        tenantId,
        billPaymentId
      );
      return res.status(200).send({ bills });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve bills payments listing with pagination metadata.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  async getBillsPayments(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const billPaymentsFilter = {
      page: 1,
      pageSize: 12,
      filterRoles: [],
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...this.matchedQueryData(req),
    };

    try {
      const { billPayments, pagination, filterMeta } =
        await this.billPaymentService.listBillPayments(
          tenantId,
          billPaymentsFilter
        );

      return res.status(200).send({
        bill_payments: this.transformToResponse(billPayments),
        pagination: this.transformToResponse(pagination),
        filter_meta: this.transformToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  handleServiceError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'PAYMENT_MADE_NOT_FOUND') {
        return res.status(404).send({
          message: 'Payment made not found.',
          errors: [{ type: 'BILL_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'VENDOR_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILL.PAYMENT.VENDOR.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_NOT_CURRENT_ASSET_TYPE') {
        return res.status(400).send({
          errors: [
            { type: 'PAYMENT_ACCOUNT.NOT.CURRENT_ASSET.TYPE', code: 300 },
          ],
        });
      }
      if (error.errorType === 'BILL_PAYMENT_NUMBER_NOT_UNQIUE') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT.NUMBER.NOT.UNIQUE', code: 400 }],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 600 }],
        });
      }
      if (error.errorType === '') {
        return res.status(400).send({
          errors: [{ type: 'BILLS.IDS.NOT.EXISTS', code: 700 }],
        });
      }
      if (error.errorType === 'BILL_PAYMENT_ENTRIES_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ENTRIES.IDS.NOT.FOUND', code: 800 }],
        });
      }
      if (error.errorType === 'INVALID_BILL_PAYMENT_AMOUNT') {
        return res.status(400).send({
          errors: [{ type: 'INVALID_BILL_PAYMENT_AMOUNT', code: 900 }],
        });
      }
      if (error.errorType === 'BILL_ENTRIES_IDS_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILLS_NOT_FOUND', code: 1000 }],
        });
      }
      if (error.errorType === 'PAYMENT_NUMBER_SHOULD_NOT_MODIFY') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT_NUMBER_SHOULD_NOT_MODIFY', code: 1100 }],
        });
      }
      if (error.errorType === 'BILLS_NOT_OPENED_YET') {
        return res.status(400).send({
          errors: [
            {
              type: 'BILLS_NOT_OPENED_YET',
              message: 'The given bills are not opened yet.',
              code: 1200,
            },
          ],
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
      if (error.errorType === 'WITHDRAWAL_ACCOUNT_CURRENCY_INVALID') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'WITHDRAWAL_ACCOUNT_CURRENCY_INVALID', code: 1300 }],
        });
      }
    }
    next(error);
  }
}
