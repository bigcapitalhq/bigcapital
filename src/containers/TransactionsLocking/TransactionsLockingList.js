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

function Paragraph({ className, children }) {
  return <p className={clsx('paragraph', className)}>{children}</p>;
}

/**
 * Transactions locking list.
 */
function TransactionsLockingList({
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
  padding: 32px;
  max-width: 700px;
`;

const TransactionsLockingParagraph = styled(Paragraph)`
  margin-bottom: 30px;
`;

const TransLockingTitle = styled.h2`
  margin-bottom: 12px;
`;

const TransLockingDesc = styled.p``;
