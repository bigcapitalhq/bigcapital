import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import { TransactionLockingContent } from './components';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

/**
 * Transactions locking list.
 */
function TransactionsLockingList({
  // #withDialogActions
  openDialog,
}) {
  // Handle switch transactions locking.
  const handleSwitchTransactionsLocking = () => {
    openDialog('transactions-locking', {});
  };

  const DataTest = [
    {
      name: 'sales',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do',
    },
    {
      name: 'purchases',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do',
    },
    {
      name: 'financial',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do',
    },
  ];

  return (
    <TransactionsLockingProvider>
      <TransactionsLocking>
        <TransactionsLockingParagraph>
          <h2>Transaction Locking</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, <br />
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          Lock All Transactions At Once.
          <Link to={'/'}> {''}Lock All Transactions At Once. </Link>
        </TransactionsLockingParagraph>

        {DataTest.map(({ name, description }) => (
          <TransactionLockingContent
            name={name}
            description={description}
            onSwitch={handleSwitchTransactionsLocking}
          />
        ))}
      </TransactionsLocking>
    </TransactionsLockingProvider>
  );
}
export default compose(withDialogActions)(TransactionsLockingList);

const TransactionsLocking = styled.div`
  display: flex;
  flex-direction: column;
  margin: 22px 32px;
`;

const TransactionsLockingParagraph = styled.div`
  line-height: 1.5rem;
  font-size: 16px;
  h2 {
    margin-bottom: 12px;
  }
`;
