import express from 'express';
import { check, validationResult } from 'express-validator';
import moment from 'moment';
import { difference } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import Item from '@/models/Item';
import Account from '@/models/Account';
import ItemCategory from '@/models/ItemCategory';
import Resource from '@/models/Resource';
import ResourceField from '@/models/ResourceField';
import Authorization from '@/http/middleware/authorization';

export default {

  router() {
    const router = express.Router();
    const permit = Authorization('items');

    router.use(jwtAuth);

    // router.post('/:id',
    //   this.editItem.validation,
    //   asyncMiddleware(this.editCategory.handler));

    router.post('/',
      permit('create'),
      this.newItem.validation,
      asyncMiddleware(this.newItem.handler));

    // router.delete('/:id',
    //   this.deleteItem.validation,
    //   asyncMiddleware(this.deleteItem.handler));

    // router.get('/:id',
    //   this.getCategory.validation,
    //   asyncMiddleware(this.getCategory.handler));

    // router.get('/',
    //   this.categoriesList.validation,
    //   asyncMiddleware(this.categoriesList.validation));

    return router;
  },

  /**
   * Creates a new item.
   */
  newItem: {
    validation: [
      check('name').exists(),
      check('type_id').exists().isInt(),
      check('buy_price').exists().isNumeric(),
      check('cost_price').exists().isNumeric(),
      check('cost_account_id').exists().isInt(),
      check('sell_account_id').exists().isInt(),
      check('category_id').optional().isInt(),

      check('custom_fields').isArray({ min: 1 }),
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
      const form = { ...req.body };
      const errorReasons = [];

      const costAccountPromise = Account.where('id', form.cost_account_id).fetch();
      const sellAccountPromise = Account.where('id', form.sell_account_id).fetch();
      const itemCategoryPromise = (form.category_id)
        ? ItemCategory.where('id', form.category_id).fetch() : null;

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
      const item = Item.forge({
        name: req.body.name,
        type_id: 1,
        buy_price: req.body.buy_price,
        sell_price: req.body.sell_price,
        currency_code: req.body.currency_code,
        note: req.body.note,
      });
      await item.save();

      return res.status(200).send();
    },
  },

  /**
   * Edit the given item.
   */
  editItem: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const item = await Item.where('id', id).fetch();

      if (!item) {
        return res.boom.notFound();
      }
      return res.status(200).send();
    },
  },

  /**
   * Delete the given item from the storage.
   */
  deleteItem: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const item = await Item.where('id', id).fetch();

      if (!item) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ITEM_NOT_FOUND', code: 100 }],
        });
      }

      await item.destroy();
      return res.status(200).send();
    },
  },

  /**
   * Retrive the list items with pagination meta.
   */
  listItems: {
    validation: [],
    async handler(req, res) {
      const filter = {
        name: '',
        description: '',
        SKU: '',
        account_id: null,
        page_size: 10,
        page: 1,
        start_date: null,
        end_date: null,
        ...req.query,
      };

      const items = await Item.query((query) => {
        if (filter.description) {
          query.where('description', 'like', `%${filter.description}%`);
        }
        if (filter.description) {
          query.where('SKU', filter.SKY);
        }
        if (filter.name) {
          query.where('name', filter.name);
        }
        if (filter.start_date) {
          const startDateFormatted = moment(filter.start_date).format('YYYY-MM-DD HH:mm:SS');
          query.where('created_at', '>=', startDateFormatted);
        }
        if (filter.end_date) {
          const endDateFormatted = moment(filter.end_date).format('YYYY-MM-DD HH:mm:SS');
          query.where('created_at', '<=', endDateFormatted);
        }
      }).fetchPage({
        page_size: filter.page_size,
        page: filter.page,
      });

      return res.status(200).send({
        items: items.toJSON(),
        pagination: items.pagination,
      });
    },
  },
};
