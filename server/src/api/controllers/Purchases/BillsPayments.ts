import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import { ServiceError } from 'exceptions';
import BaseController from 'api/controllers/BaseController';
import BillPaymentsService from 'services/Purchases/BillPayments';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import AccountsService from 'services/Accounts/AccountsService';
import ResourceController from '../Resources';
import { Request } from 'express-validator/src/base';

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

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      [...this.billPaymentSchemaValidation],
      this.validationResult,
      asyncMiddleware(this.createBillPayment.bind(this)),
      this.handleServiceError
    );
    router.post(
      '/:id',
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
      [...this.specificBillPaymentValidateSchema],
      this.validationResult,
      asyncMiddleware(this.deleteBillPayment.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/new-page/entries',
      [query('vendor_id').exists()],
      this.validationResult,
      asyncMiddleware(this.getBillPaymentNewPageEntries.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id/edit-page',
      this.specificBillPaymentValidateSchema,
      this.validationResult,
      asyncMiddleware(this.getBillPaymentEditPage.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id/bills',
      this.specificBillPaymentValidateSchema,
      this.validationResult,
      asyncMiddleware(this.getPaymentBills.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id',
      this.specificBillPaymentValidateSchema,
      this.validationResult,
      asyncMiddleware(this.getBillPayment.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/',
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
   */
  get billPaymentSchemaValidation(): ValidationChain[] {
    return [
      check('vendor_id').exists().isNumeric().toInt(),
      check('payment_account_id').exists().isNumeric().toInt(),
      check('payment_number').optional({ nullable: true }).trim().escape(),
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
    return [param('id').exists().isNumeric().toInt()];
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
   * Retrieve bill payment new page entries.
   * @param {Request} req -
   * @param {Response} res -
   */
  async getBillPaymentNewPageEntries(req: Request, res: Response) {
    const { tenantId } = req;
    const { vendorId } = this.matchedQueryData(req);

    try {
      const entries = await this.billPaymentService.getNewPageEntries(
        tenantId,
        vendorId
      );
      return res.status(200).send({
        entries: this.transfromToResponse(entries),
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
      const {
        billPayment,
        entries,
      } = await this.billPaymentService.getBillPaymentEditPage(
        tenantId,
        paymentReceiveId
      );

      return res.status(200).send({
        bill_payment: this.transfromToResponse(billPayment),
        entries: this.transfromToResponse(entries),
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
        bill_payment: this.transfromToResponse(billPayment),
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
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      ...this.matchedQueryData(req),
    };

    try {
      const {
        billPayments,
        pagination,
        filterMeta,
      } = await this.billPaymentService.listBillPayments(
        tenantId,
        billPaymentsFilter
      );

      return res.status(200).send({
        bill_payments: billPayments,
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
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
          errors: [{ type: 'ENTEIES.IDS.NOT.FOUND', code: 800 }],
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
    }
    next(error);
  }
}
