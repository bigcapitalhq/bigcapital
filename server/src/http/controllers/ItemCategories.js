import express from 'express';
import {
  check,
  param,
  validationResult,
  query,
} from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '../middleware/asyncMiddleware';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterFilterRoles,
} from '@/lib/DynamicFilter';
import {
  mapFilterRolesToDynamicFilter,
} from '@/lib/ViewRolesBuilder';


export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();
    // const permit = Authorization('items_categories');

    router.post('/:id',
      this.editCategory.validation,
      asyncMiddleware(this.editCategory.handler));

    router.post('/',
      this.newCategory.validation,
      asyncMiddleware(this.newCategory.handler));

    router.delete('/bulk',
      this.bulkDeleteCategories.validation,
      asyncMiddleware(this.bulkDeleteCategories.handler));

    router.delete('/:id',
      this.deleteItem.validation,
      asyncMiddleware(this.deleteItem.handler));

    router.get('/:id',
      this.getCategory.validation,
      asyncMiddleware(this.getCategory.handler));

    router.get('/',
      this.getList.validation,
      asyncMiddleware(this.getList.handler));

    

    return router;
  },

  /**
   * Creates a new item category.
   */
  newCategory: {
    validation: [
      check('name').exists().trim().escape(),
      check('parent_category_id')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
        .toInt(),
      check('description')
        .optional()
        .trim()
        .escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { user } = req;
      const form = { ...req.body };
      const { ItemCategory } = req.models;

      if (form.parent_category_id) {
        const foundParentCategory = await ItemCategory.query()
          .where('id', form.parent_category_id)
          .first();

        if (!foundParentCategory) {
          return res.boom.notFound('The parent category ID is not found.', {
            errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }],
          });
        }
      }
      const category = await ItemCategory.query().insert({
        ...form,
        user_id: user.id,
      });
      return res.status(200).send({ category });
    },
  },

  /**
   * Edit details of the given category item.
   */
  editCategory: {
    validation: [
      param('id').toInt(),
      check('name').exists().trim().escape(),
      check('parent_category_id')
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
        .toInt(),
      check('description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }

      const form = { ...req.body };
      const { ItemCategory } = req.models;
      const itemCategory = await ItemCategory.query()
        .where('id', id)
        .first();

      if (!itemCategory) {
        return res.boom.notFound({
          errors: [{ type: 'ITEM_CATEGORY.NOT.FOUND', code: 100 }],
        });
      }
      if (
        form.parent_category_id
        && form.parent_category_id !== itemCategory.parent_category_id
      ) {
        const foundParentCategory = await ItemCategory.query()
          .where('id', form.parent_category_id)
          .first();

        if (!foundParentCategory) {
          return res.boom.notFound('The parent category ID is not found.', {
            errors: [{ type: 'PARENT_CATEGORY_NOT_FOUND', code: 100 }],
          });
        }
      }
      const updateItemCategory = await ItemCategory.query()
        .where('id', id)
        .update({ ...form });

      return res.status(200).send({ id });
    },
  },

  /**
   * Delete the give item category.
   */
  deleteItem: {
    validation: [
      param('id').exists().toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const { ItemCategory } = req.models;
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
    },
  },

  /**
   * Retrieve the list of items.
   */
  getList: {
    validation: [
      query('column_sort_order').optional().trim().escape(),
      query('sort_order').optional().trim().escape().isIn(['desc', 'asc']),
      query('stringified_filter_roles').optional().isJSON(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

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
    },
  },

  /**
   * Retrieve details of the given category.
   */
  getCategory: {
    validation: [param('category_id').toInt()],
    async handler(req, res) {
      const { category_id: categoryId } = req.params;
      const { ItemCategory } = req.models;
      const item = await ItemCategory.where('id', categoryId).fetch();

      if (!item) {
        return res.boom.notFound(null, {
          errors: [{ type: 'CATEGORY_NOT_FOUND', code: 100 }],
        });
      }
      return res.status(200).send({ category: item.toJSON() });
    },
  },


  /**
   * Bulk delete the given item categories.
   */
  bulkDeleteCategories: {
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
      const filter = {
        ids: [],
        ...req.query,
      };
      const { ItemCategory } = req.models;
      
      const itemCategories = await ItemCategory.query().whereIn('id', filter.ids);
      const itemCategoriesIds = itemCategories.map((category) => category.id);
      const notFoundCategories = difference(filter.ids, itemCategoriesIds);

      if (notFoundCategories.length > 0) {
        return res.status(400).send({
          errors: [{ type: 'ITEM.CATEGORIES.IDS.NOT.FOUND', code: 200 }],
        });
      }

      await ItemCategory.query().whereIn('id', filter.ids).delete();

      return res.status(200).send({ ids: filter.ids });
    },
  },
};
