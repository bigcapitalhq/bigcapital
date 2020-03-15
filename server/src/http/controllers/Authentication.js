
import express from 'express';
import { check, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import Mustache from 'mustache';
import jwt from 'jsonwebtoken';
import asyncMiddleware from '../middleware/asyncMiddleware';
import User from '@/models/User';
import PasswordReset from '@/models/PasswordReset';
import mail from '@/services/mail';
import { hashPassword } from '@/utils';

export default {
  /**
   * Constructor method.
   */
  router() {
    const router = express.Router();

    router.post('/login',
      this.login.validation,
      asyncMiddleware(this.login.handler));

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
      const { crediential, password } = req.body;
      const { JWT_SECRET_KEY } = process.env;

      const user = await User.query()
        .where('email', crediential)
        .orWhere('phone_number', crediential)
        .first();

      if (!user) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_DETAILS', code: 100 }],
        });
      }
      if (!user.verifyPassword(password)) {
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

      const token = jwt.sign({
        email: user.email,
        _id: user.id,
      }, JWT_SECRET_KEY, {
        expiresIn: '1d',
      });
      return res.status(200).send({ token, user });
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
