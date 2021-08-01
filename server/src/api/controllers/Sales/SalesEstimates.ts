import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, matchedData } from 'express-validator';
import { Inject, Service } from 'typedi';
import { ISaleEstimateDTO } from 'interfaces';
import BaseController from 'api/controllers/BaseController';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import SaleEstimateService from 'services/Sales/SalesEstimate';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import { ServiceError } from 'exceptions';

@Service()
export default class SalesEstimatesController extends BaseController {
  @Inject()
  saleEstimateService: SaleEstimateService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      [...this.estimateValidationSchema],
      this.validationResult,
      asyncMiddleware(this.newEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/deliver',
      [...this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.deliverSaleEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/approve',
      [this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.approveSaleEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id/reject',
      [this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.rejectSaleEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
      [
        ...this.validateSpecificEstimateSchema,
        ...this.estimateValidationSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      [this.validateSpecificEstimateSchema],
      this.validationResult,
      asyncMiddleware(this.deleteEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      this.validateSpecificEstimateSchema,
      this.validationResult,
      asyncMiddleware(this.getEstimate.bind(this)),
      this.handleServiceErrors
    );
    router.get(
      '/',
      this.validateEstimateListSchema,
      this.validationResult,
      asyncMiddleware(this.getEstimates.bind(this)),
      this.handleServiceErrors,
      this.dynamicListService.handlerErrorsToResponse
    );
    return router;
  }

  /**
   * Estimate validation schema.
   */
  get estimateValidationSchema() {
    return [
      check('customer_id').exists().isNumeric().toInt(),
      check('estimate_date').exists().isISO8601(),
      check('expiration_date').optional().isISO8601(),
      check('reference').optional(),
      check('estimate_number').optional().trim().escape(),
      check('delivered').default(false).isBoolean().toBoolean(),

      check('entries').exists().isArray({ min: 1 }),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.item_id').exists().isNumeric().toInt(),
      check('entries.*.quantity').exists().isNumeric().toInt(),
      check('entries.*.rate').exists().isNumeric().toFloat(),
      check('entries.*.description')
        .optional({ nullable: true })
        .trim()
        .escape(),
      check('entries.*.discount')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),

      check('note').optional().trim().escape(),
      check('terms_conditions').optional().trim().escape(),
      check('send_to_email').optional().trim().escape(),
    ];
  }

  /**
   * Specific sale estimate validation schema.
   */
  get validateSpecificEstimateSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Sales estimates list validation schema.
   */
  get validateEstimateListSchema() {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Handle create a new estimate with associated entries.
   * @param {Request} req -
   * @param {Response} res -
   * @return {Response} res -
   */
  async newEstimate(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const estimateDTO: ISaleEstimateDTO = this.matchedBodyData(req);

    try {
      const storedEstimate = await this.saleEstimateService.createEstimate(
        tenantId,
        estimateDTO
      );

      return res.status(200).send({
        id: storedEstimate.id,
        message: 'The sale estimate has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle update estimate details with associated entries.
   * @param {Request} req
   * @param {Response} res
   */
  async editEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;
    const estimateDTO: ISaleEstimateDTO = this.matchedBodyData(req);

    try {
      // Update estimate with associated estimate entries.
      await this.saleEstimateService.editEstimate(
        tenantId,
        estimateId,
        estimateDTO
      );

      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given estimate with associated entries.
   * @param {Request} req
   * @param {Response} res
   */
  async deleteEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimateService.deleteEstimate(tenantId, estimateId);

      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deliver the given sale estimate.
   * @param {Request} req
   * @param {Response} res
   */
  async deliverSaleEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimateService.deliverSaleEstimate(tenantId, estimateId);

      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been delivered successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks the sale estimate as approved.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async approveSaleEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimateService.approveSaleEstimate(tenantId, estimateId);

      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been approved successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marks the sale estimate as rejected.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async rejectSaleEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      await this.saleEstimateService.rejectSaleEstimate(tenantId, estimateId);

      return res.status(200).send({
        id: estimateId,
        message: 'The sale estimate has been rejected successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the given estimate with associated entries.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getEstimate(req: Request, res: Response, next: NextFunction) {
    const { id: estimateId } = req.params;
    const { tenantId } = req;

    try {
      const estimate = await this.saleEstimateService.getEstimate(
        tenantId,
        estimateId
      );

      return res.status(200).send({ estimate });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve estimates with pagination metadata.
   * @param {Request} req
   * @param {Response} res
   */
  async getEstimates(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { salesEstimates, pagination, filterMeta } =
        await this.saleEstimateService.estimatesList(tenantId, filter);

      return res.status(200).send({
        sales_estimates: this.transfromToResponse(salesEstimates),
        pagination,
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'ITEMS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 100 }],
        });
      }
      if (error.errorType === 'ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ENTRIES.IDS.NOT.EXISTS', code: 200 }],
        });
      }
      if (error.errorType === 'ITEMS_IDS_NOT_EXISTS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ITEMS.IDS.NOT.EXISTS', code: 300 }],
        });
      }
      if (error.errorType === 'NOT_PURCHASE_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_PURCHASABLE_ITEMS', code: 400 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_NOT_FOUND', code: 500 }],
        });
      }
      if (error.errorType === 'CUSTOMER_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 600 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NUMBER_EXISTANCE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ESTIMATE.NUMBER.IS.NOT.UNQIUE', code: 700 }],
        });
      }
      if (error.errorType === 'NOT_SELL_ABLE_ITEMS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_SELL_ABLE_ITEMS', code: 800 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_ALREADY_APPROVED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 900 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_ALREADY_APPROVED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 1000 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NOT_DELIVERED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_NOT_DELIVERED', code: 1100 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_ALREADY_REJECTED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_ALREADY_REJECTED', code: 1200 }],
        });
      }
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_NOT_FOUND', code: 1300 }],
        });
      }
      if (error.errorType === 'SALE_ESTIMATE_NO_IS_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SALE_ESTIMATE_NO_IS_REQUIRED', code: 1400 }],
        });
      }
    }
    next(error);
  }
}
