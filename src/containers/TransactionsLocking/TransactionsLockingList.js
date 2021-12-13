import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import clsx from 'classnames';
import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import { TransactionLockingContent } from './components';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

const DataTest = [
  {
    isEnabled: true,
    name: 'sales',
    module: 'sales',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do',
  },
  {
    isEnabled: false,
    name: 'purchases',
    module: 'purchases',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do',
  },
  {
    isEnabled: false,
    name: 'financial',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do',
  },
];

function Paragraph({ className, children }) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}

function TransactionsLockingList({ items }) {
  return items.map(({ isEnabled, name, description }) => (
    <TransactionLockingContent
      name={name}
      description={description}
      isEnabled={isEnabled}
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
  // Handle switch transactions locking.
  const handleSwitchTransactionsLocking = () => {
    openDialog('locking-transactions', {});
  };

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
          Lock All Transactions At Once.{' '}
          <Link to={'/'}> {''}Lock All Transactions At Once →</Link>
        </TransactionsLockingParagraph>

        <TransactionsLockingList items={DataTest} />
      </TransactionsLocking>
    </TransactionsLockingProvider>
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
