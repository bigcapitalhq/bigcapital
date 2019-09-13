import express from 'express';
import { check, param, validationResult } from 'express-validator';
import ResourceField from '@/models/ResourceField';
import Resource from '@/models/Resource';
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

    router.post('/resource/:resource_id',
      this.addNewField.validation,
      asyncMiddleware(this.addNewField.handler));

    router.post('/:field_id',
      this.editField.validation,
      asyncMiddleware(this.editField.handler));

    router.post('/status/:field_id',
      this.changeStatus.validation,
      asyncMiddleware(this.changeStatus.handler));

    router.get('/:field_id',
      asyncMiddleware(this.getField.handler));

    router.delete('/:field_id',
      asyncMiddleware(this.deleteField.handler));

    return router;
  },

  /**
   * Adds a new field control to the given resource.
   * @param {Request} req -
   * @param {Response} res -
   */
  addNewField: {
    validation: [
      param('resource_id').toInt(),
      check('label').exists().escape().trim(),
      check('data_type').exists().isIn(TYPES),
      check('help_text').optional(),
      check('default').optional(),
      check('options').optional().isArray(),
    ],
    async handler(req, res) {
      const { resource_id: resourceId } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'VALIDATION_ERROR', ...validationErrors,
        });
      }
      const resource = await Resource.where('id', resourceId).fetch();

      if (!resource) {
        return res.boom.notFound(null, {
          errors: [{ type: 'RESOURCE_NOT_FOUND', code: 100 }],
        });
      }

      const { label, data_type: dataType, help_text: helpText } = req.body;
      const { default: defaultValue, options } = req.body;

      const choices = options.map((option, index) => ({ key: index + 1, value: option }));

      const field = ResourceField.forge({
        data_type: dataType,
        label_name: label,
        help_text: helpText,
        default: defaultValue,
        resource_id: resource.id,
        options: choices,
      });

      await field.save();

      return res.status(200).send();
    },
  },

  /**
   * Edit details of the given field.
   */
  editField: {
    validation: [
      param('field_id').toInt(),
      check('label').exists().escape().trim(),
      check('data_type').exists(),
      check('help_text').optional(),
      check('default').optional(),
      check('options').optional().isArray(),
    ],
    async handler(req, res) {
      const { field_id: fieldId } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'VALIDATION_ERROR', ...validationErrors,
        });
      }

      const field = await ResourceField.where('id', fieldId).fetch();

      if (!field) {
        return res.boom.notFound(null, {
          errors: [{ type: 'FIELD_NOT_FOUND', code: 100 }],
        });
      }

      // Sets the default value of optional fields.
      const form = { options: [], ...req.body };

      const { label, data_type: dataType, help_text: helpText } = form;
      const { default: defaultValue, options } = form;

      const storedFieldOptions = field.attributes.options || [];
      let lastChoiceIndex = 0;
      storedFieldOptions.forEach((option) => {
        const key = parseInt(option.key, 10);
        if (key > lastChoiceIndex) {
          lastChoiceIndex = key;
        }
      });
      const savedOptionKeys = options.filter((op) => typeof op === 'object');
      const notSavedOptionsKeys = options.filter((op) => typeof op !== 'object');

      const choices = [
        ...savedOptionKeys,
        ...notSavedOptionsKeys.map((option) => {
          lastChoiceIndex += 1;
          return { key: lastChoiceIndex, value: option };
        }),
      ];

      await field.save({
        data_type: dataType,
        label_name: label,
        help_text: helpText,
        default: defaultValue,
        options: choices,
      });

      return res.status(200).send({ id: field.get('id') });
    },
  },

  /**
   * Retrieve the fields list of the given resource.
   * @param {Request} req -
   * @param {Response} res -
   */
  fieldsList: {
    validation: [
      param('resource_id').toInt(),
    ],
    async handler(req, res) {
      const { resource_id: resourceId } = req.params;
      const fields = await ResourceField.where('resource_id', resourceId).fetchAll();

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
      const field = await ResourceField.where('id', fieldId).fetch();

      if (!field) {
        return res.boom.notFound(null, {
          errors: [{ type: 'NOT_FOUND_FIELD', code: 100 }],
        });
      }

      const { active } = req.body;
      await field.save({ active });

      return res.status(200).send({ id: field.get('id') });
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
