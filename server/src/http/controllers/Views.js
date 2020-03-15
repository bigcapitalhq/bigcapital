import { difference, pick } from 'lodash';
import express from 'express';
import {
  check,
  query,
  param,
  oneOf,
  validationResult,
} from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import Resource from '@/models/Resource';
import View from '@/models/View';
import ViewRole from '@/models/ViewRole';
import ViewColumn from '@/models/ViewColumn';
import {
  validateViewLogicExpression,
} from '@/lib/ViewRolesBuilder';

export default {
  resource: 'items',

  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use(jwtAuth);

    router.get('/',
      this.listViews.validation,
      asyncMiddleware(this.listViews.handler));

    router.post('/',
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
    validation: [
      oneOf([
        query('resource_name').exists().trim().escape(),
      ], [
        query('resource_id').exists().isNumeric().toInt(),
      ]),
    ],
    async handler(req, res) {
      const filter = { ...req.query };

      const resource = await Resource.query().onBuild((builder) => {
        if (filter.resource_id) {
          builder.where('id', filter.resource_id);
        }
        if (filter.resource_name) {
          builder.where('name', filter.resource_name);
        }
        builder.first();
      });

      const views = await View.query().where('resource_id', resource.id);

      return res.status(200).send({ views });
    },
  },

  /**
   * Retrieve view details of the given view id.
   */
  getView: {
    validation: [
      param('view_id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { view_id: viewId } = req.params;
      const view = await View.query()
        .where('id', viewId)
        .withGraphFetched('resource')
        .withGraphFetched('columns')
        .withGraphFetched('roles.field')
        .first();

      if (!view) {
        return res.boom.notFound(null, {
          errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }],
        });
      }
      return res.status(200).send({ view: view.toJSON() });
    },
  },

  /**
   * Delete the given view of the resource.
   */
  deleteView: {
    validation: [
      param('view_id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { view_id: viewId } = req.params;
      const view = await View.query().findById(viewId);

      if (!view) {
        return res.boom.notFound(null, {
          errors: [{ type: 'VIEW_NOT_FOUND', code: 100 }],
        });
      }
      if (view.predefined) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PREDEFINED_VIEW', code: 200 }],
        });
      }
      await Promise.all([
        view.$relatedQuery('roles').delete(),
        view.$relatedQuery('columns').delete(),
      ]);
      await View.query().where('id', view.id).delete();

      return res.status(200).send({ id: view.id });
    },
  },

  /**
   * Creates a new view.
   */
  createView: {
    validation: [
      check('resource_name').exists().escape().trim(),
      check('name').exists().escape().trim(),
      check('logic_expression').exists().trim().escape(),
      check('roles').isArray({ min: 1 }),
      check('roles.*.field_key').exists().escape().trim(),
      check('roles.*.comparator').exists(),
      check('roles.*.value').exists(),
      check('roles.*.index').exists().isNumeric().toInt(),
      check('columns').exists().isArray({ min: 1 }),
      check('columns.*.key').exists().escape().trim(),
      check('columns.*.index').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const resource = await Resource.query().where('name', form.resource_name).first();

      if (!resource) {
        return res.boom.notFound(null, {
          errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }],
        });
      }
      const errorReasons = [];
      const fieldsSlugs = form.roles.map((role) => role.field_key);

      const resourceFields = await resource.$relatedQuery('fields');
      const resourceFieldsKeys = resourceFields.map((f) => f.key);
      const resourceFieldsKeysMap = new Map(resourceFields.map((field) => [field.key, field]));
      const columnsKeys = form.columns.map((c) => c.key);

      // The difference between the stored resource fields and submit fields keys.
      const notFoundFields = difference(fieldsSlugs, resourceFieldsKeys);

      if (notFoundFields.length > 0) {
        errorReasons.push({ type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields });
      }
      // The difference between the stored resource fields and the submit columns keys.
      const notFoundColumns = difference(columnsKeys, resourceFieldsKeys);

      if (notFoundColumns.length > 0) {
        errorReasons.push({ type: 'COLUMNS_NOT_EXIST', code: 200, columns: notFoundColumns });
      }
      // Validates the view conditional logic expression.
      if (!validateViewLogicExpression(form.logic_expression, form.roles.map((r) => r.index))) {
        errorReasons.push({ type: 'VIEW.ROLES.LOGIC.EXPRESSION.INVALID', code: 400 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }

      // Save view details.
      const view = await View.query().insert({
        name: form.name,
        predefined: false,
        resource_id: resource.id,
        roles_logic_expression: form.logic_expression,
      });
      // Save view roles async operations.
      const saveViewRolesOpers = [];

      form.roles.forEach((role) => {
        const fieldModel = resourceFieldsKeysMap.get(role.field_key);
        
        const saveViewRoleOper = ViewRole.query().insert({
          ...pick(role, ['comparator', 'value', 'index']),
          field_id: fieldModel.id,
          view_id: view.id,
        });
        saveViewRolesOpers.push(saveViewRoleOper);
      });

      form.columns.forEach((column) => {
        const fieldModel = resourceFieldsKeysMap.get(column.key);

        const saveViewColumnOper = ViewColumn.query().insert({
          field_id: fieldModel.id,
          view_id: view.id,
          index: column.index,
        });
        saveViewRolesOpers.push(saveViewColumnOper);
      });
      await Promise.all(saveViewRolesOpers);

      return res.status(200).send({ id: view.id });
    },
  },

  editView: {
    validation: [
      param('view_id').exists().isNumeric().toInt(),
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
