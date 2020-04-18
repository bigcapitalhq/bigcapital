import { difference, intersection, pick } from 'lodash';
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
  validateViewRoles,
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
      const form = { roles: [], ...req.body };
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
      if (!validateViewRoles(form.roles, form.logic_expression)) {
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

  /**
   * Edit the given custom view metadata.
   */
  editView: {
    validation: [
      param('view_id').exists().isNumeric().toInt(),
      check('name').exists().escape().trim(),
      check('logic_expression').exists().trim().escape(),

      check('columns').exists().isArray({ min: 1 }),

      check('columns.*.id').optional().isNumeric().toInt(),
      check('columns.*.key').exists().escape().trim(),
      check('columns.*.index').exists().isNumeric().toInt(),

      check('roles').isArray(),
      check('roles.*.id').optional().isNumeric().toInt(),
      check('roles.*.field_key').exists().escape().trim(),
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
      const view = await View.query().where('id', viewId)
        .withGraphFetched('roles.field')
        .withGraphFetched('columns')
        .first();

      if (!view) {
        return res.boom.notFound(null, {
          errors: [{ type: 'ROLE_NOT_FOUND', code: 100 }],
        });
      }
      const form = { ...req.body };
      const resource = await Resource.query()
        .where('id', view.resourceId)
        .withGraphFetched('fields')
        .withGraphFetched('views')
        .first();

      const errorReasons = [];
      const fieldsSlugs = form.roles.map((role) => role.field_key);
      const resourceFieldsKeys = resource.fields.map((f) => f.key);
      const resourceFieldsKeysMap = new Map(resource.fields.map((field) => [field.key, field]));
      const columnsKeys = form.columns.map((c) => c.key);

      // The difference between the stored resource fields and submit fields keys.
      const notFoundFields = difference(fieldsSlugs, resourceFieldsKeys);

      // Validate not found resource fields keys.
      if (notFoundFields.length > 0) {
        errorReasons.push({
          type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: notFoundFields,
        });
      }
      // The difference between the stored resource fields and the submit columns keys.
      const notFoundColumns = difference(columnsKeys, resourceFieldsKeys);

      // Validate not found view columns.
      if (notFoundColumns.length > 0) {
        errorReasons.push({ type: 'RESOURCE_COLUMNS_NOT_EXIST', code: 200, columns: notFoundColumns });
      }
      // Validates the view conditional logic expression.
      if (!validateViewRoles(form.roles, form.logic_expression)) {
        errorReasons.push({ type: 'VIEW.ROLES.LOGIC.EXPRESSION.INVALID', code: 400 });
      }

      const viewRolesIds = view.roles.map((r) => r.id);
      const viewColumnsIds = view.columns.map((c) => c.id);

      const formUpdatedRoles = form.roles.filter((r) => r.id);
      const formInsertRoles = form.roles.filter((r) => !r.id);

      const formRolesIds = formUpdatedRoles.map((r) => r.id);

      const formUpdatedColumns = form.columns.filter((r) => r.id);
      const formInsertedColumns = form.columns.filter((r) => !r.id);
      const formColumnsIds = formUpdatedColumns.map((r) => r.id);

      const rolesIdsShouldDeleted = difference(viewRolesIds, formRolesIds);
      const columnsIdsShouldDelete = difference(viewColumnsIds, formColumnsIds);

      const notFoundViewRolesIds = difference(formRolesIds, viewRolesIds);
      const notFoundViewColumnsIds = difference(viewColumnsIds, viewColumnsIds);

      // Validate the not found view roles ids.
      if (notFoundViewRolesIds.length) {
        errorReasons.push({ type: 'VIEW.ROLES.IDS.NOT.FOUND', code: 500, ids: notFoundViewRolesIds });
      }
      // Validate the not found view columns ids.
      if (notFoundViewColumnsIds.length) {
        errorReasons.push({ type: 'VIEW.COLUMNS.IDS.NOT.FOUND', code: 600, ids: notFoundViewColumnsIds });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const asyncOpers = [];

      // Save view details.
      await View.query()
        .where('id', view.id)
        .patch({
          name: form.name,
          roles_logic_expression: form.logic_expression,
        });

      // Update view roles.
      if (formUpdatedRoles.length > 0) {
        formUpdatedRoles.forEach((role) => {
          const fieldModel = resourceFieldsKeysMap.get(role.field_key);
          const updateOper = ViewRole.query()
            .where('id', role.id)
            .update({
              ...pick(role, ['comparator', 'value', 'index']),
              field_id: fieldModel.id,
            });
          asyncOpers.push(updateOper);
        });
      }
      // Insert a new view roles.
      if (formInsertRoles.length > 0) {
        formInsertRoles.forEach((role) => {
          const fieldModel = resourceFieldsKeysMap.get(role.field_key);
          const insertOper = ViewRole.query()
            .insert({
              ...pick(role, ['comparator', 'value', 'index']),
              field_id: fieldModel.id,
              view_id: view.id,
            });
          asyncOpers.push(insertOper);
        });
      }
      // Delete view roles.
      if (rolesIdsShouldDeleted.length > 0) {
        const deleteOper = ViewRole.query()
          .where('id', rolesIdsShouldDeleted)
          .delete();
        asyncOpers.push(deleteOper);
      }
      // Insert a new view columns to the storage.
      if (formInsertedColumns.length > 0) {
        formInsertedColumns.forEach((column) => {
          const fieldModel = resourceFieldsKeysMap.get(column.key);
          const insertOper = ViewColumn.query()
            .insert({
              field_id: fieldModel.id,
              index: column.index,
              view_id: view.id,
            });
          asyncOpers.push(insertOper);
        });
      }
      // Update the view columns on the storage.
      if (formUpdatedColumns.length > 0) {
        formUpdatedColumns.forEach((column) => {
          const updateOper = ViewColumn.query()
            .where('id', column.id)
            .update({
              index: column.index,
            });
          asyncOpers.push(updateOper);
        });
      }
      // Delete the view columns from the storage.
      if (columnsIdsShouldDelete.length > 0) {
        const deleteOper = ViewColumn.query()
          .whereIn('id', columnsIdsShouldDelete)
          .delete();
        asyncOpers.push(deleteOper);
      }
      await Promise.all(asyncOpers);

      return res.status(200).send();
    },
  },
};
