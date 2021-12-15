import React from 'react';
import styled from 'styled-components';

import { Paragraph } from 'components';
import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import { TransactionsLockingHeader } from './TransactionsLockingHeader';
import { TransactionsLockingBody } from './TransactionsLockingBody';

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
          <TransactionsLockingHeader />
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
  min-width: 800px;
  max-width: 900px;
  width: 75%;
`;

const TransactionsLockingParagraph = styled(Paragraph)`
  margin-bottom: 25px;
`;

const TransLockingDesc = styled.p``;
