import { Request, Response, Router } from 'express';
import { check, ValidationChain } from 'express-validator';
import { Service, Inject } from 'typedi';
import countries from 'country-codes-list';
import parsePhoneNumber from 'libphonenumber-js';
import BaseController from '@/api/controllers/BaseController';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import AuthenticationService from '@/services/Authentication';
import { ILoginDTO, ISystemUser, IRegisterDTO } from '@/interfaces';
import { ServiceError, ServiceErrors } from '@/exceptions';
import { DATATYPES_LENGTH } from '@/data/DataTypes';
import LoginThrottlerMiddleware from '@/api/middleware/LoginThrottlerMiddleware';
import config from '@/config';

@Service()
export default class AuthenticationController extends BaseController {
  @Inject()
  authService: AuthenticationService;

  /**
   * Constructor method.
   */
  router() {
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
    return router;
  }

  /**
   * Login schema.
   */
  get loginSchema(): ValidationChain[] {
    return [
      check('crediential').exists().isEmail(),
      check('password').exists().isLength({ min: 5 }),
    ];
  }

  /**
   * Register schema.
   */
  get registerSchema(): ValidationChain[] {
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
      check('phone_number')
        .exists()
        .isString()
        .trim()
        .escape()
        .custom(this.phoneNumberValidator)
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('password')
        .exists()
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('country')
        .exists()
        .isString()
        .trim()
        .escape()
        .custom(this.countryValidator)
        .isLength({ max: DATATYPES_LENGTH.STRING }),
    ];
  }

  /**
   * Country validator.
   */
  countryValidator(value, { req }) {
    const {
      countries: { whitelist, blacklist },
    } = config.registration;
    const foundCountry = countries.findOne('countryCode', value);

    if (!foundCountry) {
      throw new Error('The country code is invalid.');
    }
    if (
      // Focus with me! In case whitelist is not empty and the given coutry is not
      // in whitelist throw the error.
      //
      // Or in case the blacklist is not empty and the given country exists
      // in the blacklist throw the goddamn error.
      (whitelist.length > 0 && whitelist.indexOf(value) === -1) ||
      (blacklist.length > 0 && blacklist.indexOf(value) !== -1)
    ) {
      throw new Error('The country code is not supported yet.');
    }
    return true;
  }

  /**
   * Phone number validator.
   */
  phoneNumberValidator(value, { req }) {
    const phoneNumber = parsePhoneNumber(value, req.body.country);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Error('Phone number is invalid with the given country code.');
    }
    return true;
  }

  /**
   * Reset password schema.
   */
  get resetPasswordSchema(): ValidationChain[] {
    return [
      check('password')
        .exists()
        .isLength({ min: 5 })
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
   */
  get sendResetPasswordSchema(): ValidationChain[] {
    return [check('email').exists().isEmail().trim().escape()];
  }

  /**
   * Handle user login.
   * @param {Request} req
   * @param {Response} res
   */
  async login(req: Request, res: Response, next: Function): Response {
    const userDTO: ILoginDTO = this.matchedBodyData(req);

    try {
      const { token, user, tenant } = await this.authService.signIn(
        userDTO.crediential,
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
  async register(req: Request, res: Response, next: Function) {
    const registerDTO: IRegisterDTO = this.matchedBodyData(req);

    try {
      const registeredUser: ISystemUser = await this.authService.register(
        registerDTO
      );

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
  async sendResetPassword(req: Request, res: Response, next: Function) {
    const { email } = this.matchedBodyData(req);

    try {
      await this.authService.sendResetPassword(email);

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
  async resetPassword(req: Request, res: Response, next: Function) {
    const { token } = req.params;
    const { password } = req.body;

    try {
      await this.authService.resetPassword(token, password);

      return res.status(200).send({
        type: 'RESET_PASSWORD_SUCCESS',
        message: 'The password has been reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the service errors.
   */
  handlerErrors(error, req: Request, res: Response, next: Function) {
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
    }
    if (error instanceof ServiceErrors) {
      const errorReasons = [];

      if (error.hasType('PHONE_NUMBER_EXISTS')) {
        errorReasons.push({ type: 'PHONE_NUMBER_EXISTS', code: 100 });
      }
      if (error.hasType('EMAIL_EXISTS')) {
        errorReasons.push({ type: 'EMAIL.EXISTS', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
    }
    next(error);
  }
}
