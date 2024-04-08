import DashboardService from '@/services/Dashboard/DashboardService';
import { type NextFunction, type Request, type Response, Router } from 'express';
import { Inject, Service } from 'typedi';

@Service()
export default class DashboardMetaController {
  @Inject()
  dashboardService: DashboardService;

  /**
   *
   * @returns
   */
  router() {
    const router = Router();

    router.get('/boot', this.getDashboardBoot);

    return router;
  }

  /**
   * Retrieve the dashboard boot meta.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  getDashboardBoot = async (req: Request, res: Response, next: NextFunction) => {
    const authorizedUser = req.user;
    const { tenantId } = req;

    try {
      const meta = await this.dashboardService.getBootMeta(tenantId, authorizedUser);

      return res.status(200).send({ meta });
    } catch (error) {
      next(error);
    }
  };
}
