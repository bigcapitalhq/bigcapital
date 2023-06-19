import { Request, Response, Router } from 'express';
import { check, ValidationChain } from 'express-validator';
import { Service, Inject } from 'typedi';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import { ILoginDTO, ISystemUser, IRegisterDTO } from '@/interfaces';
import { ServiceError, ServiceErrors } from '@/exceptions';
import { DATATYPES_LENGTH } from '@/data/DataTypes';
import LoginThrottlerMiddleware from '@/api/middleware/LoginThrottlerMiddleware';
import AuthenticationApplication from '@/services/Authentication/AuthApplication';

@Service()
export default class AuthenticationController extends BaseController {
  @Inject()
  private authApplication: AuthenticationApplication;

  /**
   * Constructor method.
   */
  public router() {
    const router = Router();

    router.post(
      '/login',
      this.loginSchema,
      this.validationResult,
      LoginThrottlerMiddleware,
      asyncMiddleware(this.login.bind(this)),
      this.handlerErrors
    );
    router.post(
      '/register',
      this.registerSchema,
      this.validationResult,
      asyncMiddleware(this.register.bind(this)),
      this.handlerErrors
    );
    router.post(
      '/send_reset_password',
      this.sendResetPasswordSchema,
      this.validationResult,
      asyncMiddleware(this.sendResetPassword.bind(this)),
      this.handlerErrors
    );
    router.post(
      '/reset/:token',
      this.resetPasswordSchema,
      this.validationResult,
      asyncMiddleware(this.resetPassword.bind(this)),
      this.handlerErrors
    );
    router.get('/meta', asyncMiddleware(this.getAuthMeta.bind(this)));
    return router;
  }

  /**
   * Login validation schema.
   * @returns {ValidationChain[]}
   */
  private get loginSchema(): ValidationChain[] {
    return [
      check('credential').exists().isEmail(),
      check('password').exists().isLength({ min: 5 }),
    ];
  }

  /**
   * Register validation schema.
   * @returns {ValidationChain[]}
   */
  private get registerSchema(): ValidationChain[] {
    return [
      check('first_name')
        .exists()
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('last_name')
        .exists()
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('email')
        .exists()
        .isString()
        .isEmail()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('password')
        .exists()
        .isString()
        .isLength({ min: 6 })
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
    ];
  }

  /**
   * Reset password schema.
   * @returns {ValidationChain[]}
   */
  private get resetPasswordSchema(): ValidationChain[] {
    return [
      check('password')
        .exists()
        .isLength({ min: 6 })
        .custom((value, { req }) => {
          if (value !== req.body.confirm_password) {
            throw new Error("Passwords don't match");
          } else {
            return value;
          }
        }),
    ];
  }

  /**
   * Send reset password validation schema.
   * @returns {ValidationChain[]}
   */
  private get sendResetPasswordSchema(): ValidationChain[] {
    return [check('email').exists().isEmail().trim().escape()];
  }

  /**
   * Handle user login.
   * @param {Request} req
   * @param {Response} res
   */
  private async login(req: Request, res: Response, next: Function): Response {
    const userDTO: ILoginDTO = this.matchedBodyData(req);

    try {
      const { token, user, tenant } = await this.authApplication.signIn(
        userDTO.credential,
        userDTO.password
      );
      return res.status(200).send({ token, user, tenant });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Organization register handler.
   * @param {Request} req
   * @param {Response} res
   */
  private async register(req: Request, res: Response, next: Function) {
    const registerDTO: IRegisterDTO = this.matchedBodyData(req);

    try {
      await this.authApplication.signUp(registerDTO);

      return res.status(200).send({
        type: 'success',
        code: 'REGISTER.SUCCESS',
        message: 'Register organization has been success.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Send reset password handler
   * @param {Request} req
   * @param {Response} res
   */
  private async sendResetPassword(req: Request, res: Response, next: Function) {
    const { email } = this.matchedBodyData(req);

    try {
      await this.authApplication.sendResetPassword(email);

      return res.status(200).send({
        code: 'SEND_RESET_PASSWORD_SUCCESS',
        message: 'The reset password message has been sent successfully.',
      });
    } catch (error) {
      if (error instanceof ServiceError) {
      }
      next(error);
    }
  }

  /**
   * Reset password handler
   * @param {Request} req
   * @param {Response} res
   */
  private async resetPassword(req: Request, res: Response, next: Function) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      await this.authApplication.resetPassword(token, password);

      return res.status(200).send({
        type: 'RESET_PASSWORD_SUCCESS',
        message: 'The password has been reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the authentication meta for SPA.
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   * @returns {Response|void}
   */
  private async getAuthMeta(req: Request, res: Response, next: Function) {
    try {
      const meta = await this.authApplication.getAuthMeta();

      return res.status(200).send({ meta });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the service errors.
   */
  private handlerErrors(error, req: Request, res: Response, next: Function) {
    if (error instanceof ServiceError) {
      if (
        ['INVALID_DETAILS', 'invalid_password'].indexOf(error.errorType) !== -1
      ) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_DETAILS', code: 100 }],
        });
      }
      if (error.errorType === 'USER_INACTIVE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'USER_INACTIVE', code: 200 }],
        });
      }
      if (
        error.errorType === 'TOKEN_INVALID' ||
        error.errorType === 'TOKEN_EXPIRED'
      ) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'TOKEN_INVALID', code: 300 }],
        });
      }
      if (error.errorType === 'USER_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'USER_NOT_FOUND', code: 400 }],
        });
      }
      if (error.errorType === 'EMAIL_NOT_FOUND') {
        return res.status(400).send({
          errors: [{ type: 'EMAIL.NOT.REGISTERED', code: 500 }],
        });
      }
      if (error.errorType === 'EMAIL_EXISTS') {
        return res.status(400).send({
          errors: [{ type: 'EMAIL.EXISTS', code: 600 }],
        });
      }
      if (error.errorType === 'SIGNUP_RESTRICTED') {
        return res.status(400).send({
          errors: [
            {
              type: 'SIGNUP_RESTRICTED',
              message:
                'Sign-up is restricted no one can sign-up to the system.',
              code: 700,
            },
          ],
        });
      }
      if (error.errorType === 'SIGNUP_RESTRICTED_NOT_ALLOWED') {
        return res.status(400).send({
          errors: [
            {
              type: 'SIGNUP_RESTRICTED_NOT_ALLOWED',
              message:
                'Sign-up is restricted the given email address is not allowed to sign-up.',
              code: 710,
            },
          ],
        });
      }
    }
    next(error);
  }
}
