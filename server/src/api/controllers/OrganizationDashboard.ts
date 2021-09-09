import { Inject, Service } from 'typedi';
import { Request, Response, Router } from 'express';
import BaseController from 'api/controllers/BaseController';
import OrganizationService from 'services/Organization';

@Service()
export default class OrganizationDashboardController extends BaseController {
  @Inject()
  organizationService: OrganizationService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/base_currency_mutate',
      this.baseCurrencyMutateAbility.bind(this)
    );
    return router;
  }

  private async baseCurrencyMutateAbility(
    req: Request,
    res: Response,
    next: Function
  ) {
    const { tenantId } = req;

    try {
      const abilities =
        await this.organizationService.mutateBaseCurrencyAbility(tenantId);

      return res.status(200).send({ abilities });
    } catch (error) {
      next(error);
    }
  }
}
