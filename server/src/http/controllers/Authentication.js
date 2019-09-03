
import express from 'express';
import { check, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import Mustache from 'mustache';
import User from '@/models/User';
import asyncMiddleware from '../middleware/asyncMiddleware';
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
      check('crediential').isEmail(),
      check('password').isLength({ min: 5 }),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const { crediential, password } = req.body;

      const user = await User.query({
        where: { email: crediential },
        orWhere: { phone_number: crediential },
      }).fetch();

      if (!user) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INVALID_DETAILS', code: 100 }],
        });
      }
      if (!user.verifyPassword(password)) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'INCORRECT_PASSWORD', code: 110 }],
        });
      }
      if (!user.attributes.active) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'USER_INACTIVE', code: 120 }],
        });
      }
      user.save({ alst_login_at: new Date() });
      return res.status(200).send({});
    },
  },

  /**
   * Send reset password link via email or SMS.
   */
  sendResetPassword: {
    validation: [
      check('email').isEmail(),
    ],
    // eslint-disable-next-line consistent-return
    async handler(req, res) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { email } = req.body;
      const user = User.where('email').fetch();

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
      check('password').isLength({ min: 5 }),
      check('reset_password'),
    ],
    async handler(req, res) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { token } = req.params;
      const { password } = req.body;

      const tokenModel = await PasswordReset.query((query) => {
        query.where({ token });
        query.where('created_at', '>=', Date.now() - 3600000);
      }).fetch();

      if (!tokenModel) {
        return res.status(400).send({
          error: {
            type: 'token.invalid',
            message: 'Password reset token is invalid or has expired',
          },
        });
      }

      const user = await User.where({
        email: tokenModel.attributes.email,
      });
      if (!user) {
        return res.status(400).send({
          error: { message: 'An unexpected error occurred.' },
        });
      }
      const hashedPassword = await hashPassword(password);

      user.set('password', hashedPassword);
      await user.save();

      await PasswordReset.where('email', user.get('email')).destroy({ require: false });

      return res.status(200).send({});
    },
  },
};
