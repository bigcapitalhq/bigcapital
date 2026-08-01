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
  id?: number | null;
  currency?: string;
};

// `currency` arrives as a code string from the dialog payload (`payload.currency`),
// not a `Currency` object. Edit-mode code paths that read `.id` on it are broken
// at runtime — flagged in the form with `@ts-expect-error`.
export type CurrencyFormContextValue = {
  createCurrencyMutate: (values: CreateCurrencyBody) => Promise<unknown>;
  editCurrencyMutate: (vars: [number, EditCurrencyBody]) => Promise<unknown>;
  dialogName: string;
  currency: string | Currency | undefined;
  isEditMode: boolean | string;
};
