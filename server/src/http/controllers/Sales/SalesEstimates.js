import express from 'express';
import { check, param, query } from 'express-validator';
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import CustomersService from '@/services/Customers/CustomersService';
import SaleEstimateService from '@/services/Sales/SalesEstimate';
import ItemsService from '@/services/Items/ItemsService';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';

export default {
  router() {
    const router = express.Router();

    router.post(
      '/',
      this.newEstimate.validation,
      validateMiddleware,
      asyncMiddleware(this.newEstimate.handler)
    );
    router.post(
      '/:id',
      this.editEstimate.validation,
      validateMiddleware,
      asyncMiddleware(this.editEstimate.handler)
    );
    router.delete(
      '/:id',
      this.deleteEstimate.validation,
      validateMiddleware,
      asyncMiddleware(this.deleteEstimate.handler)
    );
    router.get(
      '/:id',
      this.getEstimate.validation,
      validateMiddleware,
      asyncMiddleware(this.getEstimate.handler)
    );
    router.get(
      '/',
      this.getEstimates.validation,
      validateMiddleware,
      asyncMiddleware(this.getEstimates.handler)
    );

    return router;
  },

  /**
   * Handle create a new estimate with associated entries.
   */
  newEstimate: {
    validation: [
      check('customer_id').exists().isNumeric().toInt(),
      check('estimate_date').exists().isISO8601(),
      check('expiration_date').optional().isISO8601(),
      check('reference').optional(),
      check('estimate_number').exists().trim().escape(),
      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('note').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),
    ],
    async handler(req, res) {
      const estimate = { ...req.body };
      const isCustomerExists = await CustomersService.isCustomerExists(
        estimate.customer_id
      );

      if (!isCustomerExists) {
        return res.status(404).send({
          errors: [{ type: 'CUSTOMER.ID.NOT.FOUND', code: 200 }],
        });
      }
      const isEstNumberUnqiue = await SaleEstimateService.isEstimateNumberUnique(
        estimate.estimate_number
      );
      if (isEstNumberUnqiue) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE', code: 300 }],
        });
      }
      // Validate items ids in estimate entries exists.
      const estimateItemsIds = estimate.entries.map(e => e.item_id);
      const notFoundItemsIds = await ItemsService.isItemsIdsExists(estimateItemsIds);

      if (notFoundItemsIds.length > 0) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }],
        });
      }
      const storedEstimate = await SaleEstimateService.createEstimate(estimate);

      return res.status(200).send({ id: storedEstimate.id });
    },
  },

  /**
   * Handle update estimate details with associated entries.
   */
  editEstimate: {
    validation: [
      param('id').exists().isNumeric().toInt(),

      check('customer_id').exists().isNumeric().toInt(),
      check('estimate_date').exists().isISO8601(),
      check('expiration_date').optional().isISO8601(),
      check('reference').optional(),
      check('estimate_number').exists().trim().escape(),
      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.id').optional().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),
      check('note').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),
    ],
    async handler(req, res) {
      const { id: estimateId } = req.params;
      const estimate = { ...req.body };
      const storedEstimate = await SaleEstimateService.getEstimate(estimateId);

      if (!storedEstimate) {
        return res.status(404).send({
          errors: [{ type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200 }],
        });
      }
      const isCustomerExists = await CustomersService.isCustomerExists(
        estimate.customer_id
      );
      if (!isCustomerExists) {
        return res.status(404).send({
          errors: [{ type: 'CUSTOMER.ID.NOT.FOUND', code: 200 }],
        });
      }
      // Validate the estimate number is unique except on the current estimate id.
      const foundEstimateNumbers = await SaleEstimateService.isEstimateNumberUnique(
        estimate.estimate_number,
        storedEstimate.id, // Exclude the given estimate id.
      );
      if (foundEstimateNumbers) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE', code: 300 }],
        });
      }
      // Validate items ids in estimate entries exists.
      const estimateItemsIds = estimate.entries.map(e => e.item_id);
      const notFoundItemsIds = await ItemsService.isItemsIdsExists(estimateItemsIds);

      if (notFoundItemsIds.length > 0) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }],
        });
      }
      // Validate the sale estimate entries IDs that not found.
      const notFoundEntriesIds = await SaleEstimateService.isEstimateEntriesIDsExists(
        storedEstimate.id,
        estimate
      );
      if (notFoundEntriesIds.length > 0) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ESTIMATE.NOT.FOUND.ENTRIES.IDS', code: 500 }],
        });
      }
      // Update estimate with associated estimate entries.
      await SaleEstimateService.editEstimate(estimateId, estimate);

      return res.status(200).send({ id: estimateId });
    },
  },

  /**
   * Deletes the given estimate with associated entries.
   */
  deleteEstimate: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const { id: estimateId } = req.params;
      const isEstimateExists = await SaleEstimateService.isEstimateExists(estimateId);

      if (!isEstimateExists) {
        return res.status(404).send({
          errors: [{ type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200 }],
        });
      }
      await SaleEstimateService.deleteEstimate(estimateId);

      return res.status(200).send({ id: estimateId });
    },
  },

  /**
   * Retrieve the given estimate with associated entries.
   */
  getEstimate: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const { id: estimateId } = req.params;
      const estimate = await SaleEstimateService.getEstimateWithEntries(estimateId);

      if (!estimate) {
        return res.status(404).send({
          errors: [{ type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200 }],
        });
      }
      return res.status(200).send({ estimate });
    },
  },

  /**
   * Retrieve estimates with pagination metadata.
   */
  getEstimates: {
    validation: [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ],
    async handler(req, res) {
      const filter = {
        filter_roles: [],
        sort_order: 'asc',
        ...req.query,
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }
      const { SaleEstimate, Resource, View } = req.models;
      const resource = await Resource.tenant().query()
        .remember()
        .where('name', 'sales_estimates')
        .withGraphFetched('fields')
        .first();

      if (!resource) {
        return res.status(400).send({
          errors: [{ type: 'RESOURCE.NOT.FOUND', code: 200, }],
        });
      }
      const viewMeta = await View.query()
        .modify('allMetadata')
        .modify('specificOrFavourite', filter.custom_view_id)
        .where('resource_id', resource.id)
        .first();

      const listingBuilder = new DynamicListingBuilder();      
      const errorReasons = [];

      listingBuilder.addView(viewMeta);
      listingBuilder.addModelClass(SaleEstimate);
      listingBuilder.addCustomViewId(filter.custom_view_id);
      listingBuilder.addFilterRoles(filter.filter_roles);
      listingBuilder.addSortBy(filter.sort_by, filter.sort_order);

      const dynamicListing = new DynamicListing(listingBuilder);

      if (dynamicListing instanceof Error) {
        const errors = dynamicListingErrorsToResponse(dynamicListing);
        errorReasons.push(...errors);
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      const salesEstimates = await SaleEstimate.query().onBuild((builder) => {
        dynamicListing.buildQuery()(builder);
        return builder;
      });

      return res.status(200).send({
        sales_estimates: salesEstimates,
        ...(viewMeta ? {
          custom_view_id: viewMeta.id,
        } : {}),
      });
    },
  },
};
