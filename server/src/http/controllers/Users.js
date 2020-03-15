import express from 'express';
import {
  check,
  query,
  param,
  validationResult,
} from 'express-validator';
import User from '@/models/User';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import jwtAuth from '@/http/middleware/jwtAuth';
import Authorization from '@/http/middleware/authorization';

export default {

  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();
    // const permit = Authorization('users');

    router.use(jwtAuth);

    router.post('/',
      // permit('create'),
      this.newUser.validation,
      asyncMiddleware(this.newUser.handler));

    router.post('/:id',
      // permit('create', 'edit'),
      this.editUser.validation,
      asyncMiddleware(this.editUser.handler));

    router.get('/',
      // permit('view'),
      this.listUsers.validation,
      asyncMiddleware(this.listUsers.handler));

    router.get('/:id',
      // permit('view'),
      this.getUser.validation,
      asyncMiddleware(this.getUser.handler));

    router.delete('/:id',
      // permit('create', 'edit', 'delete'),
      this.deleteUser.validation,
      asyncMiddleware(this.deleteUser.handler));

    return router;
  },

  /**
   * Creates a new user.
   */
  newUser: {
    validation: [
      check('first_name').trim().escape().exists(),
      check('last_name').trim().escape().exists(),
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

      const foundUsers = await User.query()
        .where('email', email)
        .orWhere('phone_number', phoneNumber);

      const foundUserEmail = foundUsers.find((u) => u.email === email);
      const foundUserPhone = foundUsers.find((u) => u.phoneNumber === phoneNumber);

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

      const user = await User.query().insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        active: req.body.status,
      });

      return res.status(200).send({ user });
    },
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
      const user = await User.query().where('id', id).first();

      if (!user) {
        return res.boom.notFound();
      }
      const { email, phone_number: phoneNumber } = req.body;

      const foundUsers = await User.query()
        .whereNot('id', id)
        .andWhere((q) => {
          q.where('email', email);
          q.orWhere('phone_number', phoneNumber);
        });

      const foundUserEmail = foundUsers.find((u) => u.email === email);
      const foundUserPhone = foundUsers.find((u) => u.phoneNumber === phoneNumber);

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

      await User.query().where('id', id).update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone_number: req.body.phone_number,
        active: req.body.status,
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
      const user = await User.query().where('id', id).first();

      if (!user) {
        return res.boom.notFound(null, {
          errors: [{ type: 'USER_NOT_FOUND', code: 100 }],
        });
      }
      await User.query().where('id', id).delete();

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
      const user = await User.query().where('id', id).first();

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
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',

        page_size: 10,
        page: 1,
        ...req.query,
      };

      const users = await User.query()
        .page(filter.page - 1, filter.page_size);

      return res.status(200).send({ users });
    },
  },
};
