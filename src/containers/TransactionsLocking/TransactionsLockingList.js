import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import clsx from 'classnames';
import { TransactionLockingContent } from './components';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import { compose } from 'utils';

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
    <TransactionsLocking>
      <TransactionsLockingParagraph>
        <TransLockingDesc>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
          ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </TransLockingDesc>
        Lock All Transactions At Once.{' '}
        <Link to={'/'}> {''}Lock All Transactions At Once →</Link>
      </TransactionsLockingParagraph>

      <TransactionsLockingList
        items={modules}
        onlock={handleLockingTransactions}
        onUnlock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
      />
    </TransactionsLocking>
  );
}
export default compose(withDialogActions)(TransactionsLockingListPage);

const TransactionsLocking = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  max-width: 800px;
`;

const TransactionsLockingParagraph = styled(Paragraph)`
  margin-bottom: 25px;
`;

const TransLockingTitle = styled.h2`
  margin-bottom: 12px;
`;

const TransLockingDesc = styled.p``;
