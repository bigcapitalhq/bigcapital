import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import { AbilitySubject, BillAction, IBillDTO, IBillEditDTO } from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BillsService from '@/services/Purchases/Bills';
import BaseController from '@/api/controllers/BaseController';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import BillPaymentsService from '@/services/Purchases/BillPaymentsService';

@Service()
export default class BillsController extends BaseController {
  @Inject()
  private billsService: BillsService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private billPayments: BillPaymentsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(BillAction.Create, AbilitySubject.Bill),
      [...this.billValidationSchema],
      this.validationResult,
      asyncMiddleware(this.newBill.bind(this)),
      this.handleServiceError
    );
    router.post(
      '/:id/open',
      CheckPolicies(BillAction.Edit, AbilitySubject.Bill),
      [...this.specificBillValidationSchema],
      this.validationResult,
      asyncMiddleware(this.openBill.bind(this)),
      this.handleServiceError
    );
    router.post(
      '/:id',
      CheckPolicies(BillAction.Edit, AbilitySubject.Bill),
      [...this.billEditValidationSchema, ...this.specificBillValidationSchema],
      this.validationResult,
      asyncMiddleware(this.editBill.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/due',
      CheckPolicies(BillAction.View, AbilitySubject.Bill),
      [...this.dueBillsListingValidationSchema],
      this.validationResult,
      asyncMiddleware(this.getDueBills.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id',
      CheckPolicies(BillAction.View, AbilitySubject.Bill),
      [...this.specificBillValidationSchema],
      this.validationResult,
      asyncMiddleware(this.getBill.bind(this)),
      this.handleServiceError
    );
    router.get(
      '/:id/payment-transactions',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getBillPaymentsTransactions),
      this.handleServiceError
    );
    router.get(
      '/',
      CheckPolicies(BillAction.View, AbilitySubject.Bill),
      [...this.billsListingValidationSchema],
      this.validationResult,
      asyncMiddleware(this.billsList.bind(this)),
      this.handleServiceError,
      this.dynamicListService.handlerErrorsToResponse
    );
    router.delete(
      '/:id',
      CheckPolicies(BillAction.Delete, AbilitySubject.Bill),
      [...this.specificBillValidationSchema],
      this.validationResult,
      asyncMiddleware(this.deleteBill.bind(this)),
      this.handleServiceError
    );
    return router;
  }

  /**
   * Common validation schema.
   */
  get billValidationSchema() {
    return [
      check('bill_number').exists().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('bill_date').exists().isISO8601(),
      check('due_date').optional().isISO8601(),

      check('vendor_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
      check('project_id').optional({ nullable: true }).isNumeric().toInt(),

      check('note').optional().trim().escape(),
      check('open').default(false).isBoolean().toBoolean(),

      check('entries').isArray({ min: 1 }),

      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.landed_cost')
        .optional({ nullable: true })
        .isBoolean()
        .toBoolean(),
      check('entries.*.warehouse_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
    ];
  }

  /**
   * Common validation schema.
   */
  get billEditValidationSchema() {
    return [
      check('bill_number').optional().trim().escape(),
      check('reference_no').optional().trim().escape(),
      check('bill_date').exists().isISO8601(),
      check('due_date').optional().isISO8601(),

      check('vendor_id').exists().isNumeric().toInt(),
      check('exchange_rate').optional().isFloat({ gt: 0 }).toFloat(),

      check('warehouse_id').optional({ nullable: true }).isNumeric().toInt(),
      check('branch_id').optional({ nullable: true }).isNumeric().toInt(),
      check('project_id').optional({ nullable: true }).isNumeric().toInt(),

      check('note').optional().trim().escape(),
      check('open').default(false).isBoolean().toBoolean(),

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
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.landed_cost')
        .optional({ nullable: true })
        .isBoolean()
        .toBoolean(),
    ];
  }

  /**
   * Bill validation schema.
   */
  get specificBillValidationSchema() {
    return [param('id').exists().isNumeric().toInt()];
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

  get dueBillsListingValidationSchema() {
    return [
      query('vendor_id').optional().trim().escape(),
      query('payment_made_id').optional().trim().escape(),
    ];
  }

  /**
   * Creates a new bill and records journal transactions.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async newBill(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const billDTO: IBillDTO = this.matchedBodyData(req);

    try {
      const storedBill = await this.billsService.createBill(
        tenantId,
        billDTO,
        user
      );

      return res.status(200).send({
        id: storedBill.id,
        message: 'The bill has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit bill details with associated entries and rewrites journal transactions.
   * @param {Request} req
   * @param {Response} res
   */
  async editBill(req: Request, res: Response, next: NextFunction) {
    const { id: billId } = req.params;
    const { tenantId, user } = req;
    const billDTO: IBillEditDTO = this.matchedBodyData(req);

    try {
      await this.billsService.editBill(tenantId, billId, billDTO, user);

      return res.status(200).send({
        id: billId,
        message: 'The bill has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Open the given bill.
   * @param {Request} req -
   * @param {Response} res -
   */
  async openBill(req: Request, res: Response, next: NextFunction) {
    const { id: billId } = req.params;
    const { tenantId } = req;

    try {
      await this.billsService.openBill(tenantId, billId);

      return res.status(200).send({
        id: billId,
        message: 'The bill has been opened successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the given bill details with associated item entries.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  async getBill(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: billId } = req.params;

    try {
      const bill = await this.billsService.getBill(tenantId, billId);

      return res.status(200).send(this.transformToResponse({ bill }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given bill with associated entries and journal transactions.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  async deleteBill(req: Request, res: Response, next: NextFunction) {
    const billId = req.params.id;
    const { tenantId } = req;

    try {
      await this.billsService.deleteBill(tenantId, billId);

      return res.status(200).send({
        id: billId,
        message: 'The given bill deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listing bills with pagination meta.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response}
   */
  public async billsList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      page: 1,
      pageSize: 12,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...this.matchedQueryData(req),
    };

    try {
      const { bills, pagination, filterMeta } =
        await this.billsService.getBills(tenantId, filter);

      return res.status(200).send({
        bills: this.transformToResponse(bills),
        pagination: this.transformToResponse(pagination),
        filter_meta: this.transformToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listing all due bills of the given vendor.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getDueBills(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { vendorId } = this.matchedQueryData(req);

    try {
      const bills = await this.billsService.getDueBills(tenantId, vendorId);
      return res.status(200).send({ bills });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve payments transactions of specific bill.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public getBillPaymentsTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: billId } = req.params;

    try {
      const billPayments = await this.billPayments.getBillPayments(
        tenantId,
        billId
      );
      return res.status(200).send({
        data: billPayments,
      });
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
      if (error.errorType === 'BILL_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILL_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'BILL_NUMBER_EXISTS') {
        return res.status(400).send({
          errors: [{ type: 'BILL.NUMBER.EXISTS', code: 500 }],
        });
      }
      if (error.errorType === 'BILL_VENDOR_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILL_VENDOR_NOT_FOUND', code: 600 }],
        });
      }
      if (error.errorType === 'BILL_ITEMS_NOT_PURCHASABLE') {
        return res.status(400).send({
          errors: [{ type: 'BILL_ITEMS_NOT_PURCHASABLE', code: 700 }],
        });
      }
      if (error.errorType === 'NOT_PURCHASE_ABLE_ITEMS') {
        return res.status(400).send({
          errors: [{ type: 'NOT_PURCHASE_ABLE_ITEMS', code: 800 }],
        });
      }
      if (error.errorType === 'BILL_ITEMS_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ITEMS.IDS.NOT.FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'BILL_ENTRIES_IDS_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'BILL_ENTRIES_IDS_NOT_FOUND', code: 900 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 1000 }],
        });
      }
      if (error.errorType === 'BILL_ALREADY_OPEN') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'BILL_ALREADY_OPEN', code: 1100 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [
            {
              type: 'VENDOR_NOT_FOUND',
              message: 'Vendor not found.',
              code: 1200,
            },
          ],
        });
      }
      if (error.errorType === 'BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES') {
        return res.status(400).send({
          errors: [
            {
              type: 'BILL_HAS_ASSOCIATED_PAYMENT_ENTRIES',
              message:
                'Cannot delete bill that has associated payment transactions.',
              code: 1200,
            },
          ],
        });
      }
      if (error.errorType === 'BILL_HAS_ASSOCIATED_LANDED_COSTS') {
        return res.status(400).send({
          errors: [
            {
              type: 'BILL_HAS_ASSOCIATED_LANDED_COSTS',
              message:
                'Cannot delete bill that has associated landed cost transactions.',
              code: 1300,
            },
          ],
        });
      }
      if (error.errorType === 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED') {
        return res.status(400).send({
          errors: [
            {
              type: 'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
              code: 1400,
              message:
                'Bill entries that have landed cost type can not be deleted.',
            },
          ],
        });
      }
      if (
        error.errorType === 'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES'
      ) {
        return res.status(400).send({
          errors: [
            {
              type: 'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES',
              code: 1500,
            },
          ],
        });
      }
      if (error.errorType === 'LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS') {
        return res.status(400).send({
          errors: [
            {
              type: 'LANDED_COST_ENTRIES_SHOULD_BE_INVENTORY_ITEMS',
              message:
                'Landed cost entries should be only with inventory items.',
              code: 1600,
            },
          ],
        });
      }
      if (error.errorType === 'BILL_HAS_APPLIED_TO_VENDOR_CREDIT') {
        return res.status(400).send({
          errors: [{ type: 'BILL_HAS_APPLIED_TO_VENDOR_CREDIT', code: 1700 }],
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
