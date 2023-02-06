// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent } from '@blueprintjs/core';

import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import {
  ButtonLink,
  AppToaster,
  Join,
  FormattedMessage as T,
  Alert,
  AlertDesc,
} from '@/components';
import {
  validateMoveToFullLocking,
  validateMoveToPartialLocking,
} from './utils';

/**
 * Transactions locking header.
 * @returns
 */
export function TransactionsLockingHeader() {
  const {
    transactionsLocking,
    transactionLockingType,
    setTransactionLockingType,
  } = useTransactionsLockingContext();

  // Handle all lock link click.
  const handleAllLockClick = () => {
    const activeModules = validateMoveToFullLocking(
      transactionsLocking.modules,
    );
    const modulesStrong = activeModules.map((module) => (
      <strong>{module.formatted_module}</strong>
    ));
    if (activeModules.length > 0) {
      AppToaster.show({
        message: (
          <span>
            You should unlock <Join items={modulesStrong} sep={', '} /> modules
            first, than you can lock all transactions at once.
          </span>
        ),
        intent: Intent.DANGER,
      });
    } else {
      setTransactionLockingType('all');
    }
  };

  const handleUndividualLockClick = () => {
    const isAllLockingActive = validateMoveToPartialLocking(
      transactionsLocking.all,
    );

    if (isAllLockingActive) {
      AppToaster.show({
        message: intl.get(
          'transactions_locking.you_should_unlock_all_transactions_at_once_before',
        ),
        intent: Intent.DANGER,
      });
    } else {
      setTransactionLockingType('partial');
    }
  };

  return transactionLockingType !== 'all' ? (
    <LockAllAlert
      title={<T id={'transactions_locking_lock_all_transactions_at_once'} />}
      intent={Intent.PRIMARY}
    >
      <p>
        <T id={'transactions_locking.callout.lock_all_at_once.desc'} />
      </p>
      <ButtonLink onClick={handleAllLockClick}>
        <T id={'transactions_locking.lock_all_transactions_at_once'} />
      </ButtonLink>
    </LockAllAlert>
  ) : (
    <LockAllAlert
      title={<T id={'transactions_locking.lock_individual_modules'} />}
      intent={Intent.PRIMARY}
    >
      <p>
        <T id={'transactions_locking.callout.lock_individual.desc'} />
      </p>
      <ButtonLink onClick={handleUndividualLockClick}>
        <T id={'transactions_locking.lock_modules_individually'} />
      </ButtonLink>
    </LockAllAlert>
  );
}

const LockAllAlert = styled(Alert)`
  margin-bottom: 0;
  margin-top: 20px;
  background: transparent;

  ${AlertDesc} {
    color: #1f3255;
  }
`;
