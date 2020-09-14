import express from 'express';
import { check, param, validationResult } from 'express-validator';
import ResourceField from 'models/ResourceField';
import Resource from 'models/Resource';
import asyncMiddleware from '../middleware/asyncMiddleware';

/**
 * Types of the custom fields.
 */
const TYPES = ['text', 'email', 'number', 'url', 'percentage', 'checkbox', 'radio', 'textarea'];

export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

    router.post('/resource/:resource_name',
      this.addNewField.validation,
      asyncMiddleware(this.addNewField.handler));

    router.post('/:field_id',
      this.editField.validation,
      asyncMiddleware(this.editField.handler));

    router.post('/status/:field_id',
      this.changeStatus.validation,
      asyncMiddleware(this.changeStatus.handler));

    // router.get('/:field_id',
    //   asyncMiddleware(this.getField.handler));

    // router.delete('/:field_id',
    //   asyncMiddleware(this.deleteField.handler));

    return router;
  },

  /**
   * Adds a new field control to the given resource.
   * @param {Request} req -
   * @param {Response} res -
   */
  addNewField: {
    validation: [
      param('resource_name').exists().trim().escape(),
      check('label').exists().escape().trim(),
      check('data_type').exists().isIn(TYPES),
      check('help_text').optional(),
      check('default').optional(),
      check('options').optional().isArray(),
      check('options.*.key').exists().isNumeric().toInt(),
      check('options.*.value').exists(),
    ],
    async handler(req, res) {
      const { resource_name: resourceName } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const resource = await Resource.query().where('name', resourceName).first();

      if (!resource) {
        return res.boom.notFound(null, {
          errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }],
        });
      }
      const form = { options: [], ...req.body };
      const choices = form.options.map((option) => ({ key: option.key, value: option.value }));

      const storedResource = await ResourceField.query().insertAndFetch({
        data_type: form.data_type,
        label_name: form.label,
        help_text: form.help_text,
        default: form.default,
        resource_id: resource.id,
        options: choices,
        index: -1,
      });
      return res.status(200).send({ id: storedResource.id });
    },
  },

  /**
   * Edit details of the given field.
   */
  editField: {
    validation: [
      param('field_id').exists().isNumeric().toInt(),
      check('label').exists().escape().trim(),
      check('data_type').exists().isIn(TYPES),
      check('help_text').optional(),
      check('default').optional(),
      check('options').optional().isArray(),
      check('options.*.key').exists().isNumeric().toInt(),
      check('options.*.value').exists(),
    ],
    async handler(req, res) {
      const { field_id: fieldId } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const field = await ResourceField.query().findById(fieldId);

      if (!field) {
        return res.boom.notFound(null, {
          errors: [{ type: 'FIELD_NOT_FOUND', code: 100 }],
        });
      }
      // Sets the default value of optional fields.
      const form = { options: [], ...req.body };
      const choices = form.options.map((option) => ({ key: option.key, value: option.value }));

      await ResourceField.query().findById(field.id).update({
        data_type: form.data_type,
        label_name: form.label,
        help_text: form.help_text,
        default: form.default,
        options: choices,
      });
      return res.status(200).send({ id: field.id });
    },
  },

  /**
   * Retrieve the fields list of the given resource.
   * @param {Request} req -
   * @param {Response} res -
   */
  fieldsList: {
    validation: [
      param('resource_name').toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { resource_name: resourceName } = req.params;
      const resource = await Resource.query().where('name', resourceName).first();

      if (!resource) {
        return res.boom.notFound(null, {
          errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }],
        });
      }
      const fields = await ResourceField.where('resource_id', resource.id).fetchAll();

      return res.status(200).send({ fields: fields.toJSON() });
    },
  },

  /**
   * Change status of the given field.
   */
  changeStatus: {
    validation: [
      param('field_id').toInt(),
      check('active').isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const { field_id: fieldId } = req.params;
      const field = await ResourceField.query().findById(fieldId);

      if (!field) {
        return res.boom.notFound(null, {
          errors: [{ type: 'NOT_FOUND_FIELD', code: 100 }],
        });
      }

      const { active } = req.body;
      await ResourceField.query().findById(field.id).patch({ active });

      return res.status(200).send({ id: field.id });
    },
  },

  /**
   * Retrieve details of the given field.
   */
  getField: {
    validation: [
      param('field_id').toInt(),
    ],
    async handler(req, res) {
      const { field_id: id } = req.params;
      const field = await ResourceField.where('id', id).fetch();

      if (!field) {
        return res.boom.notFound();
      }

      return res.status(200).send({
        field: field.toJSON(),
      });
    },
  },

  /**
   * Delete the given field.
   */
  deleteField: {
    validation: [
      param('field_id').toInt(),
    ],
    async handler(req, res) {
      const { field_id: id } = req.params;
      const field = await ResourceField.where('id', id).fetch();

      if (!field) {
        return res.boom.notFound();
      }
      if (field.attributes.predefined) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PREDEFINED_FIELD', code: 100 }],
        });
      }
      await field.destroy();

      return res.status(200).send({ id: field.get('id') });
    },
  },
};
