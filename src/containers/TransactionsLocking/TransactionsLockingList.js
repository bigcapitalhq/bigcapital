import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'classnames';
import { Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import * as R from 'ramda';

import { Alert } from 'components';
import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import { TransactionLockingContent } from './components';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';

function Paragraph({ className, children }) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}

function TransactionsLockingList({ items, onlock, onUnlock, onUnlockPartial }) {
  return items.map(({ is_enabled, formatted_module, description }) => (
    <TransactionLockingContent
      name={formatted_module}
      description={description}
      isEnabled={is_enabled}
      onLock={onlock}
      onUnlockPartial={onUnlockPartial}
      onEditLock={onUnlock}
    />
  ));
}

/**
 * Transactions locking list.
 */
function TransactionsLockingListPage({
  // #withDialogActions
  openDialog,
}) {
  // Handle locking transactions.
  const handleLockingTransactions = () => {
    openDialog('locking-transactions', {});
  };

  // Handle unlocking transactions
  const handleUnlockTransactions = () => {
    openDialog('unlocking-transactions', {});
  };
  // Handle unlocking transactions
  const handleUnlockingPartial = () => {
    openDialog('unlocking-partial-transactions', {});
  };

  const {
    transactionsLocking: { modules },
  } = useTransactionsLockingContext();

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

          <LockAllAlert
            title={'Lock All Transactions At Once.'}
            intent={Intent.PRIMARY}
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Link to={'/'}>Lock All Transactions At Once →</Link>
          </LockAllAlert>
        </TransactionsLockingParagraph>

        <TransactionsLockingList
          items={modules}
          onlock={handleLockingTransactions}
          onUnlock={handleUnlockTransactions}
          onUnlockPartial={handleUnlockingPartial}
        />
      </TransactionsLocking>
    </TransactionsLockingProvider>
  );
}
export default R.compose(withDialogActions)(TransactionsLockingListPage);

const TransactionsLocking = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px 40px;
  max-width: 800px;
`;

const TransactionsLockingParagraph = styled(Paragraph)`
  margin-bottom: 25px;
`;

const TransLockingTitle = styled.h2`
  margin-bottom: 12px;
`;

const TransLockingDesc = styled.p``;

const LockAllAlert = styled(Alert)`
  margin-bottom: 0;
  margin-top: 20px;
  background: transparent;
`;
