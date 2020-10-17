
import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import { ServiceError } from 'exceptions';
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
      this.validationResult,
      asyncMiddleware(this.createBillPayment.bind(this)),
      this.handleServiceError,
    );
    router.post('/:id', [
       ...this.billPaymentSchemaValidation,
       ...this.specificBillPaymentValidateSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editBillPayment.bind(this)),
      this.handleServiceError,
    )
    router.delete('/:id', [
        ...this.specificBillPaymentValidateSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.deleteBillPayment.bind(this)),
      this.handleServiceError,
    );
    // router.get('/:id',
    //   this.specificBillPaymentValidateSchema,
    //   this.validationResult,
    //   asyncMiddleware(this.getBillPayment.bind(this)),
    // );
    // router.get('/', 
    //   this.listingValidationSchema,
    //   this.validationResult,
    //   asyncMiddleware(this.getBillsPayments.bind(this))
    // );
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
      const billPayment = await this.billPaymentService.createBillPayment(tenantId, billPaymentDTO);

      return res.status(200).send({
        id: billPayment.id,
        message: 'Payment made has been created successfully.',
      });
    } catch (error) {
      console.log(error);
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
  async getBillsPayments(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req.params;
    const billPaymentsFilter = this.matchedQueryData(req);

    try {
      const { billPayments, pagination, filterMeta } = await this.billPaymentService
        .listBillPayments(tenantId, billPaymentsFilter);
      
      return res.status(200).send({
        bill_payments: billPayments,
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta)
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
  handleServiceError(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'PAYMENT_MADE_NOT_FOUND') {
        return res.status(404).send({
          message: 'Payment made not found.',
        });
      }
      if (error.errorType === 'VENDOR_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILL.PAYMENT.VENDOR.NOT.FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_NOT_CURRENT_ASSET_TYPE') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT_ACCOUNT.NOT.CURRENT_ASSET.TYPE', code: 100 }],
        });
      }
      if (error.errorType === 'BILL_PAYMENT_NUMBER_NOT_UNQIUE') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT.NUMBER.NOT.UNIQUE', code: 300 }],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'PAYMENT_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'PAYMENT.ACCOUNT.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === '') {
        return res.status(400).send({
          errors: [{ type: 'BILLS.IDS.NOT.EXISTS', code: 600 }],
        });
      }
      if (error.errorType === 'BILL_PAYMENT_ENTRIES_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ENTEIES.IDS.NOT.FOUND', code: 800 }],
        });
      }
      if (error.errorType === 'INVALID_BILL_PAYMENT_AMOUNT') {
        return res.status(400).send({
          errors: [{ type: 'INVALID_BILL_PAYMENT_AMOUNT', code: 100 }],
        });
      }
      if (error.errorType === 'BILL_ENTRIES_IDS_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILLS_NOT_FOUND', code: 100 }],
        })
      }
    }
    console.log(error);
    next(error);
  }
}