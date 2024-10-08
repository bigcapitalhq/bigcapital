import { Inject, Service } from 'typedi';
import moment from 'moment-timezone';
import { Router, Request, Response, NextFunction } from 'express';
import { check, ValidationChain } from 'express-validator';

import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import JWTAuth from '@/api/middleware/jwtAuth';
import TenancyMiddleware from '@/api/middleware/TenancyMiddleware';
import SubscriptionMiddleware from '@/api/middleware/SubscriptionMiddleware';
import AttachCurrentTenantUser from '@/api/middleware/AttachCurrentTenantUser';
import OrganizationService from '@/services/Organization/OrganizationService';
import { MONTHS, ACCEPTED_LOCALES } from '@/services/Organization/constants';
import { DATE_FORMATS } from '@/services/Miscellaneous/DateFormats/constants';

import { ServiceError } from '@/exceptions';
import BaseController from '@/api/controllers/BaseController';

@Service()
export default class OrganizationController extends BaseController {
  @Inject()
  private organizationService: OrganizationService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    // Should before build tenant database the user be authorized and
    // most important than that, should be subscribed to any plan.
    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);

    router.use('/build', SubscriptionMiddleware('main'));
    router.post(
      '/build',
      this.buildOrganizationValidationSchema,
      this.validationResult,
      asyncMiddleware(this.build.bind(this)),
      this.handleServiceErrors.bind(this)
    );
    router.put(
      '/',
      this.updateOrganizationValidationSchema,
      this.validationResult,
      this.asyncMiddleware(this.updateOrganization.bind(this)),
      this.handleServiceErrors.bind(this)
    );
    router.get(
      '/',
      asyncMiddleware(this.currentOrganization.bind(this)),
      this.handleServiceErrors.bind(this)
    );
    return router;
  }

  /**
   * Build organization validation schema.
   * @returns {ValidationChain[]}
   */
  private get buildOrganizationValidationSchema(): ValidationChain[] {
    return [
      check('name').exists().trim(),
      check('industry').optional({ nullable: true }).isString().trim(),
      check('location').exists().isString().isISO31661Alpha2(),
      check('base_currency').exists().isISO4217(),
      check('timezone').exists().isIn(moment.tz.names()),
      check('fiscal_year').exists().isIn(MONTHS),
      check('language').exists().isString().isIn(ACCEPTED_LOCALES),
      check('date_format').optional().isIn(DATE_FORMATS),
    ];
  }

  /**
   * Update organization validation schema.
   * @returns {ValidationChain[]}
   */
  private get updateOrganizationValidationSchema(): ValidationChain[] {
    return [
      // # Profile
      check('name').optional().trim(),
      check('industry').optional({ nullable: true }).isString().trim(),
      check('location').optional().isString().isISO31661Alpha2(),
      check('base_currency').optional().isISO4217(),
      check('timezone').optional().isIn(moment.tz.names()),
      check('fiscal_year').optional().isIn(MONTHS),
      check('language').optional().isString().isIn(ACCEPTED_LOCALES),
      check('date_format').optional().isIn(DATE_FORMATS),

      // # Address
      check('address.address_1').optional().isString().trim(),
      check('address.address_2').optional().isString().trim(),
      check('address.postal_code').optional().isString().trim(),
      check('address.city').optional().isString().trim(),
      check('address.state_province').optional().isString().trim(),
      check('address.phone').optional().isString().trim(),

      // # Branding
      check('primary_color').optional({ nullable: true }).isHexColor().trim(),
      check('logo_key').optional({ nullable: true }).isString().trim(),

      check('tax_number').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Builds tenant database and migrate database schema.
   * @param {Request} req - Express request.
   * @param {Response} res - Express response.
   * @param {NextFunction} next
   */
  private async build(req: Request, res: Response, next: Function) {
    const { tenantId, user } = req;
    const buildDTO = this.matchedBodyData(req);

    try {
      const result = await this.organizationService.buildRunJob(
        tenantId,
        buildDTO,
        user
      );
      return res.status(200).send({
        type: 'success',
        code: 'ORGANIZATION.DATABASE.INITIALIZED',
        message: 'The organization database has been initialized.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the current organization of the associated authenticated user.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async currentOrganization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;

    try {
      const organization = await this.organizationService.currentOrganization(
        tenantId
      );
      return res.status(200).send({
        organization: this.transfromToResponse(organization),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the organization information.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private async updateOrganization(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const tenantDTO = this.matchedBodyData(req, { includeOptionals: false });

    try {
      await this.organizationService.updateOrganization(tenantId, tenantDTO);

      return res.status(200).send(
        this.transfromToResponse({
          tenantId,
          message: 'Organization information has been updated successfully.',
        })
      );
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
      if (error.errorType === 'tenant_not_found') {
        return res.status(400).send({
          errors: [{ type: 'TENANT.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'TENANT_ALREADY_BUILT') {
        return res.status(400).send({
          errors: [{ type: 'TENANT_ALREADY_BUILT', code: 200 }],
        });
      }
      if (error.errorType === 'TENANT_IS_BUILDING') {
        return res.status(400).send({
          errors: [{ type: 'TENANT_IS_BUILDING', code: 300 }],
        });
      }
      if (error.errorType === 'BASE_CURRENCY_MUTATE_LOCKED') {
        return res.status(400).send({
          errors: [{ type: 'BASE_CURRENCY_MUTATE_LOCKED', code: 400 }],
        });
      }
    }
    next(error);
  }
}
