import express from 'express';
import { check, validationResult } from 'express-validator';
import User from '@/models/User';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

export default {

  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.post('/',
      this.newUser.validation,
      asyncMiddleware(this.newUser.handler));

    router.post('/:id',
      this.editUser.validation,
      asyncMiddleware(this.editUser.handler));

    // router.get('/',
    //   this.listUsers.validation,
    //   asyncMiddleware(this.listUsers.handler));

    // router.get('/:id',
    //   this.getUser.validation,
    //   asyncMiddleware(this.getUser.handler));

    router.delete('/:id',
      this.deleteUser.validation,
      asyncMiddleware(this.deleteUser.handler));

    return router;
  },

  /**
   * Creates a new user.
   */
  newUser: {
    validation: [
      check('first_name').exists(),
      check('last_name').exists(),
      check('email').exists().isEmail(),
      check('phone_number').optional().isMobilePhone(),
      check('password').isLength({ min: 4 }).exists().custom((value, { req }) => {
        if (value !== req.body.confirm_password) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
      check('status').exists().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { email, phone_number: phoneNumber } = req.body;

      const foundUsers = await User.query((query) => {
        query.where('email', email);
        query.orWhere('phone_number', phoneNumber);
      }).fetchAll();

      const foundUserEmail = foundUsers.find((u) => u.attributes.email === email);
      const foundUserPhone = foundUsers.find((u) => u.attributes.phone_number === phoneNumber);

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

      const user = User.forge({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        active: req.body.status,
      });

      await user.save();

      return res.status(200).send({ id: user.get('id') });
    },
  },

  /**
   * Edit details of the given user.
   */
  editUser: {
    validation: [
      check('first_name').exists(),
      check('last_name').exists(),
      check('email').exists().isEmail(),
      check('phone_number').optional().isMobilePhone(),
      check('password').isLength({ min: 4 }).exists().custom((value, { req }) => {
        if (value !== req.body.confirm_password) {
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      }),
      check('status').exists().isBoolean().toBoolean(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const user = await User.where('id', id).fetch();

      if (!user) {
        return res.boom.notFound();
      }
      const { email, phone_number: phoneNumber } = req.body;

      const foundUsers = await User.query((query) => {
        query.whereNot('id', id);
        query.where('email', email);
        query.orWhere('phone_number', phoneNumber);
      }).fetchAll();

      const foundUserEmail = foundUsers.find((u) => u.attribues.email === email);
      const foundUserPhone = foundUsers.find((u) => u.attribues.phone_number === phoneNumber);

      const errorReasons = [];

      if (foundUserEmail) {
        errorReasons.push({ type: 'EMAIL_ALREADY_EXIST', code: 100 });
      }
      if (foundUserPhone) {
        errorReasons.push({ type: 'PHONE_NUMBER_ALREADY_EXIST', code: 120 });
      }
      if (errorReasons.length > 0) {
        return res.badRequest(null, { errors: errorReasons });
      }

      await user.save({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        status: req.body.status,
      });

      return res.status(200).send();
    },
  },

  /**
   * Soft deleting the given user.
   */
  deleteUser: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const user = await User.where('id', id).fetch();

      if (!user) {
        return res.boom.notFound(null, {
          errors: [{ type: 'USER_NOT_FOUND', code: 100 }],
        });
      }

      await user.destroy();
      return res.status(200).send();
    },
  },

  getUser: {
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const user = await User.where('id', id).fetch();

      if (!user) {
        return res.boom.notFound();
      }

      return res.status(200).send({ item: user.toJSON() });
    },
  },

  /**
   * Retrieve the list of users.
   */
  listUsers: {
    validation: [],
    handler(req, res) {
      const filter = {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',

        page_size: 10,
        page: 1,
        ...req.query,
      };

      const users = User.query((query) => {
        if (filter.first_name) {
          query.where('first_name', filter.first_name);
        }
        if (filter.last_name) {
          query.where('last_name', filter.last_name);
        }
        if (filter.email) {
          query.where('email', filter.email);
        }
        if (filter.phone_number) {
          query.where('phone_number', filter.phone_number);
        }
      }).fetchPage({
        page_size: filter.page_size,
        page: filter.page,
      });

      return res.status(200).send({
        items: users.toJSON(),
        pagination: users.pagination,
      });
    },
  },
};
