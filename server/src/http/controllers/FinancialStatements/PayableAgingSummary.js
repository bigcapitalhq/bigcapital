import express from 'express';
import { query } from 'express-validator';
import { difference } from 'lodash';
import JournalPoster from '@/services/Accounting/JournalPoster';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import AgingReport from '@/http/controllers/FinancialStatements/AgingReport';
import moment from 'moment';

export default class PayableAgingSummary extends AgingReport {
  /**
   * Router constructor.
   */
  static router() {
    const router = express.Router();

    router.get(
      '/',
      this.payableAgingSummaryRoles(),
      this.validateResults,
      asyncMiddleware(this.validateVendorsIds.bind(this)),
      asyncMiddleware(this.payableAgingSummary.bind(this))
    );
    return router;
  }

  /**
   * Validates the report vendors ids query.
   */
  static async validateVendorsIds(req, res, next) {
    const { Vendor } = req.models;

    const filter = {
      vendors_ids: [],
      ...req.query,
    };
    if (!Array.isArray(filter.vendors_ids)) {
      filter.vendors_ids = [filter.vendors_ids];
    }
    if (filter.vendors_ids.length > 0) {
      const storedCustomers = await Vendor.query().whereIn(
        'id',
        filter.vendors_ids
      );
      const storedCustomersIds = storedCustomers.map((c) => c.id);
      const notStoredCustomersIds = difference(
        storedCustomersIds,
        filter,
        vendors_ids
      );
      if (notStoredCustomersIds.length) {
        return res.status(400).send({
          errors: [{ type: 'VENDORS.IDS.NOT.FOUND', code: 300 }],
        });
      }
    }
    next();
  }

  /**
   * Receivable aging summary validation roles.
   */
  static payableAgingSummaryRoles() {
    return [
      query('as_date').optional().isISO8601(),
      query('aging_days_before').optional().isNumeric().toInt(),
      query('aging_periods').optional().isNumeric().toInt(),
      query('number_format.no_cents').optional().isBoolean().toBoolean(),
      query('number_format.1000_divide').optional().isBoolean().toBoolean(),
      query('vendors_ids.*').isNumeric().toInt(),
      query('none_zero').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve payable aging summary report.
   */
  static async payableAgingSummary(req, res) {
    const { Customer, Account, AccountTransaction, AccountType } = req.models;
    const storedVendors = await Customer.query();

    const filter = {
      as_date: moment().format('YYYY-MM-DD'),
      aging_days_before: 30,
      aging_periods: 3,
      number_format: {
        no_cents: false,
        divide_1000: false,
      },
      ...req.query,
    };
    const accountsReceivableType = await AccountType.query()
      .where('key', 'accounts_payable')
      .first();

    const accountsReceivable = await Account.query()
      .where('account_type_id', accountsReceivableType.id)
      .remember()
      .first();

    const transactions = await AccountTransaction.query()
      .modify('filterDateRange', null, filter.as_date)
      .where('account_id', accountsReceivable.id)
      .remember();

    const journalPoster = new JournalPoster();
    journalPoster.loadEntries(transactions);

    const agingPeriods = this.agingRangePeriods(
      filter.as_date,
      filter.aging_days_before,
      filter.aging_periods
    );
    // Total amount formmatter based on the given query.
    const totalFormatter = formatNumberClosure(filter.number_format);

    const vendors = storedVendors.map((vendor) => {
      // Calculate the trial balance total of the given vendor.
      const vendorBalance = journalPoster.getContactTrialBalance(
        accountsReceivable.id,
        vendor.id,
        'vendor'
      );
      const agingClosingBalance = agingPeriods.map((agingPeriod) => {
        // Calculate the trial balance between the given date period.
        const agingTrialBalance = journalPoster.getContactTrialBalance(
          accountsReceivable.id,
          vendor.id,
          'vendor',
          agingPeriod.from_period
        );
        return {
          ...agingPeriod,
          closingBalance: agingTrialBalance.debit,
        };
      });
      const aging = this.contactAgingBalance(
        agingClosingBalance,
        vendorBalance.credit
      );
      return {
        vendor_name: vendor.displayName,
        aging: aging.map((item) => ({
          ...item,
          formatted_total: totalFormatter(item.total),
        })),
        total: vendorBalance.balance,
        formatted_total: totalFormatted(vendorBalance.balance),
      };
    });

    const agingClosingBalance = agingPeriods.map((agingPeriod) => {
      const closingTrialBalance = journalPoster.getContactTrialBalance(
        accountsReceivable.id,
        null,
        'vendor',
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
      'vendor'
    );
    const agingTotal = this.contactAgingBalance(
      agingClosingBalance,
      totalClosingBalance.credit
    );

    return res.status(200).send({
      columns: [ ...agingPeriods ],
      aging: {
        vendors,
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
