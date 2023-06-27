import { Router, Request, Response, NextFunction } from 'express';
import { check, param, query, ValidationChain } from 'express-validator';
import BaseController from '../BaseController';
import { Service, Inject } from 'typedi';
import { ServiceError } from '@/exceptions';
import RolesService from '@/services/Roles/RolesService';

@Service()
export default class RolesController extends BaseController {
  @Inject()
  rolesService: RolesService;

  router() {
    const router = Router();

    router.post(
      '/',
      [
        check('role_name').exists().trim(),
        check('role_description').optional(),
        check('permissions').exists().isArray({ min: 1 }),
        check('permissions.*.subject').exists().trim(),
        check('permissions.*.ability').exists().trim(),
        check('permissions.*.value').exists().isBoolean().toBoolean(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.createRole),
      this.handleServiceErrors
    );
    router.post(
      '/:id',
      [
        check('role_name').exists().trim(),
        check('role_description').optional(),
        check('permissions').isArray({ min: 1 }),
        check('permissions.*.permission_id'),
        check('permissions.*.subject').exists().trim(),
        check('permissions.*.ability').exists().trim(),
        check('permissions.*.value').exists().isBoolean().toBoolean(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.editRole),
      this.handleServiceErrors
    );
    router.delete(
      '/:id',
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteRole),
      this.handleServiceErrors
    );
    router.get(
      '/:id',
      [param('id').exists().isInt().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getRole),
      this.handleServiceErrors
    );
    router.get(
      '/',
      [],
      this.validationResult,
      this.asyncMiddleware(this.listRoles),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Creates a new role on the authenticated tenant.
   * @param req
   * @param res
   * @param next
   */
  private createRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const newRoleDTO = this.matchedBodyData(req);

    try {
      const role = await this.rolesService.createRole(tenantId, newRoleDTO);

      return res.status(200).send({
        data: { roleId: role.id },
        message: 'The role has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes the given role from the storage.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: roleId } = req.params;

    try {
      const role = await this.rolesService.deleteRole(tenantId, roleId);

      return res.status(200).send({
        data: { roleId },
        message: 'The given role has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Edits the given role details on the storage.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private editRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: roleId } = req.params;
    const editRoleDTO = this.matchedBodyData(req);

    try {
      const role = await this.rolesService.editRole(tenantId, roleId, editRoleDTO);

      return res.status(200).send({
        data: { roleId },
        message: 'The given role has been updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the roles list.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private listRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;

    try {
      const roles = await this.rolesService.listRoles(tenantId);

      return res.status(200).send({
        roles,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve the specific role details.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private getRole = async (req: Request, res: Response, next: NextFunction) => {
    const { tenantId } = req;
    const { id: roleId } = req.params;

    try {
      const role = await this.rolesService.getRole(tenantId, roleId);

      return res.status(200).send({
        role,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles the service errors.
   * @param error
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private handleServiceErrors = (
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (error instanceof ServiceError) {
      if (error.errorType === 'ROLE_PREDEFINED') {
        return res.status(400).send({
          errors: [
            {
              type: 'ROLE_PREDEFINED',
              message: 'Role is predefined, you cannot modify predefined roles',
              code: 100,
            },
          ],
        });
      }
      if (error.errorType === 'ROLE_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'ROLE_NOT_FOUND',
              message: 'Role is not found',
              code: 200,
            },
          ],
        });
      }
      if (error.errorType === 'INVALIDATE_PERMISSIONS') {
        return res.status(400).send({
          errors: [
            {
              type: 'INVALIDATE_PERMISSIONS',
              message: 'The submit role has invalid permissions.',
              code: 300,
            },
          ],
        });
      }
      if (error.errorType === 'CANNOT_DELETE_ROLE_ASSOCIATED_TO_USERS') {
        return res.status(400).send({
          errors: [
            {
              type: 'CANNOT_DELETE_ROLE_ASSOCIATED_TO_USERS',
              message: 'Cannot delete role associated to users.',
              code: 400
            },
          ],
        });
      }
      next(error);
    }
  };
}
