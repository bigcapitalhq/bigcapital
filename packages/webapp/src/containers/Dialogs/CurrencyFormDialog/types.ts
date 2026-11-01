import type {
  CreateCurrencyBody,
  Currency,
  EditCurrencyBody,
} from '@bigcapital/sdk-ts';

export interface CurrencyFormValues {
  currencyName: string;
  currencyCode: string;
  currencySign: string;
}

export type CurrencyFormDialogPayload = {
  action?: string;
  currency?: Currency;
};

export type CurrencyFormContextValue = {
  createCurrencyMutate: (values: CreateCurrencyBody) => Promise<unknown>;
  editCurrencyMutate: (vars: [number, EditCurrencyBody]) => Promise<unknown>;
  dialogName: string;
  currency: Currency | undefined;
  isEditMode: boolean;
};
