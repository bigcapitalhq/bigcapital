import {
  AnchorButton,
  Button,
  Callout,
  Checkbox,
  Classes,
  FormGroup,
  HTMLSelect,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import {
  buildInitialSelections,
  getSimpleFinErrorMessage,
  type SimpleFinAccountSelection,
  type SimpleFinLinkableAccountType,
} from './utils';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { SimpleFinClaimedAccount } from '@bigcapital/sdk-ts';
import { AppToaster, FormattedMessage as T } from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import {
  useSimpleFinClaimToken,
  useSimpleFinDeleteItem,
  useSimpleFinLinkAccounts,
} from '@/hooks/query/banking';
import { formattedAmount } from '@/utils';

const SIMPLEFIN_BRIDGE_URL = 'https://beta-bridge.simplefin.org/';

type Step = 'token' | 'accounts';

interface SimpleFinConnectDialogContentProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {
  dialogName: string;
}

const ACCOUNT_TYPE_OPTIONS: Array<{
  value: SimpleFinLinkableAccountType;
  labelId: string;
}> = [
  {
    value: ACCOUNT_TYPE.BANK as 'bank',
    labelId: 'simplefin.account_type.bank',
  },
  {
    value: ACCOUNT_TYPE.CREDIT_CARD as 'credit-card',
    labelId: 'simplefin.account_type.credit_card',
  },
];

/**
 * SimpleFIN connect dialog content: paste the setup token, then pick the
 * accounts to link and their account type.
 */
function SimpleFinConnectDialogContentInner({
  dialogName,
  closeDialog,
}: SimpleFinConnectDialogContentProps) {
  const [step, setStep] = useState<Step>('token');
  const [setupToken, setSetupToken] = useState('');
  const [itemId, setItemId] = useState<string | null>(null);
  const [selections, setSelections] = useState<SimpleFinAccountSelection[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: claimToken, isPending: isClaiming } =
    useSimpleFinClaimToken();
  const { mutateAsync: linkAccounts, isPending: isLinking } =
    useSimpleFinLinkAccounts();
  const { mutateAsync: deleteItem, isPending: isDeleting } =
    useSimpleFinDeleteItem();

  const selectedCount = selections.filter((s) => s.selected).length;

  // Claims the setup token and moves to the accounts selection step.
  const handleClaimToken = async () => {
    setErrorMessage(null);

    if (!setupToken.trim()) {
      setErrorMessage(intl.get('simplefin.error.setup_token_required'));
      return;
    }
    try {
      const result = await claimToken({ setupToken: setupToken.trim() });
      const accounts = (result?.accounts ?? []) as SimpleFinClaimedAccount[];

      setItemId(result.itemId);
      setSelections(buildInitialSelections(accounts));
      setStep('accounts');
    } catch (error) {
      setErrorMessage(
        getSimpleFinErrorMessage(error, intl.get('simplefin.error.generic')),
      );
    }
  };

  // Creates the bank/credit card accounts for the selected SimpleFIN accounts.
  const handleLinkAccounts = async () => {
    if (!itemId) return;
    setErrorMessage(null);

    const accounts = selections
      .filter((s) => s.selected)
      .map((s) => ({ accountId: s.account.id, accountType: s.accountType }));

    if (accounts.length === 0) {
      setErrorMessage(intl.get('simplefin.error.select_at_least_one'));
      return;
    }
    try {
      await linkAccounts({ itemId, accounts });
      AppToaster.show({
        message: intl.get('simplefin.success.accounts_linked', {
          count: accounts.length,
        }),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    } catch (error) {
      setErrorMessage(
        getSimpleFinErrorMessage(error, intl.get('simplefin.error.generic')),
      );
    }
  };

  // Cancelling after the token was claimed removes the unused connection so
  // the consumed setup token does not leave an orphan item behind.
  const handleCancel = async () => {
    if (itemId) {
      try {
        await deleteItem(itemId);
      } catch {
        // Best effort: the item can be cleaned up later, do not block closing.
      }
    }
    closeDialog(dialogName);
  };

  const toggleSelected = (index: number, selected: boolean) => {
    setSelections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected } : s)),
    );
  };
  const changeAccountType = (
    index: number,
    accountType: SimpleFinLinkableAccountType,
  ) => {
    setSelections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, accountType } : s)),
    );
  };

  const isBusy = isClaiming || isLinking || isDeleting;

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        {step === 'token' && (
          <>
            <p className={Classes.TEXT_MUTED}>
              <T id={'simplefin.dialog.intro'} />
            </p>
            <ol className={Classes.TEXT_MUTED} style={{ paddingLeft: 18 }}>
              <li>
                <T id={'simplefin.dialog.step_1'} />{' '}
                <a
                  href={SIMPLEFIN_BRIDGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SIMPLEFIN_BRIDGE_URL}
                </a>
              </li>
              <li>
                <T id={'simplefin.dialog.step_2'} />
              </li>
              <li>
                <T id={'simplefin.dialog.step_3'} />
              </li>
            </ol>

            <FormGroup
              label={<T id={'simplefin.dialog.setup_token'} />}
              labelInfo={<T id={'required'} />}
              helperText={<T id={'simplefin.dialog.setup_token_hint'} />}
            >
              <TextArea
                fill={true}
                growVertically={false}
                rows={4}
                value={setupToken}
                autoFocus={true}
                placeholder={intl.get(
                  'simplefin.dialog.setup_token_placeholder',
                )}
                onChange={(e) => setSetupToken(e.target.value)}
                disabled={isBusy}
                data-testid="simplefin-setup-token"
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
            </FormGroup>
          </>
        )}

        {step === 'accounts' && (
          <>
            <p className={Classes.TEXT_MUTED}>
              <T id={'simplefin.dialog.select_accounts_intro'} />
            </p>

            {selections.length === 0 ? (
              <Callout intent={Intent.WARNING}>
                <T id={'simplefin.dialog.no_accounts_found'} />
              </Callout>
            ) : (
              <SimpleFinAccountsTable
                selections={selections}
                disabled={isBusy}
                onToggle={toggleSelected}
                onTypeChange={changeAccountType}
              />
            )}
          </>
        )}

        {errorMessage && (
          <Callout intent={Intent.DANGER} style={{ marginTop: 12 }}>
            {errorMessage}
          </Callout>
        )}
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancel} disabled={isBusy} loading={isDeleting}>
            <T id={'cancel'} />
          </Button>

          {step === 'token' && (
            <Button
              intent={Intent.PRIMARY}
              onClick={handleClaimToken}
              loading={isClaiming}
              disabled={isBusy}
              data-testid="simplefin-claim-token"
            >
              <T id={'simplefin.dialog.connect'} />
            </Button>
          )}

          {step === 'accounts' && (
            <Button
              intent={Intent.PRIMARY}
              onClick={handleLinkAccounts}
              loading={isLinking}
              disabled={isBusy || selectedCount === 0}
              data-testid="simplefin-link-accounts"
            >
              {intl.get('simplefin.dialog.link_accounts', {
                count: selectedCount,
              })}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

interface SimpleFinAccountsTableProps {
  selections: SimpleFinAccountSelection[];
  disabled: boolean;
  onToggle: (index: number, selected: boolean) => void;
  onTypeChange: (index: number, type: SimpleFinLinkableAccountType) => void;
}

/**
 * Lists the SimpleFIN accounts with a selection checkbox and type picker.
 */
function SimpleFinAccountsTable({
  selections,
  disabled,
  onToggle,
  onTypeChange,
}: SimpleFinAccountsTableProps) {
  return (
    <table
      className={`${Classes.HTML_TABLE} ${Classes.HTML_TABLE_CONDENSED}`}
      style={{ width: '100%' }}
    >
      <thead>
        <tr>
          <th style={{ width: 32 }} />
          <th>
            <T id={'simplefin.dialog.column_account'} />
          </th>
          <th style={{ textAlign: 'right' }}>
            <T id={'simplefin.dialog.column_balance'} />
          </th>
          <th style={{ width: 150 }}>
            <T id={'simplefin.dialog.column_type'} />
          </th>
        </tr>
      </thead>
      <tbody>
        {selections.map(({ account, selected, accountType }, index) => (
          <tr key={account.id}>
            <td>
              <Checkbox
                checked={selected}
                disabled={disabled}
                onChange={(e) =>
                  onToggle(index, (e.target as HTMLInputElement).checked)
                }
                data-testid={`simplefin-account-${account.id}`}
              />
            </td>
            <td>
              <div>{account.name}</div>
              {account.connectionName && (
                <div className={Classes.TEXT_MUTED} style={{ fontSize: 12 }}>
                  {account.connectionName}
                </div>
              )}
            </td>
            <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
              {formattedAmount(account.balance, account.currency)}
            </td>
            <td>
              <HTMLSelect
                fill={true}
                value={accountType}
                disabled={disabled || !selected}
                onChange={(e) =>
                  onTypeChange(
                    index,
                    e.currentTarget.value as SimpleFinLinkableAccountType,
                  )
                }
                options={ACCOUNT_TYPE_OPTIONS.map((option) => ({
                  value: option.value,
                  label: intl.get(option.labelId),
                }))}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const SimpleFinConnectDialogContent = FF.pipe(
  SimpleFinConnectDialogContentInner,
  withDialogActions,
);

// Re-exported for the connect menu so it can open the SimpleFIN Bridge site.
export { AnchorButton as SimpleFinBridgeLink, SIMPLEFIN_BRIDGE_URL };
