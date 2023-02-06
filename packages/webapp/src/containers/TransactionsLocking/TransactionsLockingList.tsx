// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Paragraph, FormattedMessage as T } from '@/components';
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
            <T id={'transactions_locking.long_description'} />
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
