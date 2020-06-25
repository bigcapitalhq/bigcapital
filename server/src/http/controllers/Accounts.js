import express from 'express';
import {
  check,
  validationResult,
  param,
  query,
} from 'express-validator';
import { difference } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import JournalPoster from '@/services/Accounting/JournalPoster';
import NestedSet from '@/collection/NestedSet';
import {
  mapViewRolesToConditionals,
  mapFilterRolesToDynamicFilter,
} from '@/lib/ViewRolesBuilder';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from '@/lib/DynamicFilter';


export default {
  /**
   * Router constructor method.
   */
  router() {
    const router = express.Router();

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

    router.delete('/',
      this.deleteBulkAccounts.validation,
      asyncMiddleware(this.deleteBulkAccounts.handler));

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

    router.post('/bulk/:type(activate|inactivate)',
      this.bulkInactivateAccounts.validation,
      asyncMiddleware(this.bulkInactivateAccounts.handler));

    return router;
  },

  /**
   * Creates a new account.
   */
  newAccount: {
    validation: [
      check('name').exists().isLength({ min: 3 })
        .trim()
        .escape(),
      check('code').optional().isLength({ max: 10 })
        .trim()
        .escape(),
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
      const { AccountType, Account } = req.models;

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
      const insertedAccount = await Account.query().insertAndFetch({ ...form });

      return res.status(200).send({ account: { ...insertedAccount } });
    },
  },

  /**
   * Edit the given account details.
   */
  editAccount: {
    validation: [
      param('id').exists().toInt(),
      check('name').exists().isLength({ min: 3 })
        .trim()
        .escape(),
      check('code').optional().isLength({ max: 10 })
        .trim()
        .escape(),
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
      const { Account, AccountType } = req.models;
      const form = { ...req.body };
      const account = await Account.query().findById(id);

      if (!account) {
        return res.boom.notFound();
      }
      const errorReasons = [];

      // Validate the account type is not changed.
      if (account.account_type_id != form.accountTypeId) {
        errorReasons.push({
          type: 'NOT.ALLOWED.TO.CHANGE.ACCOUNT.TYPE', code: 100,
        });
      }
      // Validate the account code not exists on the storage.
      if (form.code && form.code !== account.code) {
        const foundAccountCode = await Account.query().where('code', form.code).whereNot('id', account.id);

        if (foundAccountCode.length > 0) {
          errorReasons.push({ type: 'NOT_UNIQUE_CODE', code: 200 });
        }
      }

      if (errorReasons.length > 0) {
        return res.status(400).send({ error: errorReasons });
      }
      // Update the account on the storage.
      const updatedAccount = await Account.query().patchAndFetchById(account.id, { ...form });

      return res.status(200).send({ account: { ...updatedAccount } });
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
      const { Account } = req.models;
      const account = await Account.query().remember().where('id', id).first();

      if (!account) {
        return res.boom.notFound();
      }
      return res.status(200).send({ account: { ...account } });
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
      const { Account, AccountTransaction } = req.models;
      const account = await Account.query().findById(id);

      if (!account) {
        return res.boom.notFound();
      }
      if (account.predefined) {
        return res.boom.badRequest(null, {
          errors: [{ type: 'ACCOUNT.PREDEFINED' , code: 200 }],
        });
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
      query('display_type').optional().isIn(['tree', 'flat']),
      query('account_types').optional().isArray(),
      query('account_types.*').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),

      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        account_types: [],
        display_type: 'tree',
        filter_roles: [],
        sort_order: 'asc',
        ...req.query,
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }
      const { Resource, Account, View } = req.models;
      const errorReasons = [];

      const accountsResource = await Resource.query()
        .remember()
        .where('name', 'accounts')
        .withGraphFetched('fields')
        .first();

      if (!accountsResource) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNTS_RESOURCE_NOT_FOUND', code: 200 }],
        });
      }
      const resourceFieldsKeys = accountsResource.fields.map((c) => c.key);

      const view = await View.query().onBuild((builder) => {
        if (filter.custom_view_id) {
          builder.where('id', filter.custom_view_id);
        } else {
          builder.where('favourite', true);
        }
        // builder.where('resource_id', accountsResource.id);
        builder.withGraphFetched('roles.field');
        builder.withGraphFetched('columns');
        builder.first();

        builder.remember();
      });
      const dynamicFilter = new DynamicFilter(Account.tableName);

      if (filter.column_sort_by) {
        if (resourceFieldsKeys.indexOf(filter.column_sort_by) === -1) {
          errorReasons.push({ type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300 });
        }
        const sortByFilter = new DynamicFilterSortBy(
          filter.column_sort_by,
          filter.sort_order,
        );
        dynamicFilter.setFilter(sortByFilter);
      }

      // View roles.
      if (view && view.roles.length > 0) {
        const viewFilter = new DynamicFilterViews(
          mapViewRolesToConditionals(view.roles),
          view.rolesLogicExpression,
        );
        if (!viewFilter.validateFilterRoles()) {
          errorReasons.push({ type: 'VIEW.LOGIC.EXPRESSION.INVALID', code: 400 });
        }
        dynamicFilter.setFilter(viewFilter);
      }
      // Filter roles.
      if (filter.filter_roles.length > 0) {
        // Validate the accounts resource fields.
        const filterRoles = new DynamicFilterFilterRoles(
          mapFilterRolesToDynamicFilter(filter.filter_roles),
          accountsResource.fields,
        );
        dynamicFilter.setFilter(filterRoles);

        if (filterRoles.validateFilterRoles().length > 0) {
          errorReasons.push({ type: 'ACCOUNTS.RESOURCE.HAS.NO.GIVEN.FIELDS', code: 500 });
        }
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }

      const query = Account.query()
      // .remember()
      .onBuild((builder) => {
        builder.modify('filterAccountTypes', filter.account_types);
        builder.withGraphFetched('type');
        builder.withGraphFetched('balance');

        dynamicFilter.buildQuery()(builder);

        // console.log(builder.toKnexQuery().toSQL());
      }).toKnexQuery().toSQL();

      console.log(query);

      const accounts = await Account.query()
        // .remember()
        .onBuild((builder) => {
          builder.modify('filterAccountTypes', filter.account_types);
          builder.withGraphFetched('type');
          builder.withGraphFetched('balance');

          dynamicFilter.buildQuery()(builder);

          // console.log(builder.toKnexQuery().toSQL());
        });

      const nestedAccounts = Account.toNestedArray(accounts);

      return res.status(200).send({
        accounts: nestedAccounts,
        ...(view) ? {
          customViewId: view.id,
        } : {},
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
      const {
        Account,
        AccountTransaction,
        AccountBalance,
      } = req.models;
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
      const { Account } = req.models;
      const account = await Account.query().findById(id);

      if (!account) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      await Account.query()
        .where('id', id)
        .patch({ active: true });

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
      const { Account } = req.models;
      const account = await Account.query().findById(id);

      if (!account) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNT.NOT.FOUND', code: 100 }],
        });
      }
      await Account.query()
        .where('id', id)
        .patch({ active: false });

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

  deleteBulkAccounts: {
    validation: [
      query('ids').isArray(),
      query('ids.*').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = { ids: [], ...req.query };
      const { Account, AccountTransaction } = req.models;

      const accounts = await Account.query().onBuild((builder) => {
        if (filter.ids.length) {
          builder.whereIn('id', filter.ids);
        }
      });
      const accountsIds = accounts.map((a) => a.id);
      const notFoundAccounts = difference(filter.ids, accountsIds);
      const predefinedAccounts = accounts.filter(account => account.predefined);
      const errorReasons = [];

      if (notFoundAccounts.length > 0) {
        return res.status(404).send({
          errors: [{
            type: 'ACCOUNTS.IDS.NOT.FOUND',
            code: 200,
            ids: notFoundAccounts,
          }],
        });
      }
      if (predefinedAccounts.length > 0) {
        errorReasons.push({
          type: 'ACCOUNT.PREDEFINED',
          code: 200,
          ids: predefinedAccounts.map(a => a.id),
        });
      }
      const accountsTransactions = await AccountTransaction.query()
        .whereIn('account_id', accountsIds)
        .count('id as transactions_count')
        .groupBy('account_id')
        .select('account_id');

      const accountsHasTransactions = [];

      accountsTransactions.forEach((transaction) => {
        if (transaction.transactionsCount > 0) {
          accountsHasTransactions.push(transaction.accountId);
        }
      });
      if (accountsHasTransactions.length > 0) {
        errorReasons.push({
          type: 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS',
          code: 300,
          ids: accountsHasTransactions
        });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      await Account.query()
        .whereIn('id', accounts.map((a) => a.id))
        .delete();

      return res.status(200).send();
    },
  },

  /**
   * Bulk acvtivate/inactivate the given accounts.
   */
  bulkInactivateAccounts: {
    validation: [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
      param('type').exists().isIn(['activate', 'inactivate']),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const filter = {
        ids: [],
        ...req.query,
      };
      const { Account } = req.models;
      const { type } = req.params;

      const storedAccounts = await Account.query().whereIn('id', filter.ids);
      const storedAccountsIds = storedAccounts.map((account) => account.id);
      const notFoundAccounts = difference(filter.ids, storedAccountsIds);

      if (notFoundAccounts.length > 0) {
        return res.status(400).send({
          errors: [{ type: 'ACCOUNTS.NOT.FOUND', code: 200 }],
        });
      }
      const updatedAccounts = await Account.query()
        .whereIn('id', storedAccountsIds)
        .patch({
          active: type === 'activate' ? 1 : 0,
        });

      return res.status(200).send({ ids: storedAccountsIds });
    }
  }
};
