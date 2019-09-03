import express from 'express';
import { check, validationResult } from 'express-validator';
import asyncMiddleware from '../middleware/asyncMiddleware';
import Account from '@/models/Account';
import AccountBalance from '@/models/AccountBalance';
import AccountType from '@/models/AccountType';
import JWTAuth from '@/http/middleware/jwtAuth';

export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

    router.use(JWTAuth);
    router.post('/',
      this.newAccount.validation,
      asyncMiddleware(this.newAccount.handler));

    router.get('/:id',
      this.getAccount.validation,
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
      check('type_id').isNumeric().toInt(),
      check('description').trim().escape(),
    ],
    async handler(req, res) {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const { name, code, description } = req.body;
      const { type_id: typeId } = req.body;

      const foundAccountCodePromise = Account.where('code', code).fetch();
      const foundAccountTypePromise = AccountType.where('id', typeId).fetch();

      const [foundAccountCode, foundAccountType] = await Promise.all([
        foundAccountCodePromise,
        foundAccountTypePromise,
      ]);

      if (!foundAccountCode) {
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
        name, code, type_id: typeId, description,
      });

      await account.save();
      return res.boom.success({ item: { ...account.attributes } });
    },
  },

  /**
   * Get details of the given account.
   */
  getAccount: {
    valiation: [],
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
    validation: [],
    async handler(req, res) {
      const { id } = req.params;
      const account = await Account.where('id', id).fetch();

      if (!account) {
        return res.boom.notFound();
      }

      await account.destroy();
      await AccountBalance.where('account_id', id).destroy({ require: false });

      return res.status(200).send({ id: account.previous('id') });
    },
  },
};
