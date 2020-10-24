import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import SaleReceiptService from 'services/Sales/SalesReceipts';
import BaseController from '../BaseController';
import { ISaleReceiptDTO } from 'interfaces/SaleReceipt';
import { ServiceError } from 'exceptions';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class SalesReceiptsController extends BaseController{
  @Inject()
  saleReceiptService: SaleReceiptService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/:id', [
        ...this.specificReceiptValidationSchema,
        ...this.salesReceiptsValidationSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editSaleReceipt.bind(this)),
      this.handleServiceErrors,
    );
    router.post(
      '/',
      this.salesReceiptsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.newSaleReceipt.bind(this)),
      this.handleServiceErrors,
    );
    router.delete(
      '/:id',
      this.specificReceiptValidationSchema,
      this.validationResult,
      asyncMiddleware(this.deleteSaleReceipt.bind(this)),
      this.handleServiceErrors,
    );
    router.get(
      '/',
      this.listSalesReceiptsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.getSalesReceipts.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse,
    );
    return router;
  }

  /**
   * Sales receipt validation schema.
   * @return {Array}
   */
  get salesReceiptsValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('deposit_account_id').exists().isNumeric().toInt(),
      check('receipt_date').exists().isISO8601(),
      check('send_to_email').optional().isEmail(),
      check('reference_no').optional().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
      
      check('entries.*.id').optional({ nullable: true }).isNumeric().toInt(),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toInt(),
      check('entries.*.discount').optional().isNumeric().toInt(),

      check('receipt_message').optional().trim().escape(),
      check('statement').optional().trim().escape(),
    ];
  }

  /**
   * Specific sale receipt validation schema.
   */
  get specificReceiptValidationSchema() {
    return [
      param('id').exists().isNumeric().toInt()
    ];
  }

  /**
   * List sales receipts validation schema.
   */
  get listSalesReceiptsValidationSchema() {
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
   * Creates a new receipt.
   * @param {Request} req 
   * @param {Response} res 
   */
  async newSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const saleReceiptDTO: ISaleReceiptDTO = this.matchedBodyData(req);

    try {
      // Store the given sale receipt details with associated entries.
      const storedSaleReceipt = await this.saleReceiptService
        .createSaleReceipt(
          tenantId,
          saleReceiptDTO,
        );
      return res.status(200).send({
        id: storedSaleReceipt.id,
        message: 'Sale receipt has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the sale receipt with associated entries and journal transactions.
   * @param {Request} req 
   * @param {Response} res 
   */
  async deleteSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    try {
      // Deletes the sale receipt.
      await this.saleReceiptService.deleteSaleReceipt(tenantId, saleReceiptId);
  
      return res.status(200).send({
        id: saleReceiptId,
        message: 'Sale receipt has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edit the sale receipt details with associated entries and re-write
   * journal transaction on the same date.
   * @param {Request} req - 
   * @param {Response} res - 
   */
  async editSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;
    const saleReceipt = this.matchedBodyData(req);

    try {
      // Update the given sale receipt details.
      await this.saleReceiptService.editSaleReceipt(
        tenantId,
        saleReceiptId,
        saleReceipt,
      );
      return res.status(200).send({
        id: saleReceiptId,
        message: 'Sale receipt has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listing sales receipts.
   * @param {Request} req 
   * @param {Response} res
   */
  async getSalesReceipts(req: Request, res: Response, next: NextFunction) {
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
      const { salesReceipts, pagination, filterMeta } = await this.saleReceiptService
        .salesReceiptsList(tenantId, filter);

      return res.status(200).send({
        sale_receipts: salesReceipts,
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }


  handleServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'SALE_RECEIPT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_RECEIPT_NOT_FOUND', code: 100 }],
        })
      }
      if (error.errorType === 'DEPOSIT_ACCOUNT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_NOT_FOUND', code: 200 }],
        })
      }
      if (error.errorType === 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT_ACCOUNT_NOT_CURRENT_ASSET', code: 300 }],
        })
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 400, }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES_IDS_NOT_FOUND', code: 500, }],
        });
      }
      if (error.errorType === 'NOT_SELL_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELL_ABLE_ITEMS', code: 600, }],
        });
      }
      if (error.errorType === 'SALE.RECEIPT.NOT.FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 700 }],
        });
      }
      if (error.errorType === 'DEPOSIT.ACCOUNT.NOT.EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 800 }],
        });
      }
    }
    console.log(error);
    next(error);
  }
};
