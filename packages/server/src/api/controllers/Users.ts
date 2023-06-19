import { Router, Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check, query, param } from 'express-validator';
import JWTAuth from '@/api/middleware/jwtAuth';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import BaseController from '@/api/controllers/BaseController';
import UsersService from '@/services/Users/UsersService';
import TenancyMiddleware from '@/api/middleware/TenancyMiddleware';
import AttachCurrentTenantUser from '@/api/middleware/AttachCurrentTenantUser';
import { ServiceError, ServiceErrors } from '@/exceptions';
import { IEditUserDTO, ISystemUserDTO } from '@/interfaces';

@Service()
export default class UsersController extends BaseController {
  @Inject()
  usersService: UsersService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use(JWTAuth);
    router.use(AttachCurrentTenantUser);
    router.use(TenancyMiddleware);

    router.put(
      '/:id/inactivate',
      [...this.specificUserSchema],
      this.validationResult,
      asyncMiddleware(this.inactivateUser.bind(this)),
      this.catchServiceErrors
    );
    router.put(
      '/:id/activate',
      [...this.specificUserSchema],
      this.validationResult,
      asyncMiddleware(this.activateUser.bind(this)),
      this.catchServiceErrors
    );
    router.post(
      '/:id',
      [
        param('id').exists().isNumeric().toInt(),

        check('first_name').exists(),
        check('last_name').exists(),
        check('email').exists().isEmail(),
        check('role_id').exists().isNumeric().toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.editUser.bind(this)),
      this.catchServiceErrors
    );
    router.get(
      '/',
      this.listUsersSchema,
      this.validationResult,
      asyncMiddleware(this.listUsers.bind(this))
    );
    router.get(
      '/:id',
      [...this.specificUserSchema],
      this.validationResult,
      asyncMiddleware(this.getUser.bind(this)),
      this.catchServiceErrors
    );
    router.delete(
      '/:id',
      [...this.specificUserSchema],
      this.validationResult,
      asyncMiddleware(this.deleteUser.bind(this)),
      this.catchServiceErrors
    );
    return router;
  }

  /**
   * User DTO Schema.
   */
  get userDTOSchema() {
    return [];
  }

  get specificUserSchema() {
    return [param('id').exists().isNumeric().toInt()];
  }

  get listUsersSchema() {
    return [
      query('page_size').optional().isNumeric().toInt(),
      query('page').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Edit details of the given user.
   * @param {Request} req
   * @param {Response} res
   * @return {Response|void}
   */
  async editUser(req: Request, res: Response, next: NextFunction) {
    const editUserDTO: IEditUserDTO = this.matchedBodyData(req);
    const { tenantId, user: authorizedUser } = req;
    const { id: userId } = req.params;

    try {
      await this.usersService.editUser(
        tenantId,
        userId,
        editUserDTO,
        authorizedUser
      );
      return res.status(200).send({
        id: userId,
        message: 'The user has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Soft deleting the given user.
   * @param {Request} req
   * @param {Response} res
   * @return {Response|void}
   */
  async deleteUser(req: Request, res: Response, next: Function) {
    const { id } = req.params;
    const { tenantId } = req;

    try {
      await this.usersService.deleteUser(tenantId, id);

      return res.status(200).send({
        id,
        message: 'The user has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve user details of the given user id.
   * @param {Request} req
   * @param {Response} res
   * @return {Response|void}
   */
  async getUser(req: Request, res: Response, next: NextFunction) {
    const { id: userId } = req.params;
    const { tenantId } = req;

    try {
      const user = await this.usersService.getUser(tenantId, userId);
      return res.status(200).send({ user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the list of users.
   * @param {Request} req
   * @param {Response} res
   * @return {Response|void}
   */
  async listUsers(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    try {
      const users = await this.usersService.getList(tenantId);

      return res.status(200).send({ users });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate the given user.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async activateUser(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: userId } = req.params;

    try {
      await this.usersService.activateUser(tenantId, userId, user);

      return res.status(200).send({
        id: userId,
        message: 'The user has been activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inactivate the given user.
   * @param {Request} req
   * @param {Response} res
   * @return {Response|void}
   */
  async inactivateUser(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: userId } = req.params;

    try {
      await this.usersService.inactivateUser(tenantId, userId, user);

      return res.status(200).send({
        id: userId,
        message: 'The user has been inactivated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Catches all users service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  catchServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'USER_NOT_FOUND') {
        return res.boom.badRequest('User not found.', {
          errors: [{ type: 'USER.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'USER_ALREADY_ACTIVE') {
        return res.boom.badRequest('User is already active.', {
          errors: [{ type: 'USER.ALREADY.ACTIVE', code: 200 }],
        });
      }
      if (error.errorType === 'USER_ALREADY_INACTIVE') {
        return res.boom.badRequest('User is already inactive.', {
          errors: [{ type: 'USER.ALREADY.INACTIVE', code: 200 }],
        });
      }
      if (error.errorType === 'USER_SAME_THE_AUTHORIZED_USER') {
        return res.boom.badRequest(
          'You could not activate/inactivate the same authorized user.',
          {
            errors: [
              { type: 'CANNOT.TOGGLE.ACTIVATE.AUTHORIZED.USER', code: 300 },
            ],
          }
        );
      }
      if (error.errorType === 'CANNOT_DELETE_LAST_USER') {
        return res.boom.badRequest(
          'Cannot delete last user in the organization.',
          { errors: [{ type: 'CANNOT_DELETE_LAST_USER', code: 400 }] }
        );
      }
      if (error.errorType === 'EMAIL_ALREADY_EXISTS') {
        return res.boom.badRequest('Exmail is already exists.', {
          errors: [{ type: 'EMAIL_ALREADY_EXISTS', code: 500 }],
        });
      }
      if (error.errorType === 'PHONE_NUMBER_ALREADY_EXIST') {
        return res.boom.badRequest('Phone number is already exists.', {
          errors: [{ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 600 }],
        });
      }
      if (error.errorType === 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE') {
        return res.boom.badRequest('Cannot mutate authorized user role.', {
          errors: [{ type: 'CANNOT_AUTHORIZED_USER_MUTATE_ROLE', code: 700 }],
        });
      }
    }
    next(error);
  }
}
