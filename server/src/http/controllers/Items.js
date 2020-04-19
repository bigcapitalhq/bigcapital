import express from 'express';
import { check, query, validationResult } from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import Item from '@/models/Item';
import Account from '@/models/Account';
import ItemCategory from '@/models/ItemCategory';
import Resource from '@/models/Resource';
import ResourceField from '@/models/ResourceField';
import Authorization from '@/http/middleware/authorization';
import View from '@/models/View';
import {
  mapViewRolesToConditionals,
  mapFilterRolesToDynamicFilter,
} from '@/lib/ViewRolesBuilder';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from '@/lib/DynamicFilter';


export default {

  router() {
    const router = express.Router();
    const permit = Authorization('items');

    router.use(jwtAuth);

    router.post('/:id',
      this.editItem.validation,
      asyncMiddleware(this.editItem.handler));

    router.post('/',
      // permit('create'),
      this.newItem.validation,
      asyncMiddleware(this.newItem.handler));

    router.delete('/:id',
      this.deleteItem.validation,
      asyncMiddleware(this.deleteItem.handler));

    // router.get('/:id',
    //   this.getCategory.validation,
    //   asyncMiddleware(this.getCategory.handler));

    router.get('/',
      this.listItems.validation,
      asyncMiddleware(this.listItems.handler));

    return router;
  },

  /**
   * Creates a new item.
   */
  newItem: {
    validation: [
      check('name').exists(),
      check('type').exists().trim().escape()
        .isIn(['service', 'non-inventory', 'inventory']),
      check('sku').optional().trim().escape(),
      check('cost_price').exists().isNumeric().toFloat(),
      check('sell_price').exists().isNumeric().toFloat(),
      check('cost_account_id').exists().isInt().toInt(),
      check('sell_account_id').exists().isInt().toInt(),
      check('inventory_account_id')
        .if(check('type').equals('inventory'))
        .exists()
        .isInt()
        .toInt(),
      check('category_id').optional().isInt().toInt(),

      check('custom_fields').optional().isArray({ min: 1 }),
      check('custom_fields.*.key').exists().isNumeric().toInt(),
      check('custom_fields.*.value').exists(),

      check('note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = {
        custom_fields: [],
        ...req.body,
      };
      const errorReasons = [];

      const costAccountPromise = Account.query().findById(form.cost_account_id);
      const sellAccountPromise = Account.query().findById(form.sell_account_id);
      const inventoryAccountPromise = (form.type === 'inventory') ? 
        Account.query().findByid(form.inventory_account_id) : null;

      const itemCategoryPromise = (form.category_id)
        ? ItemCategory.query().findById(form.category_id) : null;

      // Validate the custom fields key and value type.
      if (form.custom_fields.length > 0) {
        const customFieldsKeys = form.custom_fields.map((field) => field.key);

        // Get resource id than get all resource fields.
        const resource = await Resource.where('name', 'items').fetch();
        const fields = await ResourceField.query((query) => {
          query.where('resource_id', resource.id);
          query.whereIn('key', customFieldsKeys);
        }).fetchAll();

        const storedFieldsKey = fields.map((f) => f.attributes.key);

        // Get all not defined resource fields.
        const notFoundFields = difference(customFieldsKeys, storedFieldsKey);

        if (notFoundFields.length > 0) {
          errorReasons.push({ type: 'FIELD_KEY_NOT_FOUND', code: 150, fields: notFoundFields });
        }
      }
      const [
        costAccount,
        sellAccount,
        itemCategory,
        inventoryAccount,
      ] = await Promise.all([
        costAccountPromise, sellAccountPromise,
        itemCategoryPromise, inventoryAccountPromise,
      ]);
      if (!costAccount) {
        errorReasons.push({ type: 'COST_ACCOUNT_NOT_FOUND', code: 100 });
      }
      if (!sellAccount) {
        errorReasons.push({ type: 'SELL_ACCOUNT_NOT_FOUND', code: 120 });
      }
      if (!itemCategory && form.category_id) {
        errorReasons.push({ type: 'ITEM_CATEGORY_NOT_FOUND', code: 140 });
      }
      if (!inventoryAccount && form.type === 'inventory') {
        errorReasons.push({ type: 'INVENTORY_ACCOUNT_NOT_FOUND', code: 150 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
      const item = await Item.query().insertAndFetch({
        name: form.name,
        type: form.type,
        cost_price: form.cost_price,
        sell_price: form.sell_price,
        sell_account_id: form.sell_account_id,
        cost_account_id: form.cost_account_id,
        currency_code: form.currency_code,
        note: form.note,
      });
      return res.status(200).send({ id: item.id });
    },
  },

  /**
   * Edit the given item.
   */
  editItem: {
    validation: [
      check('name').exists(),
      check('type')
        .exists()
        .trim()
        .escape()
        .isIn(['product', 'service']),
      check('cost_price').exists().isNumeric(),
      check('sell_price').exists().isNumeric(),
      check('cost_account_id').exists().isInt(),
      check('sell_account_id').exists().isInt(),
      check('category_id').optional().isInt(),
      check('note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { id } = req.params;
      const form = {
        custom_fields: [],
        ...req.body,
      };
      const item = await Item.query().findById(id);
      
      if (!item) {
        return res.boom.notFound(null, { errors: [
          { type: 'ITEM.NOT.FOUND', code: 100 },
        ]});
      }
      const errorReasons = [];

      const costAccountPromise = Account.query().findById(form.cost_account_id);
      const sellAccountPromise = Account.query().findById(form.sell_account_id);
      const itemCategoryPromise = (form.category_id)
        ? ItemCategory.query().findById(form.category_id) : null;

      const [costAccount, sellAccount, itemCategory] = await Promise.all([
        costAccountPromise, sellAccountPromise, itemCategoryPromise,
      ]);
      if (!costAccount) {
        errorReasons.push({ type: 'COST_ACCOUNT_NOT_FOUND', code: 100 });
      }
      if (!sellAccount) {
        errorReasons.push({ type: 'SELL_ACCOUNT_NOT_FOUND', code: 120 });
      }
      if (!itemCategory && form.category_id) {
        errorReasons.push({ type: 'ITEM_CATEGORY_NOT_FOUND', code: 140 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }

      const updatedItem = await Item.query().findById(id).patch({
        name: form.name,
        type: form.type,
        cost_price: form.cost_price,
        sell_price: form.sell_price,
        currency_code: form.currency_code,
        sell_account_id: form.sell_account_id,
        cost_account_id: form.cost_account_id,
        category_id: form.category_id,
        note: form.note,
      });
      return res.status(200).send({ id: updatedItem.id });
    },
  },

  /**
   * Delete the given item from the storage.
   */
  deleteItem: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const item = await Item.query().findById(id);

      if (!item) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ITEM_NOT_FOUND', code: 100 }],
        });
      }

      // Delete the fucking the given item id.
      await Item.query().findById(item.id).delete();

      return res.status(200).send();
    },
  },

  /**
   * Retrive the list items with pagination meta.
   */
  listItems: {
    validation: [
      query('column_sort_order').optional().isIn(['created_at', 'name', 'amount', 'sku']),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const errorReasons = [];
      const viewConditions = [];
      const itemsResource = await Resource.query()
        .where('name', 'items')
        .withGraphFetched('fields')
        .first();

      if (!itemsResource) {
        return res.status(400).send({ errors: [
          {type: 'ITEMS_RESOURCE_NOT_FOUND', code: 200},
        ]});
      }
      const filter = {
        column_sort_order: '',
        sort_order: '',
        page: 1,
        page_size: 10,
        custom_view_id: null,
        filter_roles: [],
        ...req.query,
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }

      const view = await View.query().onBuild((builder) => {
        if (filter.custom_view_id) {
          builder.where('id', filter.custom_view_id);
        } else {
          builder.where('favourite', true);
        }
        builder.where('resource_id', itemsResource.id);
        builder.withGraphFetched('roles.field');
        builder.withGraphFetched('columns');
        builder.first();
      });
      const resourceFieldsKeys = itemsResource.fields.map((c) => c.key);
      const dynamicFilter = new DynamicFilter(Item.tableName);

      // Dynamic filter with view roles.
      if (view && view.roles.length > 0) {
        const viewFilter = new DynamicFilterViews(
          mapViewRolesToConditionals(view.roles),
          view.rolesLogicExpression,
        );
        if (!viewFilter.validateFilterRoles()) {
          errorReasons.push({ type: 'VIEW.LOGIC.EXPRESSION.INVALID', code: 400 });
        }
        dynamicFilter.setFilter(viewFilter);
      }

      // Dynamic filter with filter roles.
      if (filter.filter_roles.length > 0) {
        // Validate the accounts resource fields.
        const filterRoles = new DynamicFilterFilterRoles(
          mapFilterRolesToDynamicFilter(filter.filter_roles),
          itemsResource.fields,
        );
        dynamicFilter.setFilter(filterRoles);

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
      const items = await Item.query().onBuild((builder) => {
        builder.withGraphFetched('costAccount');
        builder.withGraphFetched('sellAccount');
        builder.withGraphFetched('inventoryAccount');
        builder.withGraphFetched('category');

        dynamicFilter.buildQuery()(builder);
      }).pagination(filter.page - 1, filter.page_size);

      return res.status(200).send({
        items,
        ...(view) && {
          customViewId: view.id,
          viewColumns: view.columns,
          viewConditions,
        },
      });
    },
  },
};