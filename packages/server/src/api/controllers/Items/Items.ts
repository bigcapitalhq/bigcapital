import { Inject, Service } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import BaseController from '@/api/controllers/BaseController';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { ServiceError } from '@/exceptions';
import { IItemDTO, ItemAction, AbilitySubject } from '@/interfaces';
import { DATATYPES_LENGTH } from '@/data/DataTypes';
import CheckAbilities from '@/api/middleware/CheckPolicies';
import { ItemsApplication } from '@/services/Items/ItemsApplication';

@Service()
export default class ItemsController extends BaseController {
  @Inject()
  private itemsApplication: ItemsApplication;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckAbilities(ItemAction.CREATE, AbilitySubject.Item),
      this.validateItemSchema,
      this.validationResult,
      this.asyncMiddleware(this.newItem.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/activate',
      CheckAbilities(ItemAction.EDIT, AbilitySubject.Item),
      this.validateSpecificItemSchema,
      this.validationResult,
      this.asyncMiddleware(this.activateItem.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/inactivate',
      CheckAbilities(ItemAction.EDIT, AbilitySubject.Item),
      [...this.validateSpecificItemSchema],
      this.validationResult,
      this.asyncMiddleware(this.inactivateItem.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id',
      CheckAbilities(ItemAction.EDIT, AbilitySubject.Item),
      [...this.validateItemSchema, ...this.validateSpecificItemSchema],
      this.validationResult,
      this.asyncMiddleware(this.editItem.bind(this)),
      this.handlerServiceErrors
    );
    router.delete(
      '/:id',
      CheckAbilities(ItemAction.DELETE, AbilitySubject.Item),
      [...this.validateSpecificItemSchema],
      this.validationResult,
      this.asyncMiddleware(this.deleteItem.bind(this)),
      this.handlerServiceErrors
    );
    router.get(
      '/:id',
      CheckAbilities(ItemAction.VIEW, AbilitySubject.Item),
      [...this.validateSpecificItemSchema],
      this.validationResult,
      this.asyncMiddleware(this.getItem.bind(this)),
      this.handlerServiceErrors
    );
    router.get(
      '/',
      CheckAbilities(ItemAction.VIEW, AbilitySubject.Item),
      [...this.validateListQuerySchema],
      this.validationResult,
      this.asyncMiddleware(this.getItemsList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Validate item schema.
   */
  get validateItemSchema(): ValidationChain[] {
    return [
      check('name')
        .exists()
        .isString()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('type')
        .exists()
        .isString()
        .trim()
        .escape()
        .isIn(['service', 'non-inventory', 'inventory']),
      check('code')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      // Purchase attributes.
      check('purchasable').optional().isBoolean().toBoolean(),
      check('cost_price')
        .optional({ nullable: true })
        .isFloat({ min: 0, max: DATATYPES_LENGTH.DECIMAL_13_3 })
        .toFloat()
        .if(check('purchasable').equals('true'))
        .exists(),
      check('cost_account_id').if(check('purchasable').equals('true')).exists(),
      check('cost_account_id')
        .optional({ nullable: true })
        .isInt({ min: 0, max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      // Sell attributes.
      check('sellable').optional().isBoolean().toBoolean(),
      check('sell_price')
        .optional({ nullable: true })
        .isFloat({ min: 0, max: DATATYPES_LENGTH.DECIMAL_13_3 })
        .toFloat()
        .if(check('sellable').equals('true'))
        .exists(),
      check('sell_account_id').if(check('sellable').equals('true')).exists(),
      check('sell_account_id')
        .optional({ nullable: true })
        .isInt({ min: 0, max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('inventory_account_id')
        .if(check('type').equals('inventory'))
        .exists(),
      check('inventory_account_id')
        .optional({ nullable: true })
        .isInt({ min: 0, max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('sell_description')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('purchase_description')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('category_id')
        .optional({ nullable: true })
        .isInt({ min: 0, max: DATATYPES_LENGTH.INT_10 })
        .toInt(),
      check('note')
        .optional()
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('active').optional().isBoolean().toBoolean(),

      check('media_ids').optional().isArray(),
      check('media_ids.*').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Validate specific item params schema.
   * @return {ValidationChain[]}
   */
  get validateSpecificItemSchema(): ValidationChain[] {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Validate list query schema.
   */
  private get validateListQuerySchema() {
    return [
      query('column_sort_by').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('view_slug').optional({ nullable: true }).isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),

      query('inactive_mode').optional().isBoolean().toBoolean(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Stores the given item details to the storage.
   * @param {Request} req
   * @param {Response} res
   */
  private async newItem(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const itemDTO: IItemDTO = this.matchedBodyData(req);

    try {
      const storedItem = await this.itemsApplication.createItem(
        tenantId,
        itemDTO
      );

      return res.status(200).send({
        id: storedItem.id,
        message: 'The item has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates the given item details on the storage.
   * @param {Request} req
   * @param {Response} res
   */
  private async editItem(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const itemId: number = req.params.id;
    const item: IItemDTO = this.matchedBodyData(req);

    try {
      await this.itemsApplication.editItem(tenantId, itemId, item);

      return res.status(200).send({
        id: itemId,
        message: 'The item has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activates the given item.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async activateItem(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const itemId: number = req.params.id;

    try {
      await this.itemsApplication.activateItem(tenantId, itemId);

      return res.status(200).send({
        id: itemId,
        message: 'The item has been activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inactivates the given item.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async inactivateItem(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const itemId: number = req.params.id;

    try {
      await this.itemsApplication.inactivateItem(tenantId, itemId);

      return res.status(200).send({
        id: itemId,
        message: 'The item has been inactivated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given item from the storage.
   * @param {Request} req
   * @param {Response} res
   */
  private async deleteItem(req: Request, res: Response, next: NextFunction) {
    const itemId: number = req.params.id;
    const { tenantId } = req;

    try {
      await this.itemsApplication.deleteItem(tenantId, itemId);

      return res.status(200).send({
        id: itemId,
        message: 'The item has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve details the given item id.
   * @param {Request} req
   * @param {Response} res
   * @return {Response}
   */
  private async getItem(req: Request, res: Response, next: NextFunction) {
    const itemId: number = req.params.id;
    const { tenantId } = req;

    try {
      const item = await this.itemsApplication.getItem(tenantId, itemId);

      return res.status(200).send({
        item: this.transfromToResponse(item),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve items datatable list.
   * @param {Request} req
   * @param {Response} res
   */
  private async getItemsList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    const filter = {
      sortOrder: 'DESC',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      inactiveMode: false,
      ...this.matchedQueryData(req),
    };

    try {
      const { items, pagination, filterMeta } =
        await this.itemsApplication.getItems(tenantId, filter);

      return res.status(200).send({
        items: this.transfromToResponse(items),
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handlerServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ITEM.NOT.FOUND', code: 140 }],
        });
      }
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ITEMS_NOT_FOUND', code: 130 }],
        });
      }
      if (error.errorType === 'ITEM_CATEGORY_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'ITEM_CATEGORY.NOT.FOUND', code: 140 }],
        });
      }
      if (error.errorType === 'ITEM_NAME_EXISTS') {
        return res.status(400).send({
          errors: [{ type: 'ITEM.NAME.ALREADY.EXISTS', code: 210 }],
        });
      }
      if (error.errorType === 'COST_ACCOUNT_NOT_FOUMD') {
        return res.status(400).send({
          errors: [{ type: 'COST.ACCOUNT.NOT.FOUND', code: 120 }],
        });
      }
      if (error.errorType === 'COST_ACCOUNT_NOT_COGS') {
        return res.status(400).send({
          errors: [{ type: 'COST.ACCOUNT.NOT.COGS.TYPE', code: 220 }],
        });
      }
      if (error.errorType === 'SELL_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'SELL.ACCOUNT.NOT.FOUND', code: 130 }],
        });
      }
      if (error.errorType === 'SELL_ACCOUNT_NOT_INCOME') {
        return res.status(400).send({
          errors: [{ type: 'SELL.ACCOUNT.NOT.INCOME.TYPE', code: 230 }],
        });
      }
      if (error.errorType === 'COST_ACCOUNT_NOT_FOUMD') {
        return res.status(400).send({
          errors: [{ type: 'COST.ACCOUNT.NOT.FOUND', code: 120 }],
        });
      }
      if (error.errorType === 'COST_ACCOUNT_NOT_COGS') {
        return res.status(400).send({
          errors: [{ type: 'COST.ACCOUNT.NOT.COGS.TYPE', code: 220 }],
        });
      }
      if (error.errorType === 'SELL_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'SELL.ACCOUNT.NOT.FOUND', code: 130 }],
        });
      }
      if (error.errorType === 'INVENTORY_ACCOUNT_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'INVENTORY.ACCOUNT.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'SELL_ACCOUNT_NOT_INCOME') {
        return res.status(400).send({
          errors: [{ type: 'SELL.ACCOUNT.NOT.INCOME.TYPE', code: 230 }],
        });
      }
      if (error.errorType === 'INVENTORY_ACCOUNT_NOT_INVENTORY') {
        return res.status(400).send({
          errors: [{ type: 'INVENTORY.ACCOUNT.NOT.INVENTORY.TYPE', code: 300 }],
        });
      }
      if (error.errorType === 'ITEMS_HAVE_ASSOCIATED_TRANSACTIONS') {
        return res.status(400).send({
          errors: [{ type: 'ITEMS_HAVE_ASSOCIATED_TRANSACTIONS', code: 310 }],
        });
      }
      if (error.errorType === 'ITEM_HAS_ASSOCIATED_TRANSACTINS') {
        return res.status(400).send({
          errors: [{ type: 'ITEM_HAS_ASSOCIATED_TRANSACTINS', code: 320 }],
        });
      }
      if (error.errorType === 'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT') {
        return res.status(400).send({
          errors: [
            { type: 'ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT', code: 330 },
          ],
        });
      }
      if (error.errorType === 'ITEM_CANNOT_CHANGE_INVENTORY_TYPE') {
        return res.status(400).send({
          errors: [
            {
              type: 'ITEM_CANNOT_CHANGE_INVENTORY_TYPE',
              message: 'Cannot change inventory item type',
              code: 340,
            },
          ],
        });
      }
      if (error.errorType === 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS') {
        return res.status(400).send({
          errors: [
            {
              type: 'TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS',
              message:
                'Cannot change item type to inventory with item has associated transactions.',
              code: 350,
            },
          ],
        });
      }
      if (error.errorType === 'INVENTORY_ACCOUNT_CANNOT_MODIFIED') {
        return res.status(400).send({
          errors: [
            {
              type: 'INVENTORY_ACCOUNT_CANNOT_MODIFIED',
              message:
                'Cannot change item inventory account while the item has transactions.',
              code: 360,
            },
          ],
        });
      }
      if (error.errorType === 'ITEM_HAS_ASSOCIATED_TRANSACTIONS') {
        return res.status(400).send({
          errors: [
            {
              type: 'ITEM_HAS_ASSOCIATED_TRANSACTIONS',
              code: 370,
              message:
                'Could not delete item that has associated transactions.',
            },
          ],
        });
      }
    }
    next(error);
  }
}
