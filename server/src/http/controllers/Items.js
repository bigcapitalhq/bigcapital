import express from 'express';
import { check, validationResult } from 'express-validator';
import moment from 'moment';
import asyncMiddleware from '../middleware/asyncMiddleware';
import Item from '@/models/Item';
import Account from '@/models/Account';
import ItemCategory from '@/models/ItemCategory';

export default {

  router() {
    const router = express.Router();

    // router.post('/:id',
    //   this.editItem.validation,
    //   asyncMiddleware(this.editCategory.handler));

    router.post('/',
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
      check('note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { sell_account_id: sellAccountId, cost_account_id: costAccountId } = req.body;
      const { category_id: categoryId } = req.body;

      const costAccountPromise = Account.where('id', costAccountId).fetch();
      const sellAccountPromise = Account.where('id', sellAccountId).fetch();
      const itemCategoryPromise = (categoryId)
        ? ItemCategory.where('id', categoryId).fetch() : null;

      const [costAccount, sellAccount, itemCategory] = await Promise.all([
        costAccountPromise, sellAccountPromise, itemCategoryPromise,
      ]);

      const errorReasons = [];

      if (!costAccount) {
        errorReasons.push({ type: 'COST_ACCOUNT_NOT_FOUND', code: 100 });
      }
      if (!sellAccount) {
        errorReasons.push({ type: 'SELL_ACCOUNT_NOT_FOUND', code: 120 });
      }
      if (!itemCategory && categoryId) {
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
