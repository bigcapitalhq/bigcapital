import express from 'express';
import {
  param,
  query,
} from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get('/:resource_slug/data',
      this.resourceData.validation,
      asyncMiddleware(this.resourceData.handler));

    router.get('/:resource_slug/columns',
      this.resourceColumns.validation,
      asyncMiddleware(this.resourceColumns.handler));

    router.get('/:resource_slug/fields',
      this.resourceFields.validation,
      asyncMiddleware(this.resourceFields.handler));

    return router;
  },

  /**
   * Retrieve resource data of the given resource key/slug.
   */
  resourceData: {
    validation: [
      param('resource_slug').trim().escape().exists(),
    ],
    async handler(req, res) {
      const { AccountType } = req.models;
      const { resource_slug: resourceSlug } = req.params;

      const data = await AccountType.query();

      return res.status(200).send({
        data,
        resource_slug: resourceSlug,
      });
    },
  },

  /**
   * Retrieve resource columns of the given resource.
   */
  resourceColumns: {
    validation: [
      param('resource_slug').trim().escape().exists(),
    ],
    async handler(req, res) {
      const { resource_slug: resourceSlug } = req.params;
      const { Resource } = req.models;

      const resource = await Resource.query()
        .where('name', resourceSlug)
        .withGraphFetched('fields')
        .first();

      if (!resource) {
        return res.status(400).send({
          errors: [{ type: 'RESOURCE.SLUG.NOT.FOUND', code: 200 }],
        });
      }
      const resourceFields = resource.fields
        .filter((field) => field.columnable)
        .map((field) => ({
          id: field.id,
          label: field.labelName,
          key: field.key,
        }));

      return res.status(200).send({
        resource_columns: resourceFields,
        resource_slug: resourceSlug,
      });
    },
  },

  /**
   * Retrieve resource fields of the given resource.
   */
  resourceFields: {
    validation: [
      param('resource_slug').trim().escape().exists(),
      query('predefined').optional().isBoolean().toBoolean(),
      query('builtin').optional().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const { resource_slug: resourceSlug } = req.params;
      const { Resource } = req.models;

      const resource = await Resource.query()
        .where('name', resourceSlug)
        .withGraphFetched('fields')
        .first();

      if (!resource) {
        return res.status(400).send({
          errors: [{ type: 'RESOURCE.SLUG.NOT.FOUND', code: 200 }],
        });
      }
      return res.status(200).send({
        resource_fields: resource.fields,
        resource_slug: resourceSlug,
      });
    },
  },
};
