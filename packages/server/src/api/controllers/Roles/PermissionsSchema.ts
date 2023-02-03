import { Router, Request, Response, NextFunction } from 'express';
import RolePermissionsSchema from '@/services/Roles/RolePermissionsSchema';
import { Service, Inject } from 'typedi';
import BaseController from '../BaseController';

@Service()
export default class RolePermissionsSchemaController extends BaseController {
  @Inject()
  rolePermissionSchema: RolePermissionsSchema;

  router() {
    const router = Router();

    router.get('/permissions/schema', this.getPermissionsSchema);

    return router;
  }

  /**
   * Retrieve the role permissions schema.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private getPermissionsSchema = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      const permissionsSchema =
        this.rolePermissionSchema.getRolePermissionsSchema(tenantId);

      return res.status(200).send({ data: permissionsSchema });
    } catch (error) {
      next(error);
    }
  };
}
