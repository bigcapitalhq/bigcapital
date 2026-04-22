// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Intent,
  Classes,
  Button,
  Dialog,
  FormGroup,
  TextArea,
  HTMLSelect,
  Spinner,
} from '@blueprintjs/core';
import { AppToaster } from '@/components';
import { AccountsSelect } from '@/components/Accounts';
import {
  useEditCategorizeTransaction,
  useCashflowTransaction,
} from '@/hooks/query';
import { useAccounts } from '@/hooks/query';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { compose } from '@/utils';

const TRANSACTION_TYPES = [
  { value: 'OtherIncome', label: 'Other Income' },
  { value: 'OtherExpense', label: 'Other Expense' },
  { value: 'OwnerContribution', label: 'Owner Contribution' },
  { value: 'OwnerDrawing', label: 'Owner Drawings' },
  { value: 'TransferToAccount', label: 'Transfer to Account' },
  { value: 'TransferFromAccount', label: 'Transfer from Account' },
];

const CATEGORY_ACCOUNT_ROOT_TYPES = {
  OtherIncome: ['income'],
  OtherExpense: ['expense'],
  OwnerContribution: ['equity'],
  OwnerDrawing: ['equity'],
  TransferToAccount: ['asset'],
  TransferFromAccount: ['asset'],
};

function EditCategorizationAlert({
  name,
  isOpen,
  payload: { uncategorizedTransactionId, cashflowTransactionId },
  closeAlert,
}) {
  const { data: transaction, isLoading: isTransactionLoading } =
    useCashflowTransaction(cashflowTransactionId, {
      enabled: isOpen && !!cashflowTransactionId,
    });

  const { data: accounts, isLoading: isAccountsLoading } = useAccounts(
    {},
    { enabled: isOpen },
  );

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [transactionType, setTransactionType] = useState('');
  const [desc, setDesc] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Pre-fill form when transaction data loads.
  useEffect(() => {
    if (transaction && !initialized) {
      setSelectedAccountId(transaction.credit_account_id || null);
      setTransactionType(transaction.transaction_type || '');
      setDesc(transaction.description || '');
      setInitialized(true);
    }
  }, [transaction, initialized]);

  // Reset initialized state when dialog closes.
  useEffect(() => {
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen]);

  const { mutateAsync: editCategorization, isLoading: isSaving } =
    useEditCategorizeTransaction();

  const handleClose = () => {
    closeAlert(name);
  };

  const handleTypeChange = (e) => {
    setTransactionType(e.target.value);
    setSelectedAccountId(null);
  };

  const handleSave = () => {
    editCategorization({
      id: uncategorizedTransactionId,
      creditAccountId: selectedAccountId,
      transactionType,
      description: desc,
    })
      .then(() => {
        AppToaster.show({
          message: 'Categorization updated successfully.',
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(() => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  const accountRootTypes = CATEGORY_ACCOUNT_ROOT_TYPES[transactionType] || [];

  return (
    <Dialog
      title="Edit Categorization"
      isOpen={isOpen}
      onClose={handleClose}
      style={{ width: 420 }}
    >
      <div className={Classes.DIALOG_BODY}>
        {isTransactionLoading ? (
          <Spinner size={30} />
        ) : (
          <>
            <FormGroup label="Transaction Type" labelFor="transaction-type">
              <HTMLSelect
                id="transaction-type"
                fill={true}
                value={transactionType}
                onChange={handleTypeChange}
                options={TRANSACTION_TYPES}
              />
            </FormGroup>
            <FormGroup label="Category Account" labelFor="credit-account">
              <AccountsSelect
                name="creditAccountId"
                items={accounts || []}
                filterByRootTypes={accountRootTypes}
                value={selectedAccountId}
                onItemSelect={(account) => setSelectedAccountId(account.id)}
                popoverProps={{ minimal: true }}
                fill={true}
              />
            </FormGroup>
            <FormGroup label="Description" labelFor="description">
              <TextArea
                id="description"
                fill={true}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
              />
            </FormGroup>
          </>
        )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            onClick={handleSave}
            loading={isSaving}
            disabled={isTransactionLoading || isAccountsLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(EditCategorizationAlert);
