import { Router, Request, Response } from 'express';
import {
  check,
  param,
  query,
} from 'express-validator';
import { difference } from 'lodash';
import { Service } from 'typedi';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import validateMiddleware from 'api/middleware/validateMiddleware';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterFilterRoles,
} from 'lib/DynamicFilter';
import {
  mapFilterRolesToDynamicFilter,
} from 'lib/ViewRolesBuilder';
import { IItemCategory, IItemCategoryOTD } from 'interfaces';
import BaseController from 'api/controllers/BaseController';

@Service()
export default class ItemsCategoriesController extends BaseController {
  /**
   * Router constructor method.
   */
  router() {
    const router = Router();

    router.post('/:id', [
        ...this.categoryValidationSchema,
        ...this.specificCategoryValidationSchema,
      ], 
      validateMiddleware,
      asyncMiddleware(this.validateParentCategoryExistance),
      asyncMiddleware(this.validateSellAccountExistance),
      asyncMiddleware(this.validateCostAccountExistance),
      asyncMiddleware(this.validateInventoryAccountExistance),
      asyncMiddleware(this.editCategory)
    );
    router.post('/',
      this.categoryValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateParentCategoryExistance),
      asyncMiddleware(this.validateSellAccountExistance),
      asyncMiddleware(this.validateCostAccountExistance),
      asyncMiddleware(this.validateInventoryAccountExistance),
      asyncMiddleware(this.newCategory),
    );
    router.delete('/bulk',
      this.categoriesBulkValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateCategoriesIdsExistance),
      asyncMiddleware(this.bulkDeleteCategories),
    );
    router.delete('/:id',
      this.specificCategoryValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateItemCategoryExistance),
      asyncMiddleware(this.deleteItem),
    );
    router.get('/:id',
      this.specificCategoryValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateItemCategoryExistance),
      asyncMiddleware(this.getCategory)
    );
    router.get('/',
      this.categoriesListValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.getList)
    );
    return router;
  }

  /**
   * Item category validation schema.
   */
  get categoryValidationSchema() {
    return [
      check('name').exists().trim().escape(),
      check('parent_category_id')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
        .toInt(),
      check('description')
        .optional()
        .trim()
        .escape(),
      check('sell_account_id')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
        .toInt(),
      check('cost_account_id')
        .optional()
        .isNumeric()
        .toInt(),
      check('inventory_account_id')
        .optional()
        .isNumeric()
        .toInt(),
    ]
  }

  /**
   * Validate items categories bulk actions.
   */
  get categoriesBulkValidationSchema() {
    return [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Validate items categories schema.
   */
  get categoriesListValidationSchema() {
    return [
      query('column_sort_order').optional().trim().escape(),
      query('sort_order').optional().trim().escape().isIn(['desc', 'asc']),
      query('stringified_filter_roles').optional().isJSON(),
    ];
  }

  /**
   * Validate specific item category schema.
   */
  get specificCategoryValidationSchema() {
    return [
      param('id').exists().toInt(),
    ];
  }

  /**
   * Validate the item category existance.
   * @param {Request} req 
   * @param {Response} res 
   */
  async validateItemCategoryExistance(req: Request, res: Response, next: Function) {
    const categoryId: number = req.params.id;
    const { ItemCategory } = req.models;
    const category = await ItemCategory.query().findById(categoryId);

    if (!category) {
      return res.boom.notFound(null, {
        errors: [{ type: 'ITEM_CATEGORY_NOT_FOUND', code: 100 }],
      });
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
    const category: IItemCategoryOTD = this.matchedBodyData(req);

    if (category.costAccountId) {
      const COGSType = await AccountType.query().findOne('key', 'cost_of_goods_sold');
      const foundAccount = await Account.query().findById(category.costAccountId)

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
    const category: IItemCategoryOTD = this.matchedBodyData(req);

    if (category.sellAccountId) {
      const incomeType = await AccountType.query().findOne('key', 'income');
      const foundAccount = await Account.query().findById(category.sellAccountId);

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
    const category: IItemCategoryOTD = this.matchedBodyData(req);

    if (category.inventoryAccountId) {
      const otherAsset = await AccountType.query().findOne('key', 'other_asset');
      const foundAccount = await Account.query().findById(category.inventoryAccountId);

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
   * Validate the item category parent category whether exists on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  async validateParentCategoryExistance(req: Request, res: Response, next: Function) {
    const category: IItemCategory = this.matchedBodyData(req);
    const { ItemCategory } = req.models;

    if (category.parentCategoryId) {
      const foundParentCategory = await ItemCategory.query()
        .where('id', category.parentCategoryId)
        .first();

      if (!foundParentCategory) {
        return res.boom.notFound('The parent category ID is not found.', {
          errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }],
        });
      }
    }
    next();
  }

  /**
   * Validate item categories ids existance.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */  
  async validateCategoriesIdsExistance(req: Request, res: Response, next: Function) {
    const ids: number[] = (req.query?.ids || []);
    const { ItemCategory } = req.models;

    const itemCategories = await ItemCategory.query().whereIn('id', ids);
    const itemCategoriesIds = itemCategories.map((category: IItemCategory) => category.id);
    const notFoundCategories = difference(ids, itemCategoriesIds);

    if (notFoundCategories.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ITEM.CATEGORIES.IDS.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Creates a new item category.
   * @param {Request} req 
   * @param {Response} res 
   */
  async newCategory(req: Request, res: Response) {
    const { user } = req;
    const category: IItemCategory = this.matchedBodyData(req);
    const { ItemCategory } = req.models;

    const storedCategory = await ItemCategory.query().insert({
      ...category,
      user_id: user.id,
    });
    return res.status(200).send({ category: storedCategory });
  }

  /**
   * Edit details of the given category item.
   * @param {Request} req - 
   * @param {Response} res - 
   * @return {Response}
   */
  async editCategory(req: Request, res: Response) {
    const { id } = req.params;
    const category: IItemCategory = this.matchedBodyData(req);
    const { ItemCategory } = req.models;

    const updateItemCategory = await ItemCategory.query()
      .where('id', id)
      .update({ ...category });

    return res.status(200).send({ id });
  }

  /**
   * Delete the give item category.
   * @param {Request} req - 
   * @param {Response} res - 
   * @return {Response}
   */
  async deleteItem(req: Request, res: Response) {
    const { id } = req.params;
    const { ItemCategory } = req.models;

    await ItemCategory.query()
      .where('id', id)
      .delete();

    return res.status(200).send({ id });  
  }

  /**
   * Retrieve the list of items.
   * @param {Request} req - 
   * @param {Response} res - 
   * @return {Response}
   */
  async getList(req: Request, res: Response) {
    const { Resource, ItemCategory } = req.models;
    const categoriesResource = await Resource.query()
      .where('name', 'items_categories')
      .withGraphFetched('fields')
      .first();

    if (!categoriesResource) {
      return res.status(400).send({
        errors: [{ type: 'ITEMS.CATEGORIES.RESOURCE.NOT.FOUND', code: 200 }],
      });
    }
    const filter = {
      column_sort_order: '',
      sort_order: '',
      filter_roles: [],
      ...req.query,
    };
    if (filter.stringified_filter_roles) {
      filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
    }
    const errorReasons = [];
    const resourceFieldsKeys = categoriesResource.fields.map((c) => c.key);
    const dynamicFilter = new DynamicFilter(ItemCategory.tableName);

    // Dynamic filter with filter roles.
    if (filter.filter_roles.length > 0) {
      // Validate the accounts resource fields.
      const filterRoles = new DynamicFilterFilterRoles(
        mapFilterRolesToDynamicFilter(filter.filter_roles),
        categoriesResource.fields,
      );
      categoriesResource.setFilter(filterRoles);

      if (filterRoles.validateFilterRoles().length > 0) {
        errorReasons.push({ type: 'ITEMS.RESOURCE.HAS.NO.FIELDS', code: 500 });
      }
    }
    // Dynamic filter with column sort order.
    if (filter.column_sort_order) {
      if (resourceFieldsKeys.indexOf(filter.column_sort_order) === -1) {
        errorReasons.push({ type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300 });
      }
      const sortByFilter = new DynamicFilterSortBy(
        filter.column_sort_order,
        filter.sort_order,
      );
      dynamicFilter.setFilter(sortByFilter);
    }
    if (errorReasons.length > 0) {
      return res.status(400).send({ errors: errorReasons });
    }
    const categories = await ItemCategory.query().onBuild((builder) => {
      dynamicFilter.buildQuery()(builder);

      builder.select([
        '*',
        ItemCategory.relatedQuery('items').count().as('count'),
      ]);
    });

    return res.status(200).send({ categories });
  }

  /**
   * Retrieve details of the given category.
   * @param {Request} req - 
   * @param {Response} res - 
   * @return {Response}
   */
  async getCategory(req: Request, res: Response) {
    const itemCategoryId: number = req.params.id;
    const { ItemCategory } = req.models;

    const itemCategory = await ItemCategory.query().findById(itemCategoryId);

    return res.status(200).send({ category: itemCategory });
  }

  /**
   * Bulk delete the given item categories.
   * @param {Request} req - 
   * @param {Response} res - 
   * @return {Response}
   */
  async bulkDeleteCategories(req: Request, res: Response) {
    const ids = req.query.ids;
    const { ItemCategory } = req.models;

    await ItemCategory.query().whereIn('id', ids).delete();

    return res.status(200).send({ ids: filter.ids });  
  }
};
