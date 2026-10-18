export interface ITransactionsByReferenceQuery {
  referenceType: string;
  referenceId: string;
}

export interface ITransactionsByReferenceAmount {
  amount: number;
  formattedAmount: string;
  currencyCode: string;
}

interface ITransactionsByReferenceDate {
  formattedDate: string;
  date: Date;
}

export interface ITransactionsByReferenceTransaction {
  date: ITransactionsByReferenceDate;

  credit: ITransactionsByReferenceAmount;
  debit: ITransactionsByReferenceAmount;

  contactType: string;
  formattedContactType: string;

  contactId: number;

  referenceType: string;
  formattedReferenceType: string;

  referenceId: number;

  accountName: string;
  accountCode: string;
  accountId: number;

  /**
   * The accounting basis of the entry (general, cash, accrual).
   */
  basis: string;
}

export interface ITransactionsByReferencePojo {
  transactions: ITransactionsByReferenceTransaction[];
}
