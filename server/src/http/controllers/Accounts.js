import express from 'express';
import { check, validationResult, param } from 'express-validator';
import asyncMiddleware from '../middleware/asyncMiddleware';
import Account from '@/models/Account';
// import AccountBalance from '@/models/AccountBalance';
import AccountType from '@/models/AccountType';
// import JWTAuth from '@/http/middleware/jwtAuth';

export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

    // router.use(JWTAuth);
    router.post('/',
      this.newAccount.validation,
      asyncMiddleware(this.newAccount.handler));

    router.post('/:id',
      this.editAccount.validation,
      asyncMiddleware(this.editAccount.handler));

    router.get('/:id',
      asyncMiddleware(this.getAccount.handler));

    router.delete('/:id',
      this.deleteAccount.validation,
      asyncMiddleware(this.deleteAccount.handler));

    return router;
  },

  /**
   * Creates a new account.
   */
  newAccount: {
    validation: [
      check('name').isLength({ min: 3 }).trim().escape(),
      check('code').isLength({ max: 10 }).trim().escape(),
      check('account_type_id').isNumeric().toInt(),
      check('description').trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const { name, code, description } = req.body;
      const { account_type_id: typeId } = req.body;

      const foundAccountCodePromise = code ? Account.where('code', code).fetch() : null;
      const foundAccountTypePromise = AccountType.where('id', typeId).fetch();

      const [foundAccountCode, foundAccountType] = await Promise.all([
        foundAccountCodePromise,
        foundAccountTypePromise,
      ]);

      if (!foundAccountCode && foundAccountCodePromise) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }],
        });
      }
      if (!foundAccountType) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 110 }],
        });
      }
      const account = Account.forge({
        name, code, account_type_id: typeId, description,
      });

      await account.save();
      return res.status(200).send({ item: { ...account.attributes } });
    },
  },

  /**
   * Edit the given account details.
   */
  editAccount: {
    validation: [
      param('id').toInt(),
      check('name').isLength({ min: 3 }).trim().escape(),
      check('code').isLength({ max: 10 }).trim().escape(),
      check('account_type_id').isNumeric().toInt(),
      check('description').trim().escape(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const account = await Account.where('id', id).fetch();

      if (!account) {
        return res.boom.notFound();
      }
      const { name, code, description } = req.body;
      const { account_type_id: typeId } = req.body;

      const foundAccountCodePromise = (code && code !== account.attributes.code)
        ? Account.query({ where: { code }, whereNot: { id } }).fetch() : null;

      const foundAccountTypePromise = (typeId !== account.attributes.account_type_id)
        ? AccountType.where('id', typeId).fetch() : null;

      const [foundAccountCode, foundAccountType] = await Promise.all([
        foundAccountCodePromise, foundAccountTypePromise,
      ]);

      if (!foundAccountCode && foundAccountCodePromise) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }],
        });
      }
      if (!foundAccountType && foundAccountTypePromise) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 110 }],
        });
      }

      await account.save({
        name, code, account_type_id: typeId, description,
      });
      return res.status(200).send();
    },
  },

  /**
   * Get details of the given account.
   */
  getAccount: {
    valiation: [
      param('id').toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const account = await Account.where('id', id).fetch();

      if (!account) {
        return res.boom.notFound();
      }

      return res.status(200).send({ item: { ...account.attributes } });
    },
  },

  /**
   * Delete the given account.
   */
  deleteAccount: {
    validation: [
      param('id').toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const account = await Account.where('id', id).fetch();

      if (!account) {
        return res.boom.notFound();
      }
      await account.destroy();

      return res.status(200).send({ id: account.previous('id') });
    },
  },
};
