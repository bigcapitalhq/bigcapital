import { Router, Request, Response } from 'express';
import { check, param, query, matchedData } from 'express-validator';
import { Inject, Service } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import AccountsService from 'services/Accounts/AccountsService';
import ItemsService from 'services/Items/ItemsService';
import SaleReceiptService from 'services/Sales/SalesReceipts';
import BaseController from '../BaseController';

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
   * Validate whether sale receipt exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  async validateSaleReceiptExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    const isSaleReceiptExists = await this.saleReceiptService
      .isSaleReceiptExists(
        tenantId,
        saleReceiptId,
      );
    if (!isSaleReceiptExists) {
      return res.status(404).send({
        errors: [{ type: 'SALE.RECEIPT.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale receipt customer exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptCustomerExistance(req: Request, res: Response, next: Function) {
    const saleReceipt = { ...req.body };
    const { Customer } = req.models;

    const foundCustomer = await Customer.query().findById(saleReceipt.customer_id);

    if (!foundCustomer) {
      return res.status(400).send({ 
        errors: [{ type: 'CUSTOMER.ID.NOT.EXISTS', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate whether sale receipt deposit account exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptDepositAccountExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const saleReceipt = { ...req.body };
    const isDepositAccountExists = await this.accountsService.isAccountExists(
      tenantId,
      saleReceipt.deposit_account_id
    );
    if (!isDepositAccountExists) {
      return res.status(400).send({
        errors: [{ type: 'DEPOSIT.ACCOUNT.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Validate whether receipt items ids exist on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptItemsIdsExistance(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const saleReceipt = { ...req.body };    
    const estimateItemsIds = saleReceipt.entries.map((e) => e.item_id);

    const notFoundItemsIds = await this.itemsService.isItemsIdsExists(
      tenantId,
      estimateItemsIds
    );
    if (notFoundItemsIds.length > 0) {
      return res.status(400).send({ errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }] });
    }
    next();
  }

  /**
   * Validate receipt entries ids existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateReceiptEntriesIds(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    const saleReceipt = { ...req.body };
    const { id: saleReceiptId } = req.params;

    // Validate the entries IDs that not stored or associated to the sale receipt.
    const notExistsEntriesIds = await this.saleReceiptService
      .isSaleReceiptEntriesIDsExists(
        tenantId,
        saleReceiptId,
        saleReceipt,
      );
    if (notExistsEntriesIds.length > 0) {
      return res.status(400).send({ errors: [{
          type: 'ENTRIES.IDS.NOT.FOUND',
          code: 500,
        }]
      });
    }
    next();
  }

  /**
   * Creates a new receipt.
   * @param {Request} req 
   * @param {Response} res 
   */
  async newSaleReceipt(req: Request, res: Response) {
    const { tenantId } = req;

    const saleReceipt = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    // Store the given sale receipt details with associated entries.
    const storedSaleReceipt = await this.saleReceiptService
      .createSaleReceipt(
        tenantId,
        saleReceipt,
      );
    return res.status(200).send({ id: storedSaleReceipt.id });
  }

  /**
   * Deletes the sale receipt with associated entries and journal transactions.
   * @param {Request} req 
   * @param {Response} res 
   */
  async deleteSaleReceipt(req: Request, res: Response) {
    const { tenantId } = req;
    const { id: saleReceiptId } = req.params;

    // Deletes the sale receipt.
    await this.saleReceiptService.deleteSaleReceipt(tenantId, saleReceiptId);

    return res.status(200).send({ id: saleReceiptId });  
  }

  /**
   * Edit the sale receipt details with associated entries and re-write
   * journal transaction on the same date.
   * @param {Request} req 
   * @param {Response} res 
   */
  async editSaleReceipt(req: Request, res: Response) {
    const { tenantId } = req;

    const { id: saleReceiptId } = req.params;
    const saleReceipt = { ...req.body };
    const errorReasons = [];
    
    // Handle all errors with reasons messages.
    if (errorReasons.length > 0) {
      return res.boom.badRequest(null, { errors: errorReasons });
    }
    // Update the given sale receipt details.
    await this.saleReceiptService.editSaleReceipt(
      tenantId,
      saleReceiptId,
      saleReceipt,
    );

    return res.status(200).send();
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
