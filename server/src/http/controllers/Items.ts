import { Router, Request, Response } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import ItemsService from '@/services/Items/ItemsService';
import DynamicListing from '@/services/DynamicListing/DynamicListing';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import { dynamicListingErrorsToResponse } from '@/services/DynamicListing/hasDynamicListing';

export default class ItemsController { 
  /**
   * Router constructor.
   */
  static router() {
    const router = Router();

    router.post(
      '/',
      this.validateItemSchema,
      validateMiddleware,
      asyncMiddleware(this.validateCategoryExistance),
      asyncMiddleware(this.validateCostAccountExistance),
      asyncMiddleware(this.validateSellAccountExistance),
      asyncMiddleware(this.validateInventoryAccountExistance),
      asyncMiddleware(this.validateItemNameExistance),
      asyncMiddleware(this.newItem),
    );
    router.post(
      '/:id', [
        ...this.validateItemSchema,
        ...this.validateSpecificItemSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateItemExistance),
      asyncMiddleware(this.validateCategoryExistance),
      asyncMiddleware(this.validateCostAccountExistance),
      asyncMiddleware(this.validateSellAccountExistance),
      asyncMiddleware(this.validateInventoryAccountExistance),
      asyncMiddleware(this.validateItemNameExistance),
      asyncMiddleware(this.editItem),
    );
    router.delete(
      '/:id',
      this.validateSpecificItemSchema,
      validateMiddleware,
      asyncMiddleware(this.validateItemExistance),
      asyncMiddleware(this.deleteItem),
    );
    router.get(
      '/:id', 
      this.validateSpecificItemSchema,
      validateMiddleware,
      asyncMiddleware(this.validateItemExistance),
      asyncMiddleware(this.getItem),
    );
    router.get(
      '/',
      this.validateListQuerySchema,
      validateMiddleware,
      asyncMiddleware(this.listItems),
    );
    return router;
  }

  /**
   * Validate item schema.
   * 
   * @param {Request} req - 
   * @param {Response} res - 
   * @return {ValidationChain[]} - validation chain.
   */
  static get validateItemSchema(
    req: Request,
    res: Response,
    next: Function,
  ): ValidationChain[] {
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
  static get validateSpecificItemSchema(): ValidationChain[] {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }


  /**
   * Validate list query schema
   */
  static get validateListQuerySchema() {
    return [
      query('column_sort_order').optional().isIn(['created_at', 'name', 'amount', 'sku']),
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
  static async validateItemExistance(req: Request, res: Response, next: Function) {
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
  static async validateItemNameExistance(req: Request, res: Response, next: Function) {
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
  static async validateCategoryExistance(req: Request, res: Response, next: Function) {
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
  static async validateCostAccountExistance(req: Request, res: Response, next: Function) {
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
  static async validateSellAccountExistance(req: Request, res: Response, next: Function) {
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
  static async validateInventoryAccountExistance(req: Request, res: Response, next: Function) {
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
  static async newItem(req: Request, res: Response,) {
    const item = req.body;
    const storedItem = await ItemsService.newItem(item);

    return res.status(200).send({ id: storedItem.id });
  }

  /**
   * Updates the given item details on the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async editItem(req: Request, res: Response) {
    const item = req.body;
    const itemId: number = req.params.id;
    const updatedItem = await ItemsService.editItem(item, itemId);

    return res.status(200).send({ id: itemId });
  }

  /**
   * Deletes the given item from the storage.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async deleteItem(req: Request, res: Response) {
    const itemId: number = req.params.id;
    await ItemsService.deleteItem(itemId);

    return res.status(200).send({ id: itemId });
  }

  /**
   * Retrieve details the given item id. 
   * @param {Request} req 
   * @param {Response} res 
   * @return {Response} 
   */
  static async getItem(req: Request, res: Response) {
    const itemId: number = req.params.id;
    const storedItem = await ItemsService.getItemWithMetadata(itemId);

    return res.status(200).send({ item: storedItem });
  }

  /**
   * Listing items with pagination metadata.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async listItems(req: Request, res: Response) {
    const filter = {
      filter_roles: [],
      sort_order: 'asc',
      page: 1,
      page_size: 10,
      ...req.query,
    };
    if (filter.stringified_filter_roles) {
      filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
    }
    const { Resource, Item, View } = req.models;
    const resource = await Resource.query()
        .remember()
        .where('name', 'items')
        .withGraphFetched('fields')
        .first();

    if (!resource) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.RESOURCE.NOT_FOUND', code: 200 }],
      });
    }
    const viewMeta = await View.query()
      .modify('allMetadata')
      .modify('specificOrFavourite', filter.custom_view_id)
      .where('resource_id', resource.id)
      .first();

    const listingBuilder = new DynamicListingBuilder();
    const errorReasons = [];

    listingBuilder.addModelClass(Item);
    listingBuilder.addCustomViewId(filter.custom_view_id);
    listingBuilder.addFilterRoles(filter.filter_roles);
    listingBuilder.addSortBy(filter.sort_by, filter.sort_order);
    listingBuilder.addView(viewMeta);

    const dynamicListing = new DynamicListing(listingBuilder);

    if (dynamicListing instanceof Error) {
      const errors = dynamicListingErrorsToResponse(dynamicListing);
      errorReasons.push(...errors);
    }
    if (errorReasons.length > 0) {
      return res.status(400).send({ errors: errorReasons });
    }
    const items = await Item.query().onBuild((builder: any) => {
      builder.withGraphFetched('costAccount');
      builder.withGraphFetched('sellAccount');
      builder.withGraphFetched('inventoryAccount');
      builder.withGraphFetched('category');

      dynamicListing.buildQuery()(builder);
      return builder;
    }).pagination(filter.page - 1, filter.page_size);

    return res.status(200).send({
      items: {
        ...items,
        ...(viewMeta
          ? {
            viewMeta: {
              custom_view_id: viewMeta.id, 
              view_columns: viewMeta.columns,
            }
          }
          : {}),
      },
    });
  }
}