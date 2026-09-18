import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import type { ApiError } from 'openapi-typescript-fetch';
import type { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import {
  AccountSelectModel,
  AccountsSelect,
  AppToaster,
  FFormGroup,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants';
import { useAccounts, usePlaidExchangeToken } from '@/hooks/query';
import { useDialogActions } from '@/hooks/state/dashboard';

type PlaidLinkAccount = PlaidLinkOnSuccessMetadata['accounts'][number];

export interface PlaidAccountsLinkPayload {
  publicToken: string;
  institutionId: string;
  institutionName: string;
  plaidAccounts: PlaidLinkAccount[];
}

interface PlaidAccountsLinkFormValues {
  links: Array<{ plaidAccountId: string; accountId: number }>;
}

// Selecting it keeps the default behaviour of creating a new account.
const CREATE_NEW_ACCOUNT_ID = 0;
const CREATE_NEW_ACCOUNT: AccountSelectModel = {
  id: CREATE_NEW_ACCOUNT_ID,
  name: 'Create a new account',
  code: '',
};

/**
 * Retrieves the account types that may receive the feeds of the given Plaid
 * account type, the same types the server accepts.
 * @param {string} plaidAccountType
 * @returns {string[]}
 */
const getLinkableAccountTypes = (plaidAccountType: string): string[] =>
  plaidAccountType === 'credit'
    ? [ACCOUNT_TYPE.CREDIT_CARD]
    : [ACCOUNT_TYPE.BANK, ACCOUNT_TYPE.CASH];

/**
 * Retrieves the select items of the given Plaid account: the create option
 * followed by the active, unlinked accounts of a matching type.
 */
const getLinkableAccounts = (
  accounts: AccountSelectModel[],
  plaidAccount: PlaidLinkAccount,
): AccountSelectModel[] => {
  const types = getLinkableAccountTypes(plaidAccount.type);

  return [
    CREATE_NEW_ACCOUNT,
    ...accounts.filter(
      (account) =>
        account.active &&
        !account.plaidAccountId &&
        types.includes(account.accountType as string),
    ),
  ];
};

const getPlaidAccountLabel = (plaidAccount: PlaidLinkAccount) =>
  plaidAccount.mask
    ? `${plaidAccount.name} ••${plaidAccount.mask}`
    : plaidAccount.name;

interface PlaidAccountsLinkDialogContentProps {
  dialogName: string;
  payload: PlaidAccountsLinkPayload;
}

export function PlaidAccountsLinkDialogContent({
  dialogName,
  payload,
}: PlaidAccountsLinkDialogContentProps) {
  const { publicToken, institutionId, institutionName, plaidAccounts } =
    payload;
  const { closeDialog } = useDialogActions();
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
  const { mutateAsync: exchangeToken } = usePlaidExchangeToken();

  const accountsItems = useMemo(
    () =>
      plaidAccounts.map((plaidAccount) =>
        getLinkableAccounts(
          (accounts ?? []) as AccountSelectModel[],
          plaidAccount,
        ),
      ),
    [accounts, plaidAccounts],
  );
  const initialValues: PlaidAccountsLinkFormValues = {
    links: plaidAccounts.map((plaidAccount) => ({
      plaidAccountId: plaidAccount.id,
      accountId: CREATE_NEW_ACCOUNT_ID,
    })),
  };

  const handleSubmit = (
    values: PlaidAccountsLinkFormValues,
    { setSubmitting }: FormikHelpers<PlaidAccountsLinkFormValues>,
  ) => {
    const links = values.links.filter(
      (link) => link.accountId !== CREATE_NEW_ACCOUNT_ID,
    );
    const accountsIds = links.map((link) => link.accountId);

    if (new Set(accountsIds).size !== accountsIds.length) {
      AppToaster.show({
        message: 'An account can be linked to one bank account only.',
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    exchangeToken({ publicToken, institutionId, accounts: links })
      .then(() => {
        AppToaster.show({
          message:
            'The bank has been connected. Its transactions will appear shortly.',
          intent: Intent.SUCCESS,
        });
        closeDialog(dialogName);
      })
      .catch((error: ApiError) => {
        // The public token is spent once exchanged, so a rejected link needs
        // a new Plaid Link session rather than a retry.
        const message =
          error?.data?.errors?.[0]?.message || 'Something went wrong.';

        AppToaster.show({
          message: `${message} Please connect the bank again.`,
          intent: Intent.DANGER,
        });
        closeDialog(dialogName);
      });
  };

  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div className={Classes.DIALOG_BODY}>
            <p>
              Choose where the transactions of each {institutionName} account
              go. Link an account you already keep to continue its history, or
              create a new one.
            </p>
            <p className={Classes.TEXT_MUTED}>
              Imported transactions can overlap ones already recorded in a
              linked account. Exclude those from its Uncategorized tab.
            </p>

            {plaidAccounts.map((plaidAccount, index) => (
              <FFormGroup
                key={plaidAccount.id}
                name={`links[${index}].accountId`}
                label={getPlaidAccountLabel(plaidAccount)}
                inline
              >
                <AccountsSelect
                  name={`links[${index}].accountId`}
                  items={accountsItems[index]}
                  disabled={isAccountsLoading}
                  fill
                />
              </FFormGroup>
            ))}
          </div>

          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                intent={Intent.NONE}
                onClick={handleCancelBtnClick}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                loading={isSubmitting}
                disabled={isAccountsLoading}
              >
                Connect
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
