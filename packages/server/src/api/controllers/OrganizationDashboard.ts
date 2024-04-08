import BaseController from '@/api/controllers/BaseController';
import { type NextFunction, type Request, type Response, Router } from 'express';
import { Inject, Service } from 'typedi';
import { ServiceError } from '../../exceptions';
import OrganizationService from '../../services/Organization/OrganizationService';
import OrganizationUpgrade from '../../services/Organization/OrganizationUpgrade';

@Service()
export default class OrganizationDashboardController extends BaseController {
  @Inject()
  organizationService: OrganizationService;

  @Inject()
  organizationUpgrade: OrganizationUpgrade;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get('/base_currency_mutate', this.baseCurrencyMutateAbility.bind(this));
    router.post(
      '/upgrade',
      this.validationResult,
      this.asyncMiddleware(this.upgradeOrganization),
      this.handleServiceErrors,
    );
    return router;
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  private async baseCurrencyMutateAbility(req: Request, res: Response, next: Function) {
    const { tenantId } = req;

    try {
      const abilities = await this.organizationService.mutateBaseCurrencyAbility(tenantId);

      return res.status(200).send({ abilities });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upgrade the authenticated organization.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   * @returns {Response}
   */
  public upgradeOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const { tenantId } = req;

    try {
      // Upgrade organization database.
      const { jobId } = await this.organizationUpgrade.upgrade(tenantId);

      return res.status(200).send({
        job_id: jobId,
        message: 'The organization has been upgraded successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns
   */
  private handleServiceErrors = (error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ServiceError) {
      if (error.errorType === 'TENANT_DATABASE_UPGRADED') {
        return res.status(400).send({
          errors: [
            {
              type: 'TENANT_DATABASE_UPGRADED',
              message: 'Organization database is already upgraded.',
            },
          ],
        });
      }
      if (error.errorType === 'TENANT_UPGRADE_IS_RUNNING') {
        return res.status(200).send({
          errors: [
            {
              type: 'TENANT_UPGRADE_IS_RUNNING',
              message: 'Organization database upgrade is running.',
            },
          ],
        });
      }
    }
    next(error);
  };
}
