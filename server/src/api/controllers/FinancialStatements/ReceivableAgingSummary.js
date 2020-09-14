import express from 'express';
import { query, oneOf } from 'express-validator';
import { difference } from 'lodash';
import JournalPoster from 'services/Accounting/JournalPoster';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import AgingReport from 'api/controllers/FinancialStatements/AgingReport';
import moment from 'moment';

export default class ReceivableAgingSummary extends AgingReport {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.get(
      '/',
      this.receivableAgingSummaryRoles,
      this.validateResults,
      asyncMiddleware(this.validateCustomersIds.bind(this)),
      asyncMiddleware(this.receivableAgingSummary.bind(this))
    );
    return router;
  }

  /**
   * Validates the report customers ids query.
   */
  static async validateCustomersIds(req, res, next) {
    const { Customer } = req.models;

    const filter = {
      customer_ids: [],
      ...req.query,
    };
    if (!Array.isArray(filter.customer_ids)) {
      filter.customer_ids = [filter.customer_ids];
    }
    if (filter.customer_ids.length > 0) {
      const storedCustomers = await Customer.query().whereIn(
        'id',
        filter.customer_ids
      );
      const storedCustomersIds = storedCustomers.map((c) => parseInt(c.id, 10));
      const notStoredCustomersIds = difference(
        filter.customer_ids.map(a => parseInt(a, 10)),
        storedCustomersIds
      );

      if (notStoredCustomersIds.length) {
        return res.status(400).send({
          errors: [
            {
              type: 'CUSTOMERS.IDS.NOT.FOUND',
              code: 300,
              ids: notStoredCustomersIds,
            },
          ],
        });
      }
    }
    next();
  }

  /**
   * Receivable aging summary validation roles.
   */
  static get receivableAgingSummaryRoles() {
    return [
      query('as_date').optional().isISO8601(),
      query('aging_days_before').optional().isNumeric().toInt(),
      query('aging_periods').optional().isNumeric().toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.1000_divide').optional().isBoolean().toBoolean(),
      oneOf(
        [
          query('customer_ids').optional().isArray({ min: 1 }),
          query('customer_ids.*').isNumeric().toInt(),
        ],
        [query('customer_ids').optional().isNumeric().toInt()]
      ),
      query('none_zero').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve receivable aging summary report.
   */
  static async receivableAgingSummary(req, res) {
    const { Customer, Account, AccountTransaction, AccountType } = req.models;
    
    const filter = {
      as_date: moment().format('YYYY-MM-DD'),
      aging_days_before: 30,
      aging_periods: 3,
      number_format: {
        no_cents: false,
        divide_1000: false,
      },
      customer_ids: [],
      none_zero: false,
      ...req.query,
    };
    if (!Array.isArray(filter.customer_ids)) {
      filter.customer_ids = [filter.customer_ids];
    }

    const storedCustomers = await Customer.query().onBuild((builder) => {
      if (filter.customer_ids.length > 0) {
        builder.modify('filterCustomerIds', filter.customer_ids);
      }
      return builder;
    });

    const accountsReceivableType = await AccountType.query()
      .where('key', 'accounts_receivable')
      .first();

    const accountsReceivable = await Account.query()
      .where('account_type_id', accountsReceivableType.id)
      .remember()
      .first();

    const transactions = await AccountTransaction.query().onBuild((query) => {
      query.modify('filterDateRange', null, filter.as_date)
      query.where('account_id', accountsReceivable.id)
      query.modify('filterContactType', 'customer');

      if (filter.customer_ids.length> 0) {
        query.modify('filterContactIds', filter.customer_ids)
      }
      query.remember();
      return query;
    });

    const journalPoster = new JournalPoster();
    journalPoster.loadEntries(transactions);

    const agingPeriods = this.agingRangePeriods(
      filter.as_date,
      filter.aging_days_before,
      filter.aging_periods
    );
    // Total amount formmatter based on the given query.
    const totalFormatter = this.formatNumberClosure(filter.number_format);

    const customers = storedCustomers.map((customer) => {
      // Calculate the trial balance total of the given customer.
      const customerBalance = journalPoster.getContactTrialBalance(
        accountsReceivable.id,
        customer.id,
        'customer'
      );
      const agingClosingBalance = agingPeriods.map((agingPeriod) => {
        // Calculate the trial balance between the given date period.
        const agingTrialBalance = journalPoster.getContactTrialBalance(
          accountsReceivable.id,
          customer.id,
          'customer',
          agingPeriod.from_period
        );
        return {
          ...agingPeriod,
          closingBalance: agingTrialBalance.debit,
        };
      });
      const aging = this.contactAgingBalance(
        agingClosingBalance,
        customerBalance.credit
      );
      return {
        customer_name: customer.displayName,
        aging: aging.map((item) => ({
          ...item,
          formatted_total: totalFormatter(item.total),
        })),
        total: customerBalance.balance,
        formatted_total: totalFormatter(customerBalance.balance),
      };
    });

    const agingClosingBalance = agingPeriods.map((agingPeriod) => {
      const closingTrialBalance = journalPoster.getContactTrialBalance(
        accountsReceivable.id,
        null,
        'customer',
        agingPeriod.from_period
      );
      return {
        ...agingPeriod,
        closingBalance: closingTrialBalance.balance,
      };
    });

    const totalClosingBalance = journalPoster.getContactTrialBalance(
      accountsReceivable.id,
      null,
      'customer'
    );
    const agingTotal = this.contactAgingBalance(
      agingClosingBalance,
      totalClosingBalance.credit
    );

    return res.status(200).send({
      columns: [...agingPeriods],
      aging: {
        customers,
        total: [
          ...agingTotal.map((item) => ({
            ...item,
            formatted_total: totalFormatter(item.total),
          })),
        ],
      },
    });
  }
}
