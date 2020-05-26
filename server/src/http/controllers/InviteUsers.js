import express from 'express';
import uniqid from 'uniqid';
import {
  check,
  body,
  param,
  validationResult,
} from 'express-validator';
import path from 'path';
import fs from 'fs';
import Mustache from 'mustache';
import moment from 'moment';
import mail from '@/services/mail';
import { hashPassword } from '@/utils';
import SystemUser from '@/system/models/SystemUser';
import Invite from '@/system/models/Invite';
import TenantUser from '@/models/TenantUser';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Tenant from '@/system/models/Tenant';
import TenantsManager from '@/system/TenantsManager';
import jwtAuth from '@/http/middleware/jwtAuth';
import TenancyMiddleware from '@/http/middleware/TenancyMiddleware';
import TenantModel from '@/models/TenantModel';
import Logger from '@/services/Logger';
import Option from '@/models/Option';

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.use('/send', jwtAuth);
    router.use('/send', TenancyMiddleware);

    router.post('/send',
      this.invite.validation,
      asyncMiddleware(this.invite.handler));

    router.post('/accept/:token',
      this.accept.validation,
      asyncMiddleware(this.accept.handler));

    router.get('/invited/:token',
      this.invited.validation,
      asyncMiddleware(this.invited.handler));

    return router;
  },

  /**
   * Invite a user to the authorized user organization.
   */
  invite: {
    validation: [
      body('email').exists().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const { user } = req;
      const { TenantUser } = req.models;
      const foundUser = await SystemUser.query()
        .where('email', form.email).first();      

      if (foundUser) {
        return res.status(400).send({
          errors: [{ type: 'USER.EMAIL.ALREADY.REGISTERED', code: 100 }],
        });
      }
      const token = uniqid();
      const invite = await Invite.query().insert({
        email: form.email,
        tenant_id: user.tenantId,
        token,
      });
      const tenantUser = await TenantUser.query().insert({
        first_name: form.email,
        email: form.email,
      });
      const { Option } = req.models;
      const organizationOptions = await Option.query()
        .where('key', 'organization_name');

      const filePath = path.join(global.rootPath, 'views/mail/UserInvite.html');
      const template = fs.readFileSync(filePath, 'utf8');

      const rendered = Mustache.render(template, {
        acceptUrl: `${req.protocol}://${req.hostname}/invite/accept/${invite.token}`,
        fullName: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organizationName: organizationOptions.getMeta('organization_name'),
      });
      const mailOptions = {
        to: user.email,
        from: `${process.env.MAIL_FROM_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
        subject: `${user.fullName} has invited you to join a Bigcapital`,
        html: rendered,
      };
      mail.sendMail(mailOptions, (error) => {
        if (error) {
          Logger.log('error', 'Failed send user invite mail', { error, form });
        }
        Logger.log('info', 'User has been sent invite user email successfuly.', { form });
      });
      return res.status(200).send();
    }
  },

  /**
   * Acceprt the inviation.
   */
  accept: {
    validation: [
      check('first_name').exists().trim().escape(),
      check('last_name').exists().trim().escape(),
      check('phone_number').exists().trim().escape(),
      check('password').exists().trim().escape(),
      param('token').exists().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { token } = req.params;
      const inviteToken = await Invite.query()
        .where('token', token).first();

      if (!inviteToken) {
        return res.status(404).send({
          errors: [{ type: 'INVITE.TOKEN.NOT.FOUND', code: 300 }],
        });
      }
      const form = {
        language: 'en',
        ...req.body,
      };
      const systemUser = await SystemUser.query()
        .where('phone_number', form.phone_number)
        .first();

      const errorReasons = [];

      // Validate there is already registered phone number.
      if (systemUser && systemUser.phoneNumber === form.phone_number) {
        errorReasons.push({
          type: 'PHONE_MUMNER.ALREADY.EXISTS', code: 400,
        });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Find the tenant that associated to the given token.
      const tenant = await Tenant.query()
        .where('id', inviteToken.tenantId).first();

      const tenantDb = TenantsManager.knexInstance(tenant.organizationId);
      const hashedPassword = await hashPassword(form.password);

      const userForm = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: inviteToken.email,
        phone_number: form.phone_number,
        language: form.language,
        active: 1,
      };
      TenantModel.knexBinded = tenantDb;

      const foundTenantUser = await TenantUser.query()
        .where('phone_number', form.phone_number).first();

      if (foundTenantUser) {
        return res.status(400).send({
          errors: [{ type: 'PHONE_NUMBER.ALREADY.EXISTS', code: 400 }],
        });
      }

      const insertUserOper = TenantUser.bindKnex(tenantDb)
        .query()
        .where('email', userForm.email)
        .patch({
          ...userForm,
          invite_accepted_at: moment().format('YYYY/MM/DD'),
        });

      const insertSysUserOper = SystemUser.query().insert({
        ...userForm,
        password: hashedPassword,
        tenant_id: inviteToken.tenantId,
      });

      const deleteInviteTokenOper = Invite.query()
        .where('token', inviteToken.token).delete();

      await Promise.all([
        insertUserOper,
        insertSysUserOper,
        deleteInviteTokenOper,
      ]);
      return res.status(200).send();
    },
  },

  /**
   * Get 
   */
  invited: {
    validation: [
      param('token').exists().trim().escape(),
    ],
    async handler(req, res) {
      const { token } = req.params;
      const inviteToken = await Invite.query()
        .where('token', token).first();

      if (!inviteToken) {
        return res.status(404).send({
          errors: [{ type: 'INVITE.TOKEN.NOT.FOUND', code: 300 }],
        });
      }
      // Find the tenant that associated to the given token.
      const tenant = await Tenant.query()
        .where('id', inviteToken.tenantId).first();

      const tenantDb = TenantsManager.knexInstance(tenant.organizationId);
      const organizationOptions = await Option.bindKnex(tenantDb).query()
        .where('key', 'organization_name');

      return res.status(200).send({
        data: {
          organization_name: organizationOptions.getMeta('organization_name', '')          ,
          invited_email: inviteToken.email,
        },
      });
    },
  },
}