import { check, query, validationResult, param } from 'express-validator';
import express from 'express';
import { difference } from 'lodash';
import moment from 'moment';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import JournalPoster from '@/services/Accounting/JournalPoster';
import JournalEntry from '@/services/Accounting/JournalEntry';
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
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.get(
      '/manual-journals/:id',
      this.getManualJournal.validation,
      asyncMiddleware(this.getManualJournal.handler)
    );

    router.get(
      '/manual-journals',
      this.manualJournals.validation,
      asyncMiddleware(this.manualJournals.handler)
    );

    router.post(
      '/make-journal-entries',
      this.validateMediaIds,
      this.validateContactEntries,
      this.makeJournalEntries.validation,
      asyncMiddleware(this.makeJournalEntries.handler)
    );

    router.post(
      '/manual-journals/:id/publish',
      this.publishManualJournal.validation,
      asyncMiddleware(this.publishManualJournal.handler)
    );

    router.post(
      '/manual-journals/:id',
      this.validateMediaIds,
      this.validateContactEntries,
      this.editManualJournal.validation,
      asyncMiddleware(this.editManualJournal.handler)
    );

    router.delete(
      '/manual-journals/:id',
      this.deleteManualJournal.validation,
      asyncMiddleware(this.deleteManualJournal.handler)
    );

    router.delete(
      '/manual-journals',
      this.deleteBulkManualJournals.validation,
      asyncMiddleware(this.deleteBulkManualJournals.handler)
    );

    router.post(
      '/recurring-journal-entries',
      this.recurringJournalEntries.validation,
      asyncMiddleware(this.recurringJournalEntries.handler)
    );

    router.post(
      'quick-journal-entries',
      this.quickJournalEntries.validation,
      asyncMiddleware(this.quickJournalEntries.handler)
    );

    return router;
  },

  /**
   * Retrieve manual journals,
   */
  manualJournals: {
    validation: [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),

      query('column_sort_by').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('stringified_filter_roles').optional().isJSON(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const filter = {
        filter_roles: [],
        page: 1,
        page_size: 999,
        sort_order: 'asc',
        ...req.query,
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }
      const { Resource, View, ManualJournal } = req.models;

      const errorReasons = [];
      const manualJournalsResource = await Resource.query()
        .where('name', 'manual_journals')
        .withGraphFetched('fields')
        .first();

      if (!manualJournalsResource) {
        return res.status(400).send({
          errors: [{ type: 'MANUAL_JOURNALS.RESOURCE.NOT.FOUND', code: 200 }],
        });
      }

      const view = await View.query().onBuild((builder) => {
        if (filter.custom_view_id) {
          builder.where('id', filter.custom_view_id);
        } else {
          builder.where('favourite', true);
        }
        builder.where('resource_id', manualJournalsResource.id);
        builder.withGraphFetched('roles.field');
        builder.withGraphFetched('columns');
        builder.first();
        builder.remember();
      });

      const resourceFieldsKeys = manualJournalsResource.fields.map(
        (c) => c.key
      );
      const dynamicFilter = new DynamicFilter(ManualJournal.tableName);

      // Dynamic filter with view roles.
      if (view && view.roles.length > 0) {
        const viewFilter = new DynamicFilterViews(
          mapViewRolesToConditionals(view.roles),
          view.rolesLogicExpression
        );
        if (!viewFilter.validateFilterRoles()) {
          errorReasons.push({
            type: 'VIEW.LOGIC.EXPRESSION.INVALID',
            code: 400,
          });
        }
        dynamicFilter.setFilter(viewFilter);
      }
      // Dynamic filter with filter roles.
      if (filter.filter_roles.length > 0) {
        // Validate the accounts resource fields.
        const filterRoles = new DynamicFilterFilterRoles(
          mapFilterRolesToDynamicFilter(filter.filter_roles),
          manualJournalsResource.fields
        );
        dynamicFilter.setFilter(filterRoles);

        if (filterRoles.validateFilterRoles().length > 0) {
          errorReasons.push({
            type: 'MANUAL.JOURNAL.HAS.NO.FIELDS',
            code: 500,
          });
        }
      }
      // Dynamic filter with column sort order.
      if (filter.column_sort_by) {
        if (resourceFieldsKeys.indexOf(filter.column_sort_by) === -1) {
          errorReasons.push({ type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300 });
        }
        const sortByFilter = new DynamicFilterSortBy(
          filter.column_sort_by,
          filter.sort_order
        );
        dynamicFilter.setFilter(sortByFilter);
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Manual journals.
      const manualJournals = await ManualJournal.query()
        .onBuild((builder) => {
          dynamicFilter.buildQuery()(builder);
        })
        .pagination(filter.page - 1, filter.page_size);

      return res.status(200).send({
        manualJournals: {
          ...manualJournals,
          ...(view
            ? {
                viewMeta: {
                  customViewId: view.id,
                },
              }
            : {}),
        },
      });
    },
  },

  /**
   * Validate media ids.
   * @param {Request} req -
   * @param {Response} res -
   * @param {Function} next -
   */
  async validateMediaIds(req, res, next) {
    const form = { media_ids: [], ...req.body };
    const { Media } = req.models;
    const errorReasons = [];

    // Validate if media ids was not already exists on the storage.
    if (form.media_ids.length > 0) {
      const storedMedia = await Media.query().whereIn('id', form.media_ids);
      const notFoundMedia = difference(
        form.media_ids,
        storedMedia.map((m) => m.id)
      );

      if (notFoundMedia.length > 0) {
        errorReasons.push({
          type: 'MEDIA.IDS.NOT.FOUND',
          code: 400,
          ids: notFoundMedia,
        });
      }
    }
    req.errorReasons =
      Array.isArray(req.errorReasons) && req.errorReasons.length
        ? req.errorReasons.push(...errorReasons)
        : errorReasons;
    next();
  },

  /**
   * Validate form entries with contact customers and vendors.
   *
   * - Validate the entries that with receivable has no customer contact.
   * - Validate the entries that with payable has no vendor contact.
   * - Validate the entries with customers contacts that not found on the storage.
   * - Validate the entries with vendors contacts that not found on the storage.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  async validateContactEntries(req, res, next) {
    const form = { entries: [], ...req.body };
    const { Account, AccountType, Vendor, Customer } = req.models;
    const errorReasons = [];

    // Validate the entries contact type and ids.
    const formEntriesCustomersIds = form.entries.filter(
      (e) => e.contact_type === 'customer'
    );
    const formEntriesVendorsIds = form.entries.filter(
      (e) => e.contact_type === 'vendor'
    );

    const accountsTypes = await AccountType.query();

    const payableAccountsType = accountsTypes.find(
      (t) => t.key === 'accounts_payable'
    );
    const receivableAccountsType = accountsTypes.find(
      (t) => t.key === 'accounts_receivable'
    );

    const receivableAccountOper = Account.query()
      .where('account_type_id', receivableAccountsType.id)
      .first();
    const payableAccountOper = Account.query()
      .where('account_type_id', payableAccountsType.id)
      .first();

    const [receivableAccount, payableAccount] = await Promise.all([
      receivableAccountOper,
      payableAccountOper,
    ]);

    const entriesHasNoReceivableAccount = form.entries.filter(
      (e) =>
        e.account_id === receivableAccount.id &&
        (!e.contact_id || e.contact_type !== 'customer')
    );

    if (entriesHasNoReceivableAccount.length > 0) {
      errorReasons.push({
        type: 'RECEIVABLE.ENTRIES.HAS.NO.CUSTOMERS',
        code: 900,
        indexes: entriesHasNoReceivableAccount.map((e) => e.index),
      });
    }

    const entriesHasNoVendorContact = form.entries.filter(
      (e) =>
        e.account_id === payableAccount.id &&
        (!e.contact_id || e.contact_type !== 'contact')
    );

    if (entriesHasNoVendorContact.length > 0) {
      errorReasons.push({
        type: 'PAYABLE.ENTRIES.HAS.NO.VENDORS',
        code: 1000,
        indexes: entriesHasNoVendorContact.map((e) => e.index),
      });
    }

    // Validate customers contacts.
    if (formEntriesCustomersIds.length > 0) {
      const customersContactsIds = formEntriesCustomersIds.map(
        (c) => c.contact_id
      );
      const storedContacts = await Customer.query().whereIn(
        'id',
        customersContactsIds
      );

      const storedContactsIds = storedContacts.map((c) => c.id);

      const notFoundContactsIds = difference(
        formEntriesCustomersIds.map((c) => c.contact_id),
        storedContactsIds
      );
      if (notFoundContactsIds.length > 0) {
        errorReasons.push({
          type: 'CUSTOMERS.CONTACTS.NOT.FOUND',
          code: 500,
          ids: notFoundContactsIds,
        });
      }

      const notReceivableAccounts = formEntriesCustomersIds.filter(
        (c) => c.account_id !== receivableAccount.id
      );
      if (notReceivableAccounts.length > 0) {
        errorReasons.push({
          type: 'CUSTOMERS.NOT.WITH.RECEIVABLE.ACCOUNT',
          code: 700,
          indexes: notReceivableAccounts.map((a) => a.index),
        });
      }
    }

    // Validate vendors contacts.
    if (formEntriesVendorsIds.length > 0) {
      const vendorsContactsIds = formEntriesVendorsIds.map((c) => c.contact_id);
      const storedContacts = await Vendor.query().where(
        'id',
        vendorsContactsIds
      );

      const storedContactsIds = storedContacts.map((c) => c.id);

      const notFoundContactsIds = difference(
        formEntriesVendorsIds.map((v) => v.contact_id),
        storedContactsIds
      );
      if (notFoundContactsIds.length > 0) {
        errorReasons.push({
          type: 'VENDORS.CONTACTS.NOT.FOUND',
          code: 600,
          ids: notFoundContactsIds,
        });
      }
      const notPayableAccounts = formEntriesVendorsIds.filter(
        (v) => v.contact_id === payableAccount.id
      );
      if (notPayableAccounts.length > 0) {
        errorReasons.push({
          type: 'VENDORS.NOT.WITH.PAYABLE.ACCOUNT',
          code: 800,
          indexes: notPayableAccounts.map((a) => a.index),
        });
      }
    }

    req.errorReasons =
      Array.isArray(req.errorReasons) && req.errorReasons.length
        ? req.errorReasons.push(...errorReasons)
        : errorReasons;

    next();
  },

  /**
   * Make journal entrires.
   */
  makeJournalEntries: {
    validation: [
      check('date').exists().isISO8601(),
      check('journal_number').exists().trim().escape(),
      check('journal_type').optional({ nullable: true }).trim().escape(),
      check('reference').optional({ nullable: true }),
      check('description').optional().trim().escape(),
      check('status').optional().isBoolean().toBoolean(),
      check('entries').isArray({ min: 2 }),
      check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.credit')
        .optional({ nullable: true })
        .isNumeric()
        .isDecimal()
        .isFloat({ max: 9999999999.999 }) // 13, 3
        .toFloat(),
      check('entries.*.debit')
        .optional({ nullable: true })
        .isNumeric()
        .isDecimal()
        .isFloat({ max: 9999999999.999 }) // 13, 3
        .toFloat(),
      check('entries.*.account_id').isNumeric().toInt(),
      check('entries.*.note').optional(),
      check('entries.*.contact_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.contact_type').optional().isIn(['vendor', 'customer']),
      check('media_ids').optional().isArray(),
      check('media_ids.*').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const form = {
        date: new Date(),
        journal_type: 'journal',
        reference: '',
        media_ids: [],
        ...req.body,
      };
      const { ManualJournal, Account, MediaLink } = req.models;

      let totalCredit = 0;
      let totalDebit = 0;

      const { user } = req;
      const errorReasons = [...(req.errorReasons || [])];
      const entries = form.entries.filter(
        (entry) => entry.credit || entry.debit
      );
      const formattedDate = moment(form.date).format('YYYY-MM-DD');

      entries.forEach((entry) => {
        if (entry.credit > 0) {
          totalCredit += entry.credit;
        }
        if (entry.debit > 0) {
          totalDebit += entry.debit;
        }
      });
      if (totalCredit <= 0 || totalDebit <= 0) {
        errorReasons.push({
          type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
          code: 400,
        });
      }
      if (totalCredit !== totalDebit) {
        errorReasons.push({ type: 'CREDIT.DEBIT.NOT.EQUALS', code: 100 });
      }
      const formEntriesAccountsIds = entries.map((entry) => entry.account_id);

      const accounts = await Account.query()
        .whereIn('id', formEntriesAccountsIds)
        .withGraphFetched('type');

      const storedAccountsIds = accounts.map((account) => account.id);

      if (difference(formEntriesAccountsIds, storedAccountsIds).length > 0) {
        errorReasons.push({ type: 'ACCOUNTS.IDS.NOT.FOUND', code: 200 });
      }

      const journalNumber = await ManualJournal.query().where(
        'journal_number',
        form.journal_number
      );

      if (journalNumber.length > 0) {
        errorReasons.push({ type: 'JOURNAL.NUMBER.ALREADY.EXISTS', code: 300 });
      }

      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Save manual journal tansaction.
      const manualJournal = await ManualJournal.query().insert({
        reference: form.reference,
        journal_type: form.journal_type,
        journal_number: form.journal_number,
        amount: totalCredit,
        date: formattedDate,
        description: form.description,
        status: form.status,
        user_id: user.id,
      });

      const accountsDepGraph = await Account.depGraph().query();
      const journalPoster = new JournalPoster(accountsDepGraph);

      entries.forEach((entry) => {
        const account = accounts.find((a) => a.id === entry.account_id);
        const jouranlEntry = new JournalEntry({
          debit: entry.debit,
          credit: entry.credit,
          account: account.id,
          referenceType: 'Journal',
          referenceId: manualJournal.id,
          accountNormal: account.type.normal,
          contactType: entry.contact_type,
          contactId: entry.contact_id,
          note: entry.note,
          date: formattedDate,
          userId: user.id,
          draft: !form.status,
        });
        if (entry.debit) {
          journalPoster.debit(jouranlEntry);
        } else {
          journalPoster.credit(jouranlEntry);
        }
      });

      // Save linked media to the journal model.
      const bulkSaveMediaLink = [];

      form.media_ids.forEach((mediaId) => {
        const oper = MediaLink.query().insert({
          model_name: 'Journal',
          model_id: manualJournal.id,
          media_id: mediaId,
        });
        bulkSaveMediaLink.push(oper);
      });

      // Saves the journal entries and accounts balance changes.
      await Promise.all([
        ...bulkSaveMediaLink,
        journalPoster.saveEntries(),
        form.status && journalPoster.saveBalance(),
      ]);
      return res.status(200).send({ id: manualJournal.id });
    },
  },

  /**
   * Saves recurring journal entries template.
   */
  recurringJournalEntries: {
    validation: [
      check('template_name').exists(),
      check('recurrence').exists(),
      check('active').optional().isBoolean().toBoolean(),
      check('entries').isArray({ min: 1 }),
      check('entries.*.credit').isNumeric().toInt(),
      check('entries.*.debit').isNumeric().toInt(),
      check('entries.*.account_id').isNumeric().toInt(),
      check('entries.*.note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
    },
  },

  /**
   * Edit the given manual journal.
   */
  editManualJournal: {
    validation: [
      param('id').exists().isNumeric().toInt(),
      check('date').exists().isISO8601(),
      check('journal_number').exists().trim().escape(),
      check('journal_type').optional({ nullable: true }).trim().escape(),
      check('reference').optional({ nullable: true }),
      check('description').optional().trim().escape(),
      check('entries').isArray({ min: 2 }),
      // check('entries.*.index').exists().isNumeric().toInt(),
      check('entries.*.credit')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.debit')
        .optional({ nullable: true })
        .isNumeric()
        .toFloat(),
      check('entries.*.account_id').isNumeric().toInt(),
      check('entries.*.contact_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
      check('entries.*.contact_type')
        .optional()
        .isIn(['vendor', 'customer'])
        .isNumeric()
        .toInt(),
      check('entries.*.note').optional(),
      check('media_ids').optional().isArray(),
      check('media_ids.*').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const form = {
        date: new Date(),
        journal_type: 'Journal',
        reference: '',
        media_ids: [],
        ...req.body,
      };
      const { id } = req.params;
      const {
        ManualJournal,
        AccountTransaction,
        Account,
        Media,
        MediaLink,
      } = req.models;

      const manualJournal = await ManualJournal.query()
        .where('id', id)
        .withGraphFetched('media')
        .first();

      if (!manualJournal) {
        return res.status(4040).send({
          errors: [{ type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100 }],
        });
      }
      let totalCredit = 0;
      let totalDebit = 0;

      const { user } = req;
      const errorReasons = [...(req.errorReasons || [])];
      const entries = form.entries.filter(
        (entry) => entry.credit || entry.debit
      );
      const formattedDate = moment(form.date).format('YYYY-MM-DD');

      entries.forEach((entry) => {
        if (entry.credit > 0) {
          totalCredit += entry.credit;
        }
        if (entry.debit > 0) {
          totalDebit += entry.debit;
        }
      });
      if (totalCredit <= 0 || totalDebit <= 0) {
        errorReasons.push({
          type: 'CREDIT.DEBIT.SUMATION.SHOULD.NOT.EQUAL.ZERO',
          code: 400,
        });
      }
      if (totalCredit !== totalDebit) {
        errorReasons.push({ type: 'CREDIT.DEBIT.NOT.EQUALS', code: 100 });
      }
      const journalNumber = await ManualJournal.query()
        .where('journal_number', form.journal_number)
        .whereNot('id', id)
        .first();

      if (journalNumber) {
        errorReasons.push({ type: 'JOURNAL.NUMBER.ALREADY.EXISTS', code: 300 });
      }
      const accountsIds = entries.map((entry) => entry.account_id);
      const accounts = await Account.query()
        .whereIn('id', accountsIds)
        .withGraphFetched('type');

      const storedAccountsIds = accounts.map((account) => account.id);

      if (difference(accountsIds, storedAccountsIds).length > 0) {
        errorReasons.push({ type: 'ACCOUNTS.IDS.NOT.FOUND', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }

      await ManualJournal.query().where('id', manualJournal.id).update({
        reference: form.reference,
        journal_type: form.journal_type,
        journalNumber: form.journal_number,
        amount: totalCredit,
        date: formattedDate,
        description: form.description,
      });

      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Journal'])
        .where('reference_id', manualJournal.id)
        .withGraphFetched('account.type');

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.removeEntries();

      entries.forEach((entry) => {
        const account = accounts.find((a) => a.id === entry.account_id);

        const jouranlEntry = new JournalEntry({
          debit: entry.debit,
          credit: entry.credit,
          account: account.id,
          referenceType: 'Journal',
          referenceId: manualJournal.id,
          accountNormal: account.type.normal,
          note: entry.note,
          date: formattedDate,
          userId: user.id,
        });
        if (entry.debit) {
          journal.debit(jouranlEntry);
        } else {
          journal.credit(jouranlEntry);
        }
      });

      // Save links of new inserted media that associated to the journal model.
      const journalMediaIds = manualJournal.media.map((m) => m.id);
      const newInsertedMedia = difference(form.media_ids, journalMediaIds);
      const bulkSaveMediaLink = [];

      newInsertedMedia.forEach((mediaId) => {
        const oper = MediaLink.query().insert({
          model_name: 'Journal',
          model_id: manualJournal.id,
          media_id: mediaId,
        });
        bulkSaveMediaLink.push(oper);
      });

      await Promise.all([
        ...bulkSaveMediaLink,
        journal.deleteEntries(),
        journal.saveEntries(),
        journal.saveBalance(),
      ]);

      return res.status(200).send({});
    },
  },

  publishManualJournal: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const { ManualJournal, AccountTransaction, Account } = req.models;

      const { id } = req.params;
      const manualJournal = await ManualJournal.query().where('id', id).first();

      if (!manualJournal) {
        return res.status(404).send({
          errors: [{ type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100 }],
        });
      }
      if (manualJournal.status) {
        return res.status(400).send({
          errors: [{ type: 'MANUAL.JOURNAL.PUBLISHED.ALREADY', code: 200 }],
        });
      }
      const updateJournalTransactionOper = ManualJournal.query()
        .where('id', manualJournal.id)
        .update({ status: 1 });

      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Journal', 'ManualJournal'])
        .where('reference_id', manualJournal.id)
        .withGraphFetched('account.type');

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.calculateEntriesBalanceChange();

      const updateAccountsTransactionsOper = AccountTransaction.query()
        .whereIn(
          'id',
          transactions.map((t) => t.id)
        )
        .update({ draft: 0 });

      await Promise.all([
        updateJournalTransactionOper,
        updateAccountsTransactionsOper,
        journal.saveBalance(),
      ]);
      return res.status(200).send({ id });
    },
  },

  getManualJournal: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const { ManualJournal, AccountTransaction } = req.models;

      const { id } = req.params;
      const manualJournal = await ManualJournal.query()
        .where('id', id)
        .withGraphFetched('media')
        .first();

      if (!manualJournal) {
        return res.status(404).send({
          errors: [{ type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100 }],
        });
      }
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Journal', 'ManualJournal'])
        .where('reference_id', manualJournal.id);

      return res.status(200).send({
        manual_journal: {
          ...manualJournal.toJSON(),
          entries: [...transactions],
        },
      });
    },
  },

  /**
   * Deletes manual journal transactions and associated
   * accounts transactions.
   */
  deleteManualJournal: {
    validation: [param('id').exists().isNumeric().toInt()],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const { id } = req.params;
      const {
        ManualJournal,
        AccountTransaction,
        MediaLink,
        Account,
      } = req.models;

      const manualJournal = await ManualJournal.query().where('id', id).first();

      if (!manualJournal) {
        return res.status(404).send({
          errors: [{ type: 'MANUAL.JOURNAL.NOT.FOUND', code: 100 }],
        });
      }
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Journal', 'ManualJournal'])
        .where('reference_id', manualJournal.id)
        .withGraphFetched('account.type');

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.removeEntries();

      await MediaLink.query()
        .where('model_name', 'Journal')
        .where('model_id', manualJournal.id)
        .delete();

      await ManualJournal.query().where('id', manualJournal.id).delete();

      await Promise.all([journal.deleteEntries(), journal.saveBalance()]);
      return res.status(200).send({ id });
    },
  },

  recurringJournalsList: {
    validation: [
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('template_name').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
    },
  },

  quickJournalEntries: {
    validation: [
      check('date').exists().isISO8601(),
      check('amount').exists().isNumeric().toFloat(),
      check('credit_account_id').exists().isNumeric().toInt(),
      check('debit_account_id').exists().isNumeric().toInt(),
      check('transaction_type').exists(),
      check('note').optional(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const errorReasons = [];
      const form = { ...req.body };
      const { Account } = req.models;

      const foundAccounts = await Account.query()
        .where('id', form.credit_account_id)
        .orWhere('id', form.debit_account_id);

      const creditAccount = foundAccounts.find(
        (a) => a.id === form.credit_account_id
      );
      const debitAccount = foundAccounts.find(
        (a) => a.id === form.debit_account_id
      );

      if (!creditAccount) {
        errorReasons.push({ type: 'CREDIT_ACCOUNT.NOT.EXIST', code: 100 });
      }
      if (!debitAccount) {
        errorReasons.push({ type: 'DEBIT_ACCOUNT.NOT.EXIST', code: 200 });
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }

      // const journalPoster = new JournalPoster();
      // const journalCredit = new JournalEntry({
      //   debit:
      //   account: debitAccount.id,
      //   referenceId:
      // })

      return res.status(200).send();
    },
  },

  /**
   * Deletes bulk manual journals.
   */
  deleteBulkManualJournals: {
    validation: [
      query('ids').isArray({ min: 1 }),
      query('ids.*').isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error',
          ...validationErrors,
        });
      }
      const filter = { ...req.query };
      const {
        ManualJournal,
        AccountTransaction,
        Account,
        MediaLink,
      } = req.models;

      const manualJournals = await ManualJournal.query().whereIn(
        'id',
        filter.ids
      );

      const notFoundManualJournals = difference(
        filter.ids,
        manualJournals.map((m) => m.id)
      );

      if (notFoundManualJournals.length > 0) {
        return res.status(404).send({
          errors: [{ type: 'MANUAL.JOURNAL.NOT.FOUND', code: 200 }],
        });
      }
      const transactions = await AccountTransaction.query()
        .whereIn('reference_type', ['Journal', 'ManualJournal'])
        .whereIn('reference_id', filter.ids);

      const accountsDepGraph = await Account.depGraph().query().remember();
      const journal = new JournalPoster(accountsDepGraph);

      journal.loadEntries(transactions);
      journal.removeEntries();

      await MediaLink.query()
        .where('model_name', 'Journal')
        .whereIn('model_id', filter.ids)
        .delete();

      await ManualJournal.query().whereIn('id', filter.ids).delete();

      await Promise.all([journal.deleteEntries(), journal.saveBalance()]);
      return res.status(200).send({ ids: filter.ids });
    },
  },
};
