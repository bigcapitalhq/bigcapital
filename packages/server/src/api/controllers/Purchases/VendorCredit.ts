import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import {
  AbilitySubject,
  DiscountType,
  IVendorCreditCreateDTO,
  IVendorCreditEditDTO,
  VendorCreditAction,
} from '@/interfaces';
import BaseController from '@/api/controllers/BaseController';
import TenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import CreateVendorCredit from '@/services/Purchases/VendorCredits/CreateVendorCredit';
import EditVendorCredit from '@/services/Purchases/VendorCredits/EditVendorCredit';
import DeleteVendorCredit from '@/services/Purchases/VendorCredits/DeleteVendorCredit';
import GetVendorCredit from '@/services/Purchases/VendorCredits/GetVendorCredit';
import ListVendorCredits from '@/services/Purchases/VendorCredits/ListVendorCredits';
import CreateRefundVendorCredit from '@/services/Purchases/VendorCredits/RefundVendorCredits/CreateRefundVendorCredit';
import DeleteRefundVendorCredit from '@/services/Purchases/VendorCredits/RefundVendorCredits/DeleteRefundVendorCredit';
import ListVendorCreditRefunds from '@/services/Purchases/VendorCredits/RefundVendorCredits/ListRefundVendorCredits';
import OpenVendorCredit from '@/services/Purchases/VendorCredits/OpenVendorCredit';
import GetRefundVendorCredit from '@/services/Purchases/VendorCredits/RefundVendorCredits/GetRefundVendorCredit';

@Service()
export default class VendorCreditController extends BaseController {
  @Inject()
  createVendorCreditService: CreateVendorCredit;

  @Inject()
  editVendorCreditService: EditVendorCredit;

  @Inject()
  deleteVendorCreditService: DeleteVendorCredit;

  @Inject()
  getVendorCreditService: GetVendorCredit;

  @Inject()
  listCreditNotesService: ListVendorCredits;

  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject()
  createRefundCredit: CreateRefundVendorCredit;

  @Inject()
  deleteRefundCredit: DeleteRefundVendorCredit;

  @Inject()
  listRefundCredit: ListVendorCreditRefunds;

  @Inject()
  openVendorCreditService: OpenVendorCredit;

  @Inject()
  getRefundCredit: GetRefundVendorCredit;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(VendorCreditAction.Create, AbilitySubject.VendorCredit),
      this.vendorCreditCreateDTOSchema,
      this.validationResult,
      this.asyncMiddleware(this.newVendorCredit),
      this.handleServiceError
    );
    router.post(
      '/:id',
      CheckPolicies(VendorCreditAction.Edit, AbilitySubject.VendorCredit),
      this.vendorCreditEditDTOSchema,
      this.validationResult,
      this.asyncMiddleware(this.editVendorCredit),
      this.handleServiceError
    );
    router.get(
      '/:id',
      CheckPolicies(VendorCreditAction.View, AbilitySubject.VendorCredit),
      [],
      this.validationResult,
      this.asyncMiddleware(this.getVendorCredit),
      this.handleServiceError
    );
    router.get(
      '/',
      CheckPolicies(VendorCreditAction.View, AbilitySubject.VendorCredit),
      this.billsListingValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.getVendorCreditsList),
      this.handleServiceError,
      this.dynamicListService.handlerErrorsToResponse
    );
    router.delete(
      '/:id',
      CheckPolicies(VendorCreditAction.Delete, AbilitySubject.VendorCredit),
      this.deleteDTOValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.deleteVendorCredit),
      this.handleServiceError
    );
    router.post(
      '/:id/open',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.openVendorCreditTransaction),
      this.handleServiceError
    );
    router.get(
      '/:id/refund',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.vendorCreditRefundTransactions),
      this.handleServiceError
    );
    router.post(
      '/:id/refund',
      CheckPolicies(VendorCreditAction.Refund, AbilitySubject.VendorCredit),
      this.vendorCreditRefundValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.refundVendorCredit),
      this.handleServiceError
    );
    router.get(
      '/refunds/:refundId',
      this.getRefundCreditTransactionSchema,
      this.validationResult,
      this.asyncMiddleware(this.getRefundCreditTransaction),
      this.handleServiceError
    );
    router.delete(
      '/refunds/:refundId',
      CheckPolicies(VendorCreditAction.Refund, AbilitySubject.VendorCredit),
      this.deleteRefundVendorCreditSchema,
      this.validationResult,
      this.asyncMiddleware(this.deleteRefundVendorCredit),
      this.handleServiceError
    );
    return router;
  }

  /**
   * Common validation schema.
   */
  get vendorCreditCreateDTOSchema() {
    return [
      check('vendor_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('vendor_credit_number').optional({ nullable: true }).trim(),
      check('reference_no').optional().trim(),
      check('vendor_credit_date').exists().isISO8601().toDate(),
      check('note').optional().trim(),
      check('open').default(false).isBoolean().toBoolean(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').isArray({ min: 1 }),

      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.discount_type')
        .default(DiscountType.Percentage)
        .isString()
        .isIn([DiscountType.Percentage, DiscountType.Amount]),
      check('entries.*.description').optional({ nullable: true }).trim(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),

      check('attachments').isArray().optional(),
      check('attachments.*.key').exists().isString(),

      // Discount.
      check('discount').optional({ nullable: true }).isNumeric().toFloat(),
      check('discount_type')
        .optional({ nullable: true })
        .isString()
        .isIn([DiscountType.Percentage, DiscountType.Amount]),

      // Adjustment.
      check('adjustment').optional({ nullable: true }).isNumeric().toFloat(),
    ];
  }

  /**
   * Common validation schema.
   */
  get vendorCreditEditDTOSchema() {
    return [
      param('id').exists().isNumeric().toInt(),

      check('vendor_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('vendor_credit_number').optional({ nullable: true }).trim(),
      check('reference_no').optional().trim(),
      check('vendor_credit_date').exists().isISO8601().toDate(),
      check('note').optional().trim(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),

      check('entries').isArray({ min: 1 }),
      check('entries.*.id').optional().isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.discount_type')
        .default(DiscountType.Percentage)
        .isString()
        .isIn([DiscountType.Percentage, DiscountType.Amount]),
      check('entries.*.description').optional({ nullable: true }).trim(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),

      check('attachments').isArray().optional(),
      check('attachments.*.key').exists().isString(),

      // Discount.
      check('discount').optional({ nullable: true }).isNumeric().toFloat(),
      check('discount_type')
        .optional({ nullable: true })
        .isString()
        .isIn([DiscountType.Percentage, DiscountType.Amount]),

      // Adjustment.
      check('adjustment').optional({ nullable: true }).isNumeric().toFloat(),
    ];
  }

  /**
   * Bills list validation schema.
   */
  get billsListingValidationSchema() {
    return [
      query('view_slug').optional().isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   *
   */
  get deleteDTOValidationSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  get getRefundCreditTransactionSchema() {
    return [param('refundId').exists().isNumeric().toInt()];
  }

  get deleteRefundVendorCreditSchema() {
    return [];
  }

  /**
   * Refund vendor credit validation schema.
   */
  get vendorCreditRefundValidationSchema() {
    return [
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('description').exists(),

      check('amount').exists().isNumeric().toFloat(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('reference_no').optional(),
      check('date').exists().isISO8601().toDate(),

      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
    ];
  }

  /**
   * Creates a new bill and records journal transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  private newVendorCredit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId, user } = req;
    const vendorCreditCreateDTO: IVendorCreditCreateDTO =
      this.matchedBodyData(req);

    try {
      const vendorCredit = await this.createVendorCreditService.newVendorCredit(
        tenantId,
        vendorCreditCreateDTO
      );

      return res.status(200).send({
        id: vendorCredit.id,
        message: 'The vendor credit has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edit bill details with associated entries and rewrites journal transactions.
   * @param {Request} req
   * @param {Response} res
   */
  private editVendorCredit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id: vendorCreditId } = req.params;
    const { tenantId, user } = req;
    const vendorCreditEditDTO: IVendorCreditEditDTO = this.matchedBodyData(req);

    try {
      await this.editVendorCreditService.editVendorCredit(
        tenantId,
        vendorCreditId,
        vendorCreditEditDTO
      );

      return res.status(200).send({
        id: vendorCreditId,
        message: 'The vendor credit has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the given bill details with associated item entries.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private getVendorCredit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: billId } = req.params;

    try {
      const data = await this.getVendorCreditService.getVendorCredit(
        tenantId,
        billId
      );

      return res.status(200).send({ data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the given bill with associated entries and journal transactions.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  private deleteVendorCredit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const vendorCreditId = req.params.id;
    const { tenantId } = req;

    try {
      await this.deleteVendorCreditService.deleteVendorCredit(
        tenantId,
        vendorCreditId
      );

      return res.status(200).send({
        id: vendorCreditId,
        message: 'The given vendor credit has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve vendor credits list.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private getVendorCreditsList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { vendorCredits, pagination, filterMeta } =
        await this.listCreditNotesService.getVendorCredits(tenantId, filter);

      return res.status(200).send({ vendorCredits, pagination, filterMeta });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refunds vendor credit.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private refundVendorCredit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const refundDTO = this.matchedBodyData(req);
    const { id: vendorCreditId } = req.params;
    const { tenantId } = req;

    try {
      const refundVendorCredit = await this.createRefundCredit.createRefund(
        tenantId,
        vendorCreditId,
        refundDTO
      );

      return res.status(200).send({
        id: refundVendorCredit.id,
        message: 'The vendor credit refund has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes refund vendor credit transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private deleteRefundVendorCredit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { refundId: vendorCreditId } = req.params;
    const { tenantId } = req;

    try {
      await this.deleteRefundCredit.deleteRefundVendorCreditRefund(
        tenantId,
        vendorCreditId
      );

      return res.status(200).send({
        id: vendorCreditId,
        message: 'The vendor credit refund has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve refunds transactions associated to vendor credit transaction.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private vendorCreditRefundTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id: vendorCreditId } = req.params;
    const { tenantId } = req;

    try {
      const transactions = await this.listRefundCredit.getVendorCreditRefunds(
        tenantId,
        vendorCreditId
      );
      return res.status(200).send({ data: transactions });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Open vendor credit transaction.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   */
  private openVendorCreditTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id: vendorCreditId } = req.params;
    const { tenantId } = req;

    try {
      await this.openVendorCreditService.openVendorCredit(
        tenantId,
        vendorCreditId
      );

      return res.status(200).send({
        id: vendorCreditId,
        message: 'The vendor credit has been opened successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private getRefundCreditTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { refundId } = req.params;
    const { tenantId } = req;

    try {
      const refundCredit =
        await this.getRefundCredit.getRefundCreditTransaction(
          tenantId,
          refundId
        );
      return res.status(200).send({ refundCredit });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleServiceError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'ENTRIES_ITEMS_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_ITEMS_IDS_NOT_EXISTS', code: 100 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR_NOT_FOUND', code: 300 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR_CREDIT_NOT_FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'DEPOSIT_ACCOUNT_INVALID_TYPE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_INVALID_TYPE', code: 600 }],
        });
      }
      if (error.errorType === 'REFUND_VENDOR_CREDIT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'REFUND_VENDOR_CREDIT_NOT_FOUND', code: 700 }],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_HAS_NO_CREDITS_REMAINING') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'VENDOR_CREDIT_HAS_NO_CREDITS_REMAINING', code: 800 },
          ],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_ALREADY_OPENED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR_CREDIT_ALREADY_OPENED', code: 900 }],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_HAS_APPLIED_BILLS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR_CREDIT_HAS_APPLIED_BILLS', code: 1000 }],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS', code: 1200 },
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
    }
    next(error);
  }
}
