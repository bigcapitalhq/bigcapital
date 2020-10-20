import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import AccountsService from 'services/Accounts/AccountsService';
import ItemsService from 'services/Items/ItemsService';
import SaleReceiptService from 'services/Sales/SalesReceipts';
import BaseController from '../BaseController';
import { ISaleReceiptDTO } from 'interfaces/SaleReceipt';

@Service()
export default class SalesReceiptsController extends BaseController{
  @Inject()
  saleReceiptService: SaleReceiptService;

  @Inject()
  accountsService: AccountsService;

  @Inject()
  itemsService: ItemsService;

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
      asyncMiddleware(this.validateSaleReceiptExistance.bind(this)),
      asyncMiddleware(this.validateReceiptCustomerExistance.bind(this)),
      asyncMiddleware(this.validateReceiptDepositAccountExistance.bind(this)),
      asyncMiddleware(this.validateReceiptItemsIdsExistance.bind(this)),
      asyncMiddleware(this.validateReceiptEntriesIds.bind(this)),
      asyncMiddleware(this.editSaleReceipt.bind(this))
    );
    router.post(
      '/',
      this.salesReceiptsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.validateReceiptCustomerExistance.bind(this)),
      asyncMiddleware(this.validateReceiptDepositAccountExistance.bind(this)),
      asyncMiddleware(this.validateReceiptItemsIdsExistance.bind(this)),
      asyncMiddleware(this.newSaleReceipt.bind(this))
    );
    router.delete(
      '/:id',
      this.specificReceiptValidationSchema,
      this.validationResult,
      asyncMiddleware(this.validateSaleReceiptExistance.bind(this)),
      asyncMiddleware(this.deleteSaleReceipt.bind(this))
    );
    router.get(
      '/',
      this.listSalesReceiptsValidationSchema,
      this.validationResult,
      asyncMiddleware(this.listingSalesReceipts.bind(this))
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
   * @param {Request} req 
   * @param {Response} res 
   */
  async editSaleReceipt(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;
    const saleReceipt = { ...req.body };

    try {
      // Update the given sale receipt details.
      await this.saleReceiptService.editSaleReceipt(
        tenantId,
        saleReceiptId,
        saleReceipt,
      );
      return res.status(200).send({
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
  async getSalesReceipts(req: Request, res: Response) {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'asc',
      page: 1,
      pageSize: 12,
      ...this.matchedBodyData(req),
    };

    try {
      
    } catch (error) {
      next(error);
    }
  }
};
