import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import {
  check,
  body,
  param,
} from 'express-validator';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import InviteUserService from 'services/InviteUsers';
import { ServiceErrors, ServiceError } from 'exceptions';
import BaseController from './BaseController';

@Service()
export default class InviteUsersController extends BaseController {
  @Inject()
  inviteUsersService: InviteUserService;

  /**
   * Routes that require authentication.
   */
  authRouter() {
    const router = Router();

    router.post('/send', [
        body('email').exists().trim().escape(),        
      ],
      this.validationResult,
      asyncMiddleware(this.sendInvite.bind(this)),
    );
    return router;
  }

  /**
   * Routes that non-required authentication.
   */
  nonAuthRouter() {
    const router = Router();

    router.post('/accept/:token', [
        ...this.inviteUserDTO,
      ],
      this.validationResult,
      asyncMiddleware(this.accept.bind(this))
    );
    router.get('/invited/:token', [
        param('token').exists().trim().escape(),
      ],
      this.validationResult,
      asyncMiddleware(this.invited.bind(this))
    );

    return router;
  }

  /**
   * Invite DTO schema validation.
   */
  get inviteUserDTO() {
    return [
      check('first_name').exists().trim().escape(),
      check('last_name').exists().trim().escape(),
      check('phone_number').exists().trim().escape(),
      check('password').exists().trim().escape(),
      param('token').exists().trim().escape(),
    ];
  }

  /**
   * Invite a user to the authorized user organization.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next - 
   */
  async sendInvite(req: Request, res: Response, next: Function) {
    const { email } = req.body;
    const { tenantId } = req;
    const { user } = req;

    try {
      await this.inviteUsersService.sendInvite(tenantId, email, user);
      return res.status(200).send({
        type: 'success',
        code: 'INVITE.SENT.SUCCESSFULLY',
        message: 'The invite has been sent to the given email.',
      })
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.errorType === 'email_already_invited') {
          return res.status(400).send({
            errors: [{ type: 'EMAIL.ALREADY.INVITED' }],
          });
        }
      }
      next(error);
    }
    return res.status(200).send();
  }

  /**
   * Accept the inviation.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next - 
   */
  async accept(req: Request, res: Response, next: Function) {
    const inviteUserInput: IInviteUserInput = this.matchedBodyData(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const { token } = req.params;

    try {
      await this.inviteUsersService.acceptInvite(token, inviteUserInput);
      return res.status(200).send({
        type: 'success',
        code: 'USER.INVITE.ACCEPTED',
        message: 'User invite has been accepted successfully.',
      });
    } catch (error) {
      
      if (error instanceof ServiceError) {

        if (error.errorType === 'phone_number_exists') {
          return res.status(400).send({
            errors: [{ type: 'PHONE_NUMBER.EXISTS' }],
          });
        }
        if (error.errorType === 'invite_token_invalid') {
          return res.status(400).send({
            errors: [{ type: 'INVITE.TOKEN.INVALID' }],
          });
        }
      }
      next(error);
    }
  }

  /**
   * Check if the invite token is valid.
   * @param {Request} req - 
   * @param {Response} res - 
   * @param {NextFunction} next -  
   */
  async invited(req: Request, res: Response, next: Function) {
    const { token } = req.params;

    try {
      const { inviteToken, orgName } = await this.inviteUsersService.checkInvite(token);

      return res.status(200).send({
        inviteToken: inviteToken.token,
        email: inviteToken.email,
        organizationName: orgName?.value,
      });
    } catch (error) {

      if (error instanceof ServiceError) {
        if (error.errorType === 'invite_token_invalid') {
          return res.status(400).send({
            errors: [{ type: 'INVITE.TOKEN.INVALID' }],
          });
        }
      }
      next(error);
    }
  }
}