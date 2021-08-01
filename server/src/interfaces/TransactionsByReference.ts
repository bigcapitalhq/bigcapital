

export interface ITransactionsByReferenceQuery {
  referenceType: string;
  referenceId: string;
}

export interface ITransactionsByReferenceAmount {
    amount: number;
    formattedAmount: string;
    currencyCode: string;
}

export interface ITransactionsByReferenceTransaction{
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
}