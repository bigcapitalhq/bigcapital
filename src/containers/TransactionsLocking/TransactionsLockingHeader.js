import React from 'react';
import { Intent } from '@blueprintjs/core';
import styled from 'styled-components';

import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import {
  ButtonLink,
  AppToaster,
  Join,
  FormattedMessage as T,
  Alert,
  AlertDesc,
} from 'components';
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
        message:
          'You should unlock all transactions at once before, than lock transactions partially on each module.',
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
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <ButtonLink onClick={handleAllLockClick}>
        <T id={'transactions_locking.lock_all_transactions_at_once'} />
      </ButtonLink>
    </LockAllAlert>
  ) : (
    <LockAllAlert title={'Lock Individual Modules'} intent={Intent.PRIMARY}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
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
