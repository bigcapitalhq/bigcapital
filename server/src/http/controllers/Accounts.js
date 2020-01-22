import express from 'express';
import { check, validationResult, param, query } from 'express-validator';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import Account from '@/models/Account';
import AccountType from '@/models/AccountType';
import AccountTransaction from '@/models/AccountTransaction';
import JournalPoster from '@/services/Accounting/JournalPoster';
import AccountBalance from '@/models/AccountBalance';
import JWTAuth from '@/http/middleware/jwtAuth';
import NestedSet from '../../collection/NestedSet';

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

    router.post('/:id',
      this.editAccount.validation,
      asyncMiddleware(this.editAccount.handler));

    router.get('/:id',
      this.getAccount.validation,
      asyncMiddleware(this.getAccount.handler));

    router.get('/',
      this.getAccountsList.validation,
      asyncMiddleware(this.getAccountsList.handler));

    router.delete('/:id',
      this.deleteAccount.validation,
      asyncMiddleware(this.deleteAccount.handler));

    router.post('/:id/active',
      this.activeAccount.validation,
      asyncMiddleware(this.activeAccount.handler));

    router.post('/:id/inactive',
      this.inactiveAccount.validation,
      asyncMiddleware(this.inactiveAccount.handler));

    router.post('/:id/recalculate-balance',
      this.recalcualteBalanace.validation,
      asyncMiddleware(this.recalcualteBalanace.handler));

    router.post('/:id/transfer_account/:toAccount',
      this.transferToAnotherAccount.validation,
      asyncMiddleware(this.transferToAnotherAccount.handler));

    return router;
  },

  /**
   * Creates a new account.
   */
  newAccount: {
    validation: [
      check('name').exists().isLength({ min: 3 }).trim().escape(),
      check('code').exists().isLength({ max: 10 }).trim().escape(),
      check('account_type_id').exists().isNumeric().toInt(),
      check('description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };

      const foundAccountCodePromise = form.code
        ? Account.query().where('code', form.code) : null;

      const foundAccountTypePromise = AccountType.query()
        .findById(form.account_type_id);

      const [foundAccountCode, foundAccountType] = await Promise.all([
        foundAccountCodePromise, foundAccountTypePromise,
      ]);

      if (foundAccountCodePromise && foundAccountCode.length > 0) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }],
        });
      }
      if (!foundAccountType) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 200 }],
        });
      }
      await Account.query().insert({ ...form });

      return res.status(200).send({ item: { } });
    },
  },

  /**
   * Edit the given account details.
   */
  editAccount: {
    validation: [
      param('id').exists().toInt(),
      check('name').exists().isLength({ min: 3 }).trim().escape(),
      check('code').exists().isLength({ max: 10 }).trim().escape(),
      check('account_type_id').exists().isNumeric().toInt(),
      check('description').optional().trim().escape(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const form = { ...req.body };
      const account = await Account.query().findById(id);

      if (!account) {
        return res.boom.notFound();
      }
      const foundAccountCodePromise = (form.code && form.code !== account.code)
        ? Account.query().where('code', form.code).whereNot('id', account.id) : null;

      const foundAccountTypePromise = (form.account_type_id !== account.account_type_id)
        ? AccountType.query().where('id', form.account_type_id) : null;

      const [foundAccountCode, foundAccountType] = await Promise.all([
        foundAccountCodePromise, foundAccountTypePromise,
      ]);
      if (foundAccountCode.length > 0 && foundAccountCodePromise) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_UNIQUE_CODE', code: 100 }],
        });
      }
      if (foundAccountType.length <= 0 && foundAccountTypePromise) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'NOT_EXIST_ACCOUNT_TYPE', code: 110 }],
        });
      }
      await account.patch({ ...form });

      return res.status(200).send();
    },
  },

  /**
   * Get details of the given account.
   */
  getAccount: {
    validation: [
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
      const account = await Account.query().findById(id);

      if (!account) {
        return res.boom.notFound();
      }
      const accountTransactions = await AccountTransaction.query()
        .where('account_id', account.id);

      if (accountTransactions.length > 0) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS', code: 100 }],
        });
      }
      await Account.query().deleteById(account.id);

      return res.status(200).send();
    },
  },

  /**
   * Retrieve accounts list.
   */
  getAccountsList: {
    validation: [
      query('account_types').optional().isArray(),
      query('account_types.*').optional().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      const form = {
        account_types: [],
        ...req.body,
      };
      const accounts = await Account.query()
        .modify('filterAccountTypes', form.account_types);

      const accountsNestedSet = new NestedSet(accounts, {
        parentId: 'parentAccountId',
      });

      return res.status(200).send({
        // ...accountsNestedSet.toArray(),
      });
    },
  },

  /**
   * Re-calculates balance of the given account.
   */
  recalcualteBalanace: {
    validation: [
      param('id').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const account = await Account.findById(id);

      if (!account) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      const accountTransactions = AccountTransaction.query()
        .where('account_id', account.id);

      const journalEntries = new JournalPoster();
      journalEntries.loadFromCollection(accountTransactions);

      // Delete the balance of the given account id.
      await AccountBalance.query().where('account_id', account.id).delete();

      // Save calcualted account balance.
      await journalEntries.saveBalance();

      return res.status(200).send();
    },
  },

  /**
   * Active the given account.
   */
  activeAccount: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const account = await Account.findById(id);

      if (!account) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      await account.patch({ active: true });

      return res.status(200).send({ id: account.id });
    },
  },

  /**
   * Inactive the given account.
   */
  inactiveAccount: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const { id } = req.params;
      const account = await Account.findById(id);

      if (!account) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      await account.patch({ active: false });

      return res.status(200).send({ id: account.id });
    },
  },

  /**
   * Transfer all journal entries of the given account to another account.
   */
  transferToAnotherAccount: {
    validation: [
      param('id').exists().isNumeric().toInt(),
      param('toAccount').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }

      // const { id, toAccount: toAccountId } = req.params;

      // const [fromAccount, toAccount] = await Promise.all([
      //   Account.query().findById(id),
      //   Account.query().findById(toAccountId),
      // ]);

      // const fromAccountTransactions = await AccountTransaction.query()
      //   .where('account_id', fromAccount);

      // return res.status(200).send();
    },
  },
};
