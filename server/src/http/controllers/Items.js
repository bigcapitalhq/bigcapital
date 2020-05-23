import express from 'express';
import { check, query, validationResult } from 'express-validator';
import { difference } from 'lodash';
import fs from 'fs';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
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
import Logger from '@/services/Logger';

const fsPromises = fs.promises;


export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.post('/:id',
      this.editItem.validation,
      asyncMiddleware(this.editItem.handler));

    router.post('/',
      this.newItem.validation,
      asyncMiddleware(this.newItem.handler));

    router.delete('/:id',
      this.deleteItem.validation,
      asyncMiddleware(this.deleteItem.handler));

    router.delete('/',
      this.bulkDeleteItems.validation,
      asyncMiddleware(this.bulkDeleteItems.handler));

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
      check('sku').optional({ nullable: true }).trim().escape(),
      check('cost_price').exists().isNumeric().toFloat(),
      check('sell_price').exists().isNumeric().toFloat(),
      check('cost_account_id').exists().isInt().toInt(),
      check('sell_account_id').exists().isInt().toInt(),
      check('inventory_account_id')
        .if(check('type').equals('inventory'))
        .exists()
        .isInt()
        .toInt(),
      check('category_id').optional({ nullable: true }).isInt().toInt(),

      check('custom_fields').optional().isArray({ min: 1 }),
      check('custom_fields.*.key').exists().isNumeric().toInt(),
      check('custom_fields.*.value').exists(),

      check('note').optional(),

      check('media_ids').optional().isArray(),
      check('media_ids.*').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { user } = req;
      const form = {
        custom_fields: [],
        media_ids: [],
        ...req.body,
      };
      const {
        Account,
        Resource,
        ResourceField,
        ItemCategory,
        Item,
        MediaLink,
      } = req.models;
      const errorReasons = [];

      const costAccountPromise = Account.query().findById(form.cost_account_id);
      const sellAccountPromise = Account.query().findById(form.sell_account_id);
      const inventoryAccountPromise = (form.type === 'inventory')
        ? Account.query().findById(form.inventory_account_id) : null;

      const itemCategoryPromise = (form.category_id)
        ? ItemCategory.query().findById(form.category_id) : null;

      // Validate the custom fields key and value type.
      if (form.custom_fields.length > 0) {
        const customFieldsKeys = form.custom_fields.map((field) => field.key);

        // Get resource id than get all resource fields.
        const resource = await Resource.where('name', 'items').fetch();
        const fields = await ResourceField.query((builder) => {
          builder.where('resource_id', resource.id);
          builder.whereIn('key', customFieldsKeys);
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
        costAccountPromise,
        sellAccountPromise,
        itemCategoryPromise,
        inventoryAccountPromise,
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

      const bulkSaveMediaLinks = [];
      const item = await Item.query().insertAndFetch({
        name: form.name,
        type: form.type,
        sku: form.sku,
        cost_price: form.cost_price,
        sell_price: form.sell_price,
        sell_account_id: form.sell_account_id,
        cost_account_id: form.cost_account_id,
        currency_code: form.currency_code,
        category_id: form.category_id,
        user_id: user.id,
        note: form.note,
      });

      form.media_ids.forEach((mediaId) => {
        const oper = MediaLink.query().insert({
          model_name: 'Item',
          media_id: mediaId,
          model_id: item.id,
        });
        bulkSaveMediaLinks.push(oper);
      });

      // Save the media links.
      await Promise.all([
        ...bulkSaveMediaLinks,
      ]);
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
      check('category_id').optional({ nullable: true }).isInt().toInt(),
      check('note').optional(),
      check('attachment').optional(),
      check('')
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Account, Item, ItemCategory, MediaLink } = req.models;
      const { id } = req.params;

      const form = {
        custom_fields: [],
        ...req.body,
      };
      const item = await Item.query().findById(id).withGraphFetched('media');

      if (!item) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ITEM.NOT.FOUND', code: 100 }],
        });
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

      const attachment = req.files && req.files.attachment ? req.files.attachment : null;
      const attachmentsMimes = ['image/png', 'image/jpeg'];

      // Validate the attachment.
      if (attachment && attachmentsMimes.indexOf(attachment.mimetype) === -1) {
        errorReasons.push({ type: 'ATTACHMENT.MINETYPE.NOT.SUPPORTED', code: 160 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
      if (attachment) {
        const publicPath = 'storage/app/public/';
        const tenantPath = `${publicPath}${req.organizationId}`;

        try {
          await fsPromises.unlink(`${tenantPath}/${item.attachmentFile}`);
        } catch (error) {
          Logger.log('error', 'Delete item attachment file delete failed.', { error });
        }
        try {
          await attachment.mv(`${tenantPath}/${attachment.md5}.png`);
        } catch (error) {
          return res.status(400).send({
            errors: [{ type: 'ATTACHMENT.UPLOAD.FAILED', code: 600 }],
          });
        }
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

      // Save links of new inserted media that associated to the item model.
      const itemMediaIds = item.media.map((m) => m.id);
      const newInsertedMedia = difference(form.media_ids, itemMediaIds);
      const bulkSaveMediaLink = [];

      newInsertedMedia.forEach((mediaId) => {
        const oper = MediaLink.query().insert({
          model_name: 'Journal',
          model_id: manualJournal.id,
          media_id: mediaId,
        });
        bulkSaveMediaLink.push(oper);
      });
      await Promise.all([ ...newInsertedMedia ]);

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
      const { Item } = req.models;
      const item = await Item.query().findById(id);

      if (!item) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ITEM_NOT_FOUND', code: 100 }],
        });
      }
      // Delete the fucking the given item id.
      await Item.query().findById(item.id).delete();

      if (item.attachmentFile) {
        const publicPath = 'storage/app/public/';
        const tenantPath = `${publicPath}${req.organizationId}`;

        try {
          await fsPromises.unlink(`${tenantPath}/${item.attachmentFile}`);
        } catch (error) {
          Logger.log('error', 'Delete item attachment file delete failed.', { error });
        }
      }
      return res.status(200).send();
    },
  },

  /**
   * Bulk delete the given items ids.
   */
  bulkDeleteItems: {
    validation: [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = { ids: [], ...req.query };
      const { Item } = req.models;

      const items = await Item.query().whereIn('id', filter.ids);

      const storedItemsIds = items.map((a) => a.id);
      const notFoundItems = difference(filter.ids, storedItemsIds);

      // Validate the not found items.
      if (notFoundItems.length > 0) {
        return res.status(404).send({
          errors: [{ type: 'ITEMS.NOT.FOUND', code: 200, ids: notFoundItems }],
        });
      }

      // Delete the given items ids.
      await Item.query().whereIn('id', storedItemsIds).delete();

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
      const { Resource, Item, View } = req.models;
      const itemsResource = await Resource.query()
        .where('name', 'items')
        .withGraphFetched('fields')
        .first();

      if (!itemsResource) {
        return res.status(400).send({
          errors: [{ type: 'ITEMS_RESOURCE_NOT_FOUND', code: 200 }],
        });
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
