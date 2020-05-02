import express from 'express';
import {
  check,
  query,
  param,
  validationResult,
} from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import SystemUser from '@/system/models/SystemUser';

export default {

  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.put('/:id/inactive',
      this.inactiveUser.validation,
      asyncMiddleware(this.inactiveUser.handler));

    router.put('/:id/active',
      this.activeUser.validation,
      asyncMiddleware(this.activeUser.handler));
  
    router.post('/:id',
      this.editUser.validation,
      asyncMiddleware(this.editUser.handler));

    router.get('/',
      this.listUsers.validation,
      asyncMiddleware(this.listUsers.handler));

    router.get('/:id',
      this.getUser.validation,
      asyncMiddleware(this.getUser.handler));

    router.delete('/:id',
      this.deleteUser.validation,
      asyncMiddleware(this.deleteUser.handler));

    return router;
  },

  /**
   * Edit details of the given user.
   */
  editUser: {
    validation: [
      param('id').exists().isNumeric().toInt(),
      check('first_name').exists(),
      check('last_name').exists(),
      check('email').exists().isEmail(),
      check('phone_number').optional().isMobilePhone(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { TenantUser } = req.models;
      const { user } = req;
      const form = { ...req.body };

      const foundUsers = await TenantUser.query()
        .whereNot('id', id)
        .andWhere((q) => {
          q.where('email', form.email);
          q.orWhere('phone_number', form.phone_number);
        });

      const foundUserEmail = foundUsers.find((u) => u.email === form.email);
      const foundUserPhone = foundUsers.find((u) => u.phoneNumber === form.phone_number);

      const errorReasons = [];

      if (foundUserEmail) {
        errorReasons.push({ type: 'EMAIL_ALREADY_EXIST', code: 100 });
      }
      if (foundUserPhone) {
        errorReasons.push({ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120 });
      }
      if (errorReasons.length > 0) {
        return res.boom.badRequest(null, { errors: errorReasons });
      }
      const userForm = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone_number: form.phone_number,
      };
      const updateTenantUser = TenantUser.query()
        .where('id', id).update({ ...userForm });

      const updateSystemUser = SystemUser.query()
        .where('id', user.id).update({ ...userForm });

      await Promise.all([
        updateTenantUser, updateSystemUser,
      ]);
      return res.status(200).send();
    },
  },

  /**
   * Soft deleting the given user.
   */
  deleteUser: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const { TenantUser } = req.models;
      const user = await TenantUser.query().where('id', id).first();

      if (!user) {
        return res.boom.notFound(null, {
          errors: [{ type: 'USER_NOT_FOUND', code: 100 }],
        });
      }
      const tenantUserDel = TenantUser.query().where('id', id).delete();
      const systemUserDel = SystemUser.query().where('id', id).delete();

      await Promise.all([
        tenantUserDel,
        systemUserDel,
      ]);
      return res.status(200).send();
    },
  },

  /**
   * Retrieve user details of the given user id.
   */
  getUser: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const { TenantUser } = req.models;
      const user = await TenantUser.query().where('id', id).first();

      if (!user) {
        return res.boom.notFound();
      }
      return res.status(200).send({ user });
    },
  },

  /**
   * Retrieve the list of users.
   */
  listUsers: {
    validation: [
      query('page_size').optional().isNumeric().toInt(),
      query('page').optional().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const filter = {
        page_size: 10,
        page: 1,
        ...req.query,
      };
      const { TenantUser } = req.models;
      const users = await TenantUser.query()
        .page(filter.page - 1, filter.page_size);

      return res.status(200).send({ users });
    },
  },

  inactiveUser: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const { user } = req;
      const { TenantUser } = req.models;
      const tenantUser = TenantUser.query().where('id', id).first();

      if (!tenantUser) {
        return res.boom.notFound(null, {
          errors: [{ type: 'USER.NOT.FOUND', code: 100 }],
        });
      }
      const updateTenantUser = TenantUser.query()
        .where('id', id).update({ active: false });

      const updateSystemUser = SystemUser.query()
        .where('id', user.id).update({ active: false });
      
      await Promise.all([
        updateTenantUser, updateSystemUser,
      ]);

      return res.status(200).send({ id: tenantUser.id });
    },
  },

  activeUser: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const { user } = req;
      const { TenantUser } = req.models;
      const tenantUser = TenantUser.query().where('id', id).first();

      if (!tenantUser) {
        return res.boom.notFound(null, {
          errors: [{ type: 'USER.NOT.FOUND', code: 100 }],
        });
      }
      const updateTenantUser = TenantUser.query()
        .where('id', id).update({ active: true });

      const updateSystemUser = SystemUser.query()
        .where('id', user.id).update({ active: true });
      
      await Promise.all([
        updateTenantUser, updateSystemUser,
      ]);
      return res.status(200).send({ id: tenantUser.id });
    },
  },
};