import express from 'express';
import { check, param, validationResult } from 'express-validator';
import asyncMiddleware from '../middleware/asyncMiddleware';
import ItemCategory from '@/models/ItemCategory';
import Authorization from '@/http/middleware/authorization';
import JWTAuth from '@/http/middleware/jwtAuth';

export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();
    // const permit = Authorization('items_categories');

    router.use(JWTAuth);

    router.post(
      '/:id',
      // permit('create', 'edit'),
      this.editCategory.validation,
      asyncMiddleware(this.editCategory.handler)
    );

    router.post(
      '/',
      // permit('create'),
      this.newCategory.validation,
      asyncMiddleware(this.newCategory.handler)
    );

    router.delete(
      '/:id',
      // permit('create', 'edit', 'delete'),
      this.deleteItem.validation,
      asyncMiddleware(this.deleteItem.handler)
    );

    router.get(
      '/:id',
      // permit('view'),
      this.getCategory.validation,
      asyncMiddleware(this.getCategory.handler)
    );

    router.get(
      '/',
      // permit('view'),
      this.getList.validation,
      asyncMiddleware(this.getList.handler)
    );

    return router;
  },

  /**
   * Creates a new item category.
   */
  newCategory: {
    validation: [
      check('name')
        .exists()
        .trim()
        .escape(),
      check('parent_category_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('description')
        .optional()
        .trim()
        .escape()
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors
        });
      }

      const { user } = req;
      const form = { ...req.body };

      if (form.parent_category_id) {
        const foundParentCategory = await ItemCategory.query()
          .where('id', form.parent_category_id)
          .first();

        if (!foundParentCategory) {
          return res.boom.notFound('The parent category ID is not found.', {
            errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }]
          });
        }
      }
      const category = await ItemCategory.query().insert({
        ...form,
        user_id: user.id
      });
      return res.status(200).send({ category });
    }
  },

  /**
   * Edit details of the given category item.
   */
  editCategory: {
    validation: [
      param('id').toInt(),
      check('name')
        .exists()
        .trim()
        .escape(),
      check('parent_category_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('description')
        .optional()
        .trim()
        .escape()
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors
        });
      }

      const form = { ...req.body };
      const itemCategory = await ItemCategory.query()
        .where('id', id)
        .first();

      if (!itemCategory) {
        return res.boom.notFound({
          errors: [{ type: 'ITEM_CATEGORY.NOT.FOUND', code: 100 }]
        });
      }
      if (
        form.parent_category_id &&
        form.parent_category_id !== itemCategory.parent_category_id
      ) {
        const foundParentCategory = await ItemCategory.query()
          .where('id', form.parent_category_id)
          .first();

        if (!foundParentCategory) {
          return res.boom.notFound('The parent category ID is not found.', {
            errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }]
          });
        }
      }
      const updateItemCategory = await ItemCategory.query()
        .where('id', id)
        .update({ ...form });

      return res.status(200).send({ id: updateItemCategory });
    }
  },

  /**
   * Delete the give item category.
   */
  deleteItem: {
    validation: [
      param('id')
        .exists()
        .toInt()
    ],
    async handler(req, res) {
      const { id } = req.params;
      const itemCategory = await ItemCategory.query()
        .where('id', id)
        .first();

      if (!itemCategory) {
        return res.boom.notFound();
      }

      await ItemCategory.query()
        .where('id', itemCategory.id)
        .delete();

      return res.status(200).send();
    }
  },

  /**
   * Retrieve the list of items.
   */
  getList: {
    validation: [],
    async handler(req, res) {
      const categories = await ItemCategory.query();

      return res.status(200).send({ categories });
    }
  },

  /**
   * Retrieve details of the given category.
   */
  getCategory: {
    validation: [param('category_id').toInt()],
    async handler(req, res) {
      const { category_id: categoryId } = req.params;
      const item = await ItemCategory.where('id', categoryId).fetch();

      if (!item) {
        return res.boom.notFound(null, {
          errors: [{ type: 'CATEGORY_NOT_FOUND', code: 100 }]
        });
      }

      return res.status(200).send({ category: item.toJSON() });
    }
  }
};
