import { difference } from 'lodash';
import express from 'express';
import { check, validationResult } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Resource from '@/models/Resource';
import View from '../../models/View';

export default {
  resource: 'items',

  router() {
    const router = express.Router();

    router.post('/resource/:resource_id',
      this.createView.validation,
      asyncMiddleware(this.createView.handler));

    router.post('/:view_id',
      this.editView.validation,
      asyncMiddleware(this.editView.handler));

    router.delete('/:view_id',
      this.deleteView.validation,
      asyncMiddleware(this.deleteView.handler));

    router.get('/:view_id',
      asyncMiddleware(this.getView.handler));

    return router;
  },

  /**
   * List all views that associated with the given resource.
   */
  listViews: {
    validation: [],
    async handler(req, res) {
      const { resource_id: resourceId } = req.params;
      const views = await View.where('resource_id', resourceId).fetchAll();

      return res.status(200).send({ views: views.toJSON() });
    },
  },

  getView: {
    async handler(req, res) {
      const { view_id: viewId } = req.params;
      const view = await View.where('id', viewId).fetch({
        withRelated: ['resource', 'columns', 'viewRoles'],
      });

      if (!view) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }],
        });
      }

      return res.status(200).send({ ...view.toJSON() });
    },
  },

  /**
   * Delete the given view of the resource.
   */
  deleteView: {
    validation: [],
    async handler(req, res) {
      const { view_id: viewId } = req.params;
      const view = await View.where('id', viewId).fetch({
        withRelated: ['viewRoles', 'columns'],
      });

      if (!view) {
        return res.boom.notFound(null, {
          errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }],
        });
      }

      if (view.attributes.predefined) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PREDEFINED_VIEW', code: 200 }],
        });
      }
      // console.log(view);
      await view.destroy();

      // await view.columns().destroy({ require: false });

      return res.status(200).send({ id: view.get('id') });
    },
  },

  /**
   * Creates a new view.
   */
  createView: {
    validation: [
      check('label').exists().escape().trim(),
      check('columns').isArray({ min: 3 }),
      check('roles').isArray(),
      check('roles.*.field').exists().escape().trim(),
      check('roles.*.comparator').exists(),
      check('roles.*.value').exists(),
      check('roles.*.index').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { resource_id: resourceId } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const resource = await Resource.where('id', resourceId).fetch();

      if (!resource) {
        return res.boom.notFound(null, {
          errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }],
        });
      }
      const errorReasons = [];
      const { label, roles, columns } = req.body;

      const fieldsSlugs = roles.map((role) => role.field);

      const resourceFields = await resource.fields().fetch();
      const resourceFieldsKeys = resourceFields.map((f) => f.get('key'));
      const notFoundFields = difference(fieldsSlugs, resourceFieldsKeys);

      if (notFoundFields.length > 0) {
        errorReasons.push({ type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields });
      }

      const notFoundColumns = difference(columns, resourceFieldsKeys);

      if (notFoundColumns.length > 0) {
        errorReasons.push({ type: 'COLUMNS_NOT_EXIST', code: 200, fields: notFoundColumns });
      }

      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }

      const view = await View.forge({
        name: label,
        predefined: false,
      });

      // Save view details.
      await view.save();

      // Save view columns.

      // Save view roles.


      return res.status(200).send();
    },
  },


  editView: {
    validation: [
      check('label').exists().escape().trim(),
      check('columns').isArray({ min: 3 }),
      check('roles').isArray(),
      check('roles.*.field').exists().escape().trim(),
      check('roles.*.comparator').exists(),
      check('roles.*.value').exists(),
      check('roles.*.index').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { view_id: viewId } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const view = await View.where('id', viewId).fetch();

      if (!view) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }],
        });
      }

      return res.status(200).send();
    },
  },
};
