import { Service, Inject } from 'typedi';
import { Router, Request, Response } from 'express';
import {
  check,
  body,
  param,
  matchedData,
} from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import InviteUserService from '@/services/InviteUsers';
import { ServiceErrors, ServiceError } from '@/exceptions';

@Service()
export default class InviteUsersController {
  @Inject()
  inviteUsersService: InviteUserService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.use('/send', jwtAuth);
    router.use('/send', TenancyMiddleware);

    router.post('/send', [
      body('email').exists().trim().escape(),        
    ],
      asyncMiddleware(this.sendInvite),
    );
  
    router.post('/accept/:token', [
      check('first_name').exists().trim().escape(),
      check('last_name').exists().trim().escape(),
      check('phone_number').exists().trim().escape(),
      check('password').exists().trim().escape(),
      param('token').exists().trim().escape(),
    ],
      asyncMiddleware(this.accept)
    );
  
    router.get('/invited/:token', [
      param('token').exists().trim().escape(),
    ],
      asyncMiddleware(this.invited)
    );
    return router;
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
    } catch (error) {
      console.log(error);
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
    const inviteUserInput: IInviteUserInput = matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    });
    const { token } = req.params;

    try {
      await this.inviteUsersService.acceptInvite(token, inviteUserInput);
      return res.status(200).send();
    } catch (error) {
      
      if (error instanceof ServiceErrors) {
        const errorReasons = [];

        if (error.hasType('email_exists')) {
          errorReasons.push({ type: 'EMAIL.EXISTS' });
        }
        if (error.hasType('phone_number_exists')) {
          errorReasons.push({ type: 'PHONE_NUMBER.EXISTS' });
        }
        if (errorReasons.length > 0) {
          return res.status(400).send({ errors: errorReasons });
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
      await this.inviteUsersService.checkInvite(token);

      return res.status(200).send();
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