import express from 'express';
import { check, validationResult } from 'express-validator';
import asyncMiddleware from '../middleware/asyncMiddleware';
import ItemCategory from '@/models/ItemCategory';
// import JWTAuth from '@/http/middleware/jwtAuth';

export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

    router.post('/:id',
      this.editCategory.validation,
      asyncMiddleware(this.editCategory.handler));

    router.post('/',
      this.newCategory.validation,
      asyncMiddleware(this.newCategory.handler));

    router.delete('/:id',
      this.deleteItem.validation,
      asyncMiddleware(this.deleteItem.handler));

    // router.get('/:id',
    //   this.getCategory.validation,
    //   asyncMiddleware(this.getCategory.handler));

    router.get('/',
      this.getList.validation,
      asyncMiddleware(this.getList.validation));

    return router;
  },

  /**
   * Creates a new item category.
   */
  newCategory: {
    validation: [
      check('name').exists({ checkFalsy: true }).trim().escape(),
      check('parent_category_id').optional().isNumeric().toInt(),
      check('description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { name, parent_category_id: parentCategoryId, description } = req.body;

      if (parentCategoryId) {
        const foundParentCategory = await ItemCategory.where('id', parentCategoryId).fetch();

        if (!foundParentCategory) {
          return res.boom.notFound('The parent category ID is not found.', {
            errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }],
          });
        }
      }
      const category = await ItemCategory.forge({
        label: name,
        parent_category_id: parentCategoryId,
        description,
      });

      await category.save();
      return res.status(200).send({ id: category.get('id') });
    },
  },

  /**
   * Edit details of the given category item.
   */
  editCategory: {
    validation: [
      check('name').exists({ checkFalsy: true }).trim().escape(),
      check('parent_category_id').optional().isNumeric().toInt(),
      check('description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { name, parent_category_id: parentCategoryId, description } = req.body;

      const itemCategory = await ItemCategory.where('id', id).fetch();

      if (!itemCategory) {
        return res.boom.notFound();
      }

      if (parentCategoryId && parentCategoryId !== itemCategory.attributes.parent_category_id) {
        const foundParentCategory = await ItemCategory.where('id', parentCategoryId).fetch();

        if (!foundParentCategory) {
          return res.boom.notFound('The parent category ID is not found.', {
            errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }],
          });
        }
      }

      await itemCategory.save({
        label: name,
        description,
        parent_category_id: parentCategoryId,
      });

      return res.status(200).send({ id: itemCategory.id });
    },
  },

  /**
   * Delete the give item category.
   */
  deleteItem: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const itemCategory = await ItemCategory.where('id', id).fetch();

      if (!itemCategory) {
        return res.boom.notFound();
      }
      await itemCategory.destroy();
      return res.status(200).send();
    },
  },

  /**
   * Retrieve the list of items.
   */
  getList: {
    validation: [],
    async handler(req, res) {
      const items = await ItemCategory.fetch();

      if (!items) {
        return res.boom.notFound();
      }
      return res.status(200).send({ items: items.toJSON() });
    },
  },
};
