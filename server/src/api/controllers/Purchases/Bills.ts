import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Service, Inject } from 'typedi';
import { IBillDTO, IBillEditDTO } from 'interfaces';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import BillsService from 'services/Purchases/Bills';
import BaseController from 'api/controllers/BaseController';
import ItemsService from 'services/Items/ItemsService';
import TenancyService from 'services/Tenancy/TenancyService';
import { ServiceError } from 'exceptions';

@Service()
export default class BillsController extends BaseController {
  @Inject()
  itemsService: ItemsService;

  @Inject()
  billsService: BillsService;

  @Inject()
  tenancy: TenancyService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/', [
        ...this.billValidationSchema
      ],
      this.validationResult,
      asyncMiddleware(this.newBill.bind(this)),
      this.handleServiceError,
    );
    router.post(
      '/:id', [
        ...this.billValidationSchema,
        ...this.specificBillValidationSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editBill.bind(this))
    );
    router.get(
      '/:id', [
        ...this.specificBillValidationSchema
      ],
      this.validationResult,
      asyncMiddleware(this.getBill.bind(this)),
    );
 
    // router.get(
    //   '/:id',
    //   [...this.specificBillValidationSchema],
    //   this.validationResult,
    //   asyncMiddleware(this.getBill.bind(this)),
    //   this.handleServiceError,
    // );
    // router.get(
    //   '/',
    //   [...this.billsListingValidationSchema],
    //   this.validationResult,
    //   asyncMiddleware(this.listingBills.bind(this)),
    //   this.handleServiceError,
    // );
    router.delete(
      '/:id',
      [...this.specificBillValidationSchema],
      this.validationResult,
      asyncMiddleware(this.deleteBill.bind(this)),
      this.handleServiceError,
    );
    return router;
  }

  /**
   * Common validation schema.
   */
  get billValidationSchema() {
    return [
      check('bill_number').exists().trim().escape(),
      check('bill_date').exists().isISO8601(),
      check('due_date').optional().isISO8601(),
      check('vendor_id').exists().isNumeric().toInt(),
      check('note').optional().trim().escape(),
      check('entries').isArray({ min: 1 }),

      check('entries.*.id').optional().isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
    ];
  }

  /**
   * Common validation schema.
   */
  get billEditValidationSchema() {
    return [
      // check('bill_number').exists().trim().escape(),
      check('bill_date').exists().isISO8601(),
      check('due_date').optional().isISO8601(),
      // check('vendor_id').exists().isNumeric().toInt(),
      check('note').optional().trim().escape(),
      check('entries').isArray({ min: 1 }),

      check('entries.*.id').optional().isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.quantity').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('entries.*.description').optional().trim().escape(),
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
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
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
      const storedBill = await this.billsService.createBill(tenantId, billDTO, user);
      return res.status(200).send({ id: storedBill.id });
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
    const { tenantId } = req;
    const billDTO: IBillEditDTO = this.matchedBodyData(req);

    try {
      const editedBill = await this.billsService.editBill(tenantId, billId, billDTO);
      return res.status(200).send({ id: billId });
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
      const bill = await this.billsService.getBillWithMetadata(tenantId, billId);

      return res.status(200).send({ bill });
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
  async billsList(req: Request, res: Response) {
    
  }

  /**
   * Handles service errors.
   * @param {Error} error 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  handleServiceError(error: Error, req: Request, res: Response, next: NextFunction) {
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
          errors: [{ type: 'BILL_ITEMS_NOT_PURCHASABLE', code: 700 }]
        })
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
    }
    next(error);    
  }
}
