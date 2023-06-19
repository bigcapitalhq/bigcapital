import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { check, body, param } from 'express-validator';
import { IInviteUserInput } from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { ServiceError } from '@/exceptions';
import BaseController from './BaseController';
import InviteTenantUserService from '@/services/InviteUsers/TenantInviteUser';
import AcceptInviteUserService from '@/services/InviteUsers/AcceptInviteUser';

@Service()
export default class InviteUsersController extends BaseController {
  @Inject()
  private inviteUsersService: InviteTenantUserService;

  @Inject()
  private acceptInviteService: AcceptInviteUserService;

  /**
   * Routes that require authentication.
   */
  authRouter() {
    const router = Router();

    router.post(
      '/send',
      [
        body('email').exists().trim().escape(),
        body('role_id').exists().isNumeric().toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.sendInvite.bind(this)),
      this.handleServicesError
    );
    router.post(
      '/resend/:userId',
      [param('userId').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.resendInvite.bind(this)),
      this.handleServicesError
    );
    return router;
  }

  /**
   * Routes that non-required authentication.
   */
  nonAuthRouter() {
    const router = Router();

    router.post(
      '/accept/:token',
      [...this.inviteUserDTO],
      this.validationResult,
      asyncMiddleware(this.accept.bind(this)),
      this.handleServicesError
    );
    router.get(
      '/invited/:token',
      [param('token').exists().trim().escape()],
      this.validationResult,
      asyncMiddleware(this.invited.bind(this)),
      this.handleServicesError
    );

    return router;
  }

  /**
   * Invite DTO schema validation.
   * @returns {ValidationChain[]}
   */
  private get inviteUserDTO() {
    return [
      check('first_name').exists().trim().escape(),
      check('last_name').exists().trim().escape(),
      check('password').exists().trim().escape().isLength({ min: 5 }),
      param('token').exists().trim().escape(),
    ];
  }

  /**
   * Invite a user to the authorized user organization.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - Next function.
   */
  private async sendInvite(req: Request, res: Response, next: Function) {
    const sendInviteDTO = this.matchedBodyData(req);
    const { tenantId } = req;
    const { user } = req;

    try {
      await this.inviteUsersService.sendInvite(tenantId, sendInviteDTO, user);

      return res.status(200).send({
        type: 'success',
        code: 'INVITE.SENT.SUCCESSFULLY',
        message: 'The invite has been sent to the given email.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Resend the user invite.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - Next function.
   */
  private async resendInvite(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { userId } = req.params;

    try {
      await this.inviteUsersService.resendInvite(tenantId, userId, user);

      return res.status(200).send({
        type: 'success',
        code: 'INVITE.RESEND.SUCCESSFULLY',
        message: 'The invite has been sent to the given email.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Accept the invitation.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async accept(req: Request, res: Response, next: Function) {
    const inviteUserInput: IInviteUserInput = this.matchedBodyData(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const { token } = req.params;

    try {
      await this.acceptInviteService.acceptInvite(token, inviteUserInput);

      return res.status(200).send({
        type: 'success',
        code: 'USER.INVITE.ACCEPTED',
        message: 'User invite has been accepted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if the invite token is valid.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private async invited(req: Request, res: Response, next: Function) {
    const { token } = req.params;

    try {
      const { inviteToken, orgName } =
        await this.acceptInviteService.checkInvite(token);

      return res.status(200).send({
        inviteToken: inviteToken.token,
        email: inviteToken.email,
        organizationName: orgName,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the service error.
   */
  private handleServicesError(
    error,
    req: Request,
    res: Response,
    next: Function
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'EMAIL_EXISTS') {
        return res.status(400).send({
          errors: [
            {
              type: 'EMAIL.ALREADY.EXISTS',
              code: 100,
              message: 'Email already exists in the users.',
            },
          ],
        });
      }
      if (error.errorType === 'EMAIL_ALREADY_INVITED') {
        return res.status(400).send({
          errors: [
            {
              type: 'EMAIL.ALREADY.INVITED',
              code: 200,
              message: 'Email already invited.',
            },
          ],
        });
      }
      if (error.errorType === 'INVITE_TOKEN_INVALID') {
        return res.status(400).send({
          errors: [
            {
              type: 'INVITE.TOKEN.INVALID',
              code: 300,
              message: 'Invite token is invalid, please try another one.',
            },
          ],
        });
      }
      if (error.errorType === 'PHONE_NUMBER_EXISTS') {
        return res.status(400).send({
          errors: [
            {
              type: 'PHONE_NUMBER.EXISTS',
              code: 400,
              message:
                'Phone number is already invited, please try another unique one.',
            },
          ],
        });
      }
      if (error.errorType === 'USER_RECENTLY_INVITED') {
        return res.status(400).send({
          errors: [
            {
              type: 'USER_RECENTLY_INVITED',
              code: 500,
              message:
                'This person was recently invited. No need to invite them again just yet.',
            },
          ],
        });
      }
      if (error.errorType === 'ROLE_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'ROLE_NOT_FOUND',
              code: 600,
              message: 'The given user role is not found.',
            },
          ],
        });
      }
      if (error.errorType === 'USER_NOT_FOUND') {
        return res.status(400).send({
          errors: [
            {
              type: 'USER_NOT_FOUND',
              code: 700,
              message: 'The given user is not found.',
            },
          ],
        });
      }
    }
    next(error);
  }
}
