
import express from 'express';
import { check, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import Mustache from 'mustache';
import jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import uniqid from 'uniqid';
import Logger from '@/services/Logger';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import SystemUser from '@/system/models/SystemUser';
import mail from '@/services/mail';
import { hashPassword } from '@/utils';
import dbManager from '@/database/manager';
import Tenant from '@/system/models/Tenant';
import TenantUser from '@/models/TenantUser';
import TenantsManager from '@/system/TenantsManager';
import TenantModel from '@/models/TenantModel';

export default {
  /**
   * Constructor method.
   */
  router() {
    const router = express.Router();

    router.post('/login',
      this.login.validation,
      asyncMiddleware(this.login.handler));

    router.post('/register',
      this.register.validation,
      asyncMiddleware(this.register.handler));

    router.post('/send_reset_password',
      this.sendResetPassword.validation,
      asyncMiddleware(this.sendResetPassword.handler));

    router.post('/reset/:token',
      this.resetPassword.validation,
      asyncMiddleware(this.resetPassword.handler));

    return router;
  },

  /**
   * User login authentication request.
   */
  login: {
    validation: [
      check('crediential').exists().isEmail(),
      check('password').exists().isLength({ min: 4 }),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const { JWT_SECRET_KEY } = process.env;

      Logger.log('info', 'Someone trying to login.', { form });

      const user = await SystemUser.query()
        .withGraphFetched('tenant')
        .where('email', form.crediential)
        .orWhere('phone_number', form.crediential)
        .first();

      if (!user) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_DETAILS', code: 100 }],
        });
      }
      if (!user.verifyPassword(form.password)) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_DETAILS', code: 100 }],
        });
      }
      if (!user.active) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'USER_INACTIVE', code: 110 }],
        });
      }
      // user.update({ last_login_at: new Date() });

      const token = jwt.sign(
        { email: user.email, _id: user.id },
        JWT_SECRET_KEY,
        { expiresIn: '1d' },
      );
      Logger.log('info', 'Logging success.', { form });

      return res.status(200).send({ token, user });
    },
  },

  /**
   * Registers a new organization.
   */
  register: {
    validation: [
      check('organization_name').exists().trim().escape(),
      check('first_name').exists().trim().escape(),
      check('last_name').exists().trim().escape(),
      check('email').exists().trim().escape(),
      check('phone_number').exists().trim().escape(),
      check('password').exists().trim().escape(),
      check('country').exists().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      Logger.log('info', 'Someone trying to register.', { form });

      const user = await SystemUser.query()
        .where('email', form.email)
        .orWhere('phone_number', form.phone_number)
        .first();

      if (user && user.phoneNumber === form.phone_number) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'PHONE_NUMBER_EXISTS', code: 100 }],
        });
      }
      if (user && user.email === form.email) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'EMAIL_EXISTS', code: 200 }],
        });
      }
      const organizationId = uniqid();
      const tenantOrganization = await Tenant.query().insert({
        organization_id: organizationId,
      });

      const hashedPassword = await hashPassword(form.password);
      const userInsert = {
        ...pick(form, ['first_name', 'last_name', 'email', 'phone_number']),
        password: hashedPassword,
        active: true,
      };
      const registeredUser = await SystemUser.query().insert({
        ...userInsert,
        tenant_id: tenantOrganization.id,
      });
      await dbManager.createDb(`bigcapital_tenant_${organizationId}`);

      const tenantDb = TenantsManager.knexInstance(organizationId);
      await tenantDb.migrate.latest();

      TenantModel.knexBinded = tenantDb;

      await TenantUser.bindKnex(tenantDb).query().insert({
        ...userInsert,
      });
      Logger.log('info', 'New tenant has been created.', { organizationId });

      return res.status(200).send({
        organization_id: organizationId,
      });
    },
  },

  /**
   * Send reset password link via email or SMS.
   */
  sendResetPassword: {
    validation: [
      check('email').exists().isEmail(),
    ],
    // eslint-disable-next-line consistent-return
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { email } = req.body;
      const user = await User.where('email', email).fetch();

      if (!user) {
        return res.status(422).send();
      }
      // Delete all stored tokens of reset password that associate to the give email.
      await PasswordReset.where({ email }).destroy({ require: false });

      const passwordReset = PasswordReset.forge({
        email,
        token: '123123',
      });
      await passwordReset.save();

      const filePath = path.join(__dirname, '../../views/mail/ResetPassword.html');
      const template = fs.readFileSync(filePath, 'utf8');
      const rendered = Mustache.render(template, {
        url: `${req.protocol}://${req.hostname}/reset/${passwordReset.attributes.token}`,
        first_name: user.attributes.first_name,
        last_name: user.attributes.last_name,
        contact_us_email: process.env.CONTACT_US_EMAIL,
      });

      const mailOptions = {
        to: user.attributes.email,
        from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
        subject: 'Ratteb Password Reset',
        html: rendered,
      };

      // eslint-disable-next-line consistent-return
      mail.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(400).send();
        }
        res.status(200).send({ data: { email: passwordReset.attributes.email } });
      });
    },
  },

  /**
   * Reset password.
   */
  resetPassword: {
    validation: [
      check('password').exists().isLength({ min: 5 }).custom((value, { req }) => {
        if (value !== req.body.confirm_password) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'VALIDATION_ERROR', ...validationErrors,
        });
      }
      const { token } = req.params;
      const { password } = req.body;

      const tokenModel = await PasswordReset.query()
        .where('token', token)
        .where('created_at', '>=', Date.now() - 3600000)
        .first();

      if (!tokenModel) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'TOKEN_INVALID', code: 100 }],
        });
      }
      const user = await User.where({
        email: tokenModel.email,
      });
      if (!user) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'USER_NOT_FOUND', code: 120 }],
        });
      }
      const hashedPassword = await hashPassword(password);

      user.password = hashedPassword;
      await user.save();

      await PasswordReset.where('email', user.get('email')).destroy({ require: false });

      return res.status(200).send({});
    },
  },
};
