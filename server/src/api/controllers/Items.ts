import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain, matchedData } from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import validateMiddleware from 'api/middleware/validateMiddleware';
import ItemsService from 'services/Items/ItemsService';
import BaseController from 'api/controllers/BaseController';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class ItemsController extends BaseController { 
  @Inject()
  itemsService: ItemsService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      this.validateItemSchema,
      validateMiddleware,
      asyncMiddleware(this.validateCategoryExistance.bind(this)),
      asyncMiddleware(this.validateCostAccountExistance.bind(this)),
      asyncMiddleware(this.validateSellAccountExistance.bind(this)),
      asyncMiddleware(this.validateInventoryAccountExistance.bind(this)),
      asyncMiddleware(this.validateItemNameExistance.bind(this)),
      asyncMiddleware(this.newItem.bind(this)),
    );
    router.post(
      '/:id', [
        ...this.validateItemSchema,
        ...this.validateSpecificItemSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateItemExistance.bind(this)),
      asyncMiddleware(this.validateCategoryExistance.bind(this)),
      asyncMiddleware(this.validateCostAccountExistance.bind(this)),
      asyncMiddleware(this.validateSellAccountExistance.bind(this)),
      asyncMiddleware(this.validateInventoryAccountExistance.bind(this)),
      asyncMiddleware(this.validateItemNameExistance.bind(this)),
      asyncMiddleware(this.editItem.bind(this)),
    );
    router.delete(
      '/:id',
      this.validateSpecificItemSchema,
      validateMiddleware,
      asyncMiddleware(this.validateItemExistance.bind(this)),
      asyncMiddleware(this.deleteItem.bind(this)),
    );
    router.get(
      '/:id', 
      this.validateSpecificItemSchema,
      validateMiddleware,
      asyncMiddleware(this.validateItemExistance.bind(this)),
      asyncMiddleware(this.getItem.bind(this)),
    );
    router.get(
      '/',
      this.validateListQuerySchema,
      validateMiddleware,
      asyncMiddleware(this.getItemsList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
    );
    return router;
  }

  /**
   * Validate item schema.
   */
  get validateItemSchema(): ValidationChain[] {
    return [
      check('name').exists(),
      check('type').exists().trim().escape()
        .isIn(['service', 'non-inventory', 'inventory']),
      check('sku').optional({ nullable: true }).trim().escape(),
      // Purchase attributes.
      check('purchasable').optional().isBoolean().toBoolean(),
      check('cost_price')
        .if(check('purchasable').equals('true'))
        .exists()
        .isNumeric()
        .toFloat(),
      check('cost_account_id')
        .if(check('purchasable').equals('true'))
        .exists()  
        .isInt()
        .toInt(),
      // Sell attributes.
      check('sellable').optional().isBoolean().toBoolean(),
      check('sell_price')
        .if(check('sellable').equals('true'))
        .exists()
        .isNumeric()
        .toFloat(),
      check('sell_account_id')
        .if(check('sellable').equals('true'))
        .exists()
        .isInt()
        .toInt(),
      check('inventory_account_id')
        .if(check('type').equals('inventory'))
        .exists()
        .isInt()
        .toInt(),
      check('sell_description').optional({ nullable: true }).trim().escape(),
      check('cost_description').optional({ nullable: true }).trim().escape(),

      check('category_id').optional({ nullable: true }).isInt().toInt(),
      check('note').optional(),

      check('media_ids').optional().isArray(),
      check('media_ids.*').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Validate specific item params schema.
   */
  get validateSpecificItemSchema(): ValidationChain[] {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }


  /**
   * Validate list query schema
   */
  get validateListQuerySchema() {
    return [
      query('column_sort_order').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
    ]
  }

  /**
   * Validates the given item existance on the storage.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async validateItemExistance(req: Request, res: Response, next: Function) {
    const { Item } = req.models;
    const itemId: number = req.params.id;

    const foundItem = await Item.query().findById(itemId);

    if (!foundItem) {
      return res.status(400).send({
        errors: [{ type: 'ITEM.NOT.FOUND', code: 100 }],
      });
    }
    next();
  }

  /**
   * Validate wether the given item name already exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async validateItemNameExistance(req: Request, res: Response, next: Function) {
    const { Item } = req.models;
    const item = req.body;
    const itemId: number = req.params.id;

    const foundItems: [] = await Item.query().onBuild((builder: any) => {
      builder.where('name', item.name);
      if (itemId) {
        builder.whereNot('id', itemId);
      }
    });
    if (foundItems.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEM.NAME.ALREADY.EXISTS', code: 210 }],
      });
    }
    next();
  }

  /**
   * Validate wether the given category existance on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateCategoryExistance(req: Request, res: Response, next: Function) {
    const { ItemCategory } = req.models;
    const item = req.body;

    if (item.category_id) {
      const foundCategory = await ItemCategory.query().findById(item.category_id);

      if (!foundCategory) {
        return res.status(400).send({
          errors: [{ type: 'ITEM_CATEGORY.NOT.FOUND', code: 140 }],
        });
      }
    }
    next();
  }

  /**
   * Validate wether the given cost account exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateCostAccountExistance(req: Request, res: Response, next: Function) {
    const { Account, AccountType } = req.models;
    const item = req.body;

    if (item.cost_account_id) {
      const COGSType = await AccountType.query().findOne('key', 'cost_of_goods_sold');
      const foundAccount = await Account.query().findById(item.cost_account_id)

      if (!foundAccount) {
        return res.status(400).send({
          errors: [{ type: 'COST.ACCOUNT.NOT.FOUND', code: 120 }],
        });
      } else if (foundAccount.accountTypeId !== COGSType.id) {
        return res.status(400).send({
          errors: [{ type: 'COST.ACCOUNT.NOT.COGS.TYPE', code: 220 }],
        });
      }
    }
    next();
  }

  /**
   * Validate wether the given sell account exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async validateSellAccountExistance(req: Request, res: Response, next: Function) {
    const { Account, AccountType } = req.models;
    const item = req.body;

    if (item.sell_account_id) {
      const incomeType = await AccountType.query().findOne('key', 'income');
      const foundAccount = await Account.query().findById(item.sell_account_id);

      if (!foundAccount) {
        return res.status(400).send({
          errors: [{ type: 'SELL.ACCOUNT.NOT.FOUND', code: 130 }],
        });
      } else if (foundAccount.accountTypeId !== incomeType.id) {
        return res.status(400).send({
          errors: [{ type: 'SELL.ACCOUNT.NOT.INCOME.TYPE', code: 230 }],
        })
      }
    }
    next();
  }

  /**
   * Validates wether the given inventory account exists on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async validateInventoryAccountExistance(req: Request, res: Response, next: Function) {
    const { Account, AccountType } = req.models;
    const item = req.body;

    if (item.inventory_account_id) {
      const otherAsset = await AccountType.query().findOne('key', 'other_asset');
      const foundAccount = await Account.query().findById(item.inventory_account_id);

      if (!foundAccount) {
        return res.status(400).send({ 
          errors: [{ type: 'INVENTORY.ACCOUNT.NOT.FOUND', code: 200}],
        });
      } else if (otherAsset.id !== foundAccount.accountTypeId) {
        return res.status(400).send({
          errors: [{ type: 'INVENTORY.ACCOUNT.NOT.CURRENT.ASSET', code: 300 }],
        });
      }
    }
    next();
  }

  /**
   * Stores the given item details to the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  async newItem(req: Request, res: Response,) {
    const { tenantId } = req;

    const item = matchedData(req, {
      locations: ['body'],
      includeOptionals: true
    });
    const storedItem = await this.itemsService.newItem(tenantId, item);

    return res.status(200).send({ id: storedItem.id });
  }

  /**
   * Updates the given item details on the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  async editItem(req: Request, res: Response) {
    const { tenantId } = req;

    const itemId: number = req.params.id;
    const item = matchedData(req, {
      locations: ['body'],
      includeOptionals: true
    });
    const updatedItem = await this.itemsService.editItem(tenantId, item, itemId);

    return res.status(200).send({ id: itemId });
  }

  /**
   * Deletes the given item from the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  async deleteItem(req: Request, res: Response) {
    const itemId: number = req.params.id;
    const { tenantId } = req;

    await this.itemsService.deleteItem(tenantId, itemId);

    return res.status(200).send({ id: itemId });
  }

  /**
   * Retrieve details the given item id. 
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response} 
   */
  async getItem(req: Request, res: Response) {
    const itemId: number = req.params.id;
    const { tenantId } = req;

    const storedItem = await this.itemsService.getItemWithMetadata(tenantId, itemId);

    return res.status(200).send({ item: storedItem });
  }

  /**
   * Retrieve items datatable list.
   * @param {Request} req 
   * @param {Response} res 
   */
  async getItemsList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      filterRoles: [],
      sortOrder: 'asc',
      ...this.matchedQueryData(req),
    };
    if (filter.stringifiedFilterRoles) {
      filter.filterRoles = JSON.parse(filter.stringifiedFilterRoles);
    }
    try {
      const items = await this.itemsService.getItemsList(tenantId, filter);
      return res.status(200).send({ items });
    } catch (error) {
      next(error);
    }
 }
}