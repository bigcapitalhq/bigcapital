import * as moment from 'moment';
import { AccountTransaction } from "../Accounts/models/AccountTransaction.model";
import { ILedgerEntry } from "./types/Ledger.types";

export const transformLedgerEntryToTransaction = (
  entry: ILedgerEntry
): Partial<AccountTransaction> => {
  return {
    date: moment(entry.date).toDate(),

    credit: entry.credit,
    debit: entry.debit,

    currencyCode: entry.currencyCode,
    exchangeRate: entry.exchangeRate,

    accountId: entry.accountId,
    contactId: entry.contactId,

    referenceType: entry.transactionType,
    referenceId: entry.transactionId,

    transactionNumber: entry.transactionNumber,
    transactionType: entry.transactionSubType,

    referenceNumber: entry.referenceNumber,

    note: entry.note,

    index: entry.index,
    indexGroup: entry.indexGroup,

    branchId: entry.branchId,
    userId: entry.userId,
    itemId: entry.itemId,
    projectId: entry.projectId,

    costable: entry.costable,

    taxRateId: entry.taxRateId,
    taxRate: entry.taxRate,
  };
};
