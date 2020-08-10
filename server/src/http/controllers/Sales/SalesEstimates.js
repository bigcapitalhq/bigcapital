import express from 'express';
import { check, param, query } from 'express-validator';
import { ItemEntry } from '@/models';
import BaseController from '@/http/controllers/BaseController'
import validateMiddleware from '@/http/middleware/validateMiddleware';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import CustomersService from '@/services/Customers/CustomersService';
import SaleEstimateService from '@/services/Sales/SalesEstimate';
import ItemsService from '@/services/Items/ItemsService';
import DynamicListingBuilder from '@/services/DynamicListing/DynamicListingBuilder';
import DynamicListing from '@/services/DynamicListing/DynamicListing';

export default class SalesEstimatesController extends BaseController {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.post(
      '/',
      this.estimateValidationSchema,
      validateMiddleware,
      asyncMiddleware(this.validateEstimateCustomerExistance),
      asyncMiddleware(this.validateEstimateNumberExistance),
      asyncMiddleware(this.validateEstimateEntriesItemsExistance),
      asyncMiddleware(this.newEstimate)
    );
    router.post(
      '/:id', [
        ...this.validateSpecificEstimateSchema,
        ...this.estimateValidationSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateEstimateIdExistance),
      asyncMiddleware(this.validateEstimateCustomerExistance),
      asyncMiddleware(this.validateEstimateNumberExistance),
      asyncMiddleware(this.validateEstimateEntriesItemsExistance),
      asyncMiddleware(this.valdiateInvoiceEntriesIdsExistance),
      asyncMiddleware(this.editEstimate)
    );
    router.delete(
      '/:id', [
        this.validateSpecificEstimateSchema,
      ],
      validateMiddleware,
      asyncMiddleware(this.validateEstimateIdExistance),
      asyncMiddleware(this.deleteEstimate)
    );
    router.get(
      '/:id',
      this.validateSpecificEstimateSchema,
      validateMiddleware,
      asyncMiddleware(this.validateEstimateIdExistance),
      asyncMiddleware(this.getEstimate)
    );
    router.get(
      '/',
      this.validateEstimateListSchema,
      validateMiddleware,
      asyncMiddleware(this.getEstimates)
    );
    return router;
  }

  /**
   * Estimate validation schema.
   */
  static get estimateValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('estimate_date').exists().isISO8601(),
      check('expiration_date').optional().isISO8601(),
      check('reference').optional(),
      check('estimate_number').exists().trim().escape(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.description').optional().trim().escape(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.discount').optional().isNumeric().toFloat(),

      check('note').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),
    ];
  }

  /**
   * Specific sale estimate validation schema.
   */
  static get validateSpecificEstimateSchema() {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  /**
   * Sales estimates list validation schema.
   */
  static get validateEstimateListSchema() {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(), 
    ]
  }

  /**
   * Validate whether the estimate customer exists on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateEstimateCustomerExistance(req, res, next) {
    const estimate = { ...req.body };
    const isCustomerExists = await CustomersService.isCustomerExists(
      estimate.customer_id
    );
    if (!isCustomerExists) {
      return res.status(404).send({
        errors: [{ type: 'CUSTOMER.ID.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate the estimate number unique on the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateEstimateNumberExistance(req, res, next) {
    const estimate = { ...req.body };

    const isEstNumberUnqiue = await SaleEstimateService.isEstimateNumberUnique(
      estimate.estimate_number,
      req.params.id,
    );
    if (isEstNumberUnqiue) {
      return res.boom.badRequest(null, {
        errors: [{ type: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE', code: 300 }],
      });
    }
    next();    
  }

  /**
   * Validate the estimate entries items ids existance on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateEstimateEntriesItemsExistance(req, res, next) {
    const estimate = { ...req.body };
    const estimateItemsIds = estimate.entries.map(e => e.item_id);

    // Validate items ids in estimate entries exists.
    const notFoundItemsIds = await ItemsService.isItemsIdsExists(estimateItemsIds);

    if (notFoundItemsIds.length > 0) {
      return res.boom.badRequest(null, {
        errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 400 }],
      });
    }
    next();
  }

  /**
   * Validate whether the sale estimate id exists on the storage. 
   * @param {Request} req 
   * @param {Response} res 
   * @param {Function} next 
   */
  static async validateEstimateIdExistance(req, res, next) {
    const { id: estimateId } = req.params;
    const storedEstimate = await SaleEstimateService.getEstimate(estimateId);

    if (!storedEstimate) {
      return res.status(404).send({
        errors: [{ type: 'SALE.ESTIMATE.ID.NOT.FOUND', code: 200 }],
      });
    }
    next();
  }

  /**
   * Validate sale invoice entries ids existance on the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  static async valdiateInvoiceEntriesIdsExistance(req, res, next) {
    const { id: saleInvoiceId } = req.params;
    const saleInvoice = { ...req.body };
    const entriesIds = saleInvoice.entries
      .filter(e => e.id)
      .map((e) => e.id);

    const foundEntries = await ItemEntry.tenant().query()
      .whereIn('id', entriesIds)
      .where('reference_type', 'SaleInvoice')
      .where('reference_id', saleInvoiceId);

    if (foundEntries.length > 0) {
      return res.status(400).send({
        errors: [{ type: 'ENTRIES.IDS.NOT.EXISTS', code: 300 }],
      });
    }
    next();
  }

  /**
   * Handle create a new estimate with associated entries.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response} res -
   */
  static async newEstimate(req, res) {
    const estimate = {
      ...req.body,
      entries: req.body.entries.map((entry) => ({
        ...entry,
        amount: ItemEntry.calcAmount(entry),
      })),
    };
    const storedEstimate = await SaleEstimateService.createEstimate(estimate);

    return res.status(200).send({ id: storedEstimate.id });
  }

  /**
   * Handle update estimate details with associated entries.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async editEstimate(req, res) {
    const { id: estimateId } = req.params;
    const estimate = { ...req.body };

    // Update estimate with associated estimate entries.
    await SaleEstimateService.editEstimate(estimateId, estimate);

    return res.status(200).send({ id: estimateId });
  }

  /**
   * Deletes the given estimate with associated entries.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async deleteEstimate(req, res) {
    const { id: estimateId } = req.params;
    await SaleEstimateService.deleteEstimate(estimateId);

    return res.status(200).send({ id: estimateId });  
  }

  /**
   * Retrieve the given estimate with associated entries.
   */
  static async getEstimate(req, res) {
    const { id: estimateId } = req.params;
    const estimate = await SaleEstimateService.getEstimateWithEntries(estimateId);

    return res.status(200).send({ estimate });
  }

  /**
   * Retrieve estimates with pagination metadata.
   * @param {Request} req 
   * @param {Response} res 
   */
  static async getEstimates(req, res) {
    const filter = {
      filter_roles: [],
      sort_order: 'asc',
      page: 1,
      page_size: 10,
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
      builder.withGraphFetched('customer');
      return builder;
    }).pagination(filter.page - 1, filter.page_size);

    return res.status(200).send({
      sales_estimates: {
        ...salesEstimates,
        ...(viewMeta ? {
          viewMeta: {
            custom_view_id: viewMeta.id,
          },          
        } : {}),
      },
      
    });
  }
};
