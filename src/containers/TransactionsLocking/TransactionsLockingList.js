import React from 'react';
import clsx from 'classnames';
import { Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import * as R from 'ramda';

import { Alert, ButtonLink } from 'components';
import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import {
  TransactionLockingContent,
  TransactionLockingItemLoading,
} from './components';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

function Paragraph({ className, children }) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}

function TransactionsLockingList({ items, onlock, onUnlock, onUnlockPartial }) {
  return items.map(({ is_enabled, module, formatted_module, description }) => (
    <TransactionLockingContent
      name={formatted_module}
      module={module}
      description={description}
      isEnabled={is_enabled}
      onLock={onlock}
      onUnlockPartial={onUnlockPartial}
      onEditLock={onlock}
    />
  ));
}

function TransactionsLockingFull({ onLock, onUnlock, onUnlockPartial }) {
  const {
    transactionsLocking: { all },
  } = useTransactionsLockingContext();

  return (
    <TransactionLockingContent
      name={all.formatted_module}
      description={all.description}
      isEnabled={all.is_enabled}
      onLock={onLock}
      onUnlockPartial={onUnlockPartial}
      onEditLock={onUnlock}
    />
  );
}

function TransactionLockingSkeletonList() {
  return (
    <>
      <TransactionLockingItemLoading />
      <TransactionLockingItemLoading />
      <TransactionLockingItemLoading />
    </>
  );
}

function TransactionsLockingAlert() {
  const { transactionLockingType, setTransactionLockingType } =
    useTransactionsLockingContext();

  // Handle all lock link click.
  const handleAllLockClick = () => {
    setTransactionLockingType('all');
  };

  const handleUndividualLockClick = () => {
    setTransactionLockingType('partial');
  };

  return transactionLockingType !== 'all' ? (
    <LockAllAlert
      title={'Lock All Transactions At Once.'}
      intent={Intent.PRIMARY}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <ButtonLink onClick={handleAllLockClick}>
        Lock All Transactions At Once →
      </ButtonLink>
    </LockAllAlert>
  ) : (
    <LockAllAlert title={'Lock Individual Modules'} intent={Intent.PRIMARY}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <ButtonLink onClick={handleUndividualLockClick}>
        Lock Modules Individually →
      </ButtonLink>
    </LockAllAlert>
  );
}

function TransactionsLockingBodyJsx({
  // #withDialogActions
  openDialog,
}) {
  const {
    transactionsLocking: { modules },
    isTransactionLockingLoading,

    transactionLockingType,
  } = useTransactionsLockingContext();

  // Handle locking transactions.
  const handleLockingTransactions = (module) => {
    openDialog('locking-transactions', { module: module });
  };

  // Handle unlocking transactions
  const handleUnlockTransactions = (module) => {
    openDialog('unlocking-transactions', { module: module });
  };
  // Handle unlocking transactions
  const handleUnlockingPartial = (module) => {
    openDialog('unlocking-partial-transactions', { module: module });
  };

  return !isTransactionLockingLoading ? (
    transactionLockingType === 'partial' ? (
      <TransactionsLockingList
        items={modules}
        onlock={handleLockingTransactions}
        onUnlock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
      />
    ) : (
      <TransactionsLockingFull />
    )
  ) : (
    <TransactionLockingSkeletonList />
  );
}

const TransactionsLockingBody = R.compose(withDialogActions)(
  TransactionsLockingBodyJsx,
);

/**
 * Transactions locking list.
 */
export default function TransactionsLockingListPage() {
  return (
    <TransactionsLockingProvider>
      <TransactionsLocking>
        <TransactionsLockingParagraph>
          <TransLockingDesc>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
            ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </TransLockingDesc>
          <TransactionsLockingAlert />
        </TransactionsLockingParagraph>

        <TransactionsLockingBody />
      </TransactionsLocking>
    </TransactionsLockingProvider>
  );
}
const TransactionsLocking = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 40px;
  max-width: 800px;
`;

const TransactionsLockingParagraph = styled(Paragraph)`
  margin-bottom: 25px;
`;

const TransLockingDesc = styled.p``;

const LockAllAlert = styled(Alert)`
  margin-bottom: 0;
  margin-top: 20px;
  background: transparent;
`;
