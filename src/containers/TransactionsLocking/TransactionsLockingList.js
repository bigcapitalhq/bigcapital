import React from 'react';
import { Intent } from '@blueprintjs/core';
import styled from 'styled-components';
import * as R from 'ramda';

import {
  Alert,
  ButtonLink,
  AppToaster,
  Join,
  Paragraph,
  FormattedMessage as T,
  AlertDesc
} from 'components';
import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import {
  TransactionLockingContent,
  TransactionLockingItemLoading,
} from './components';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import {
  validateMoveToFullLocking,
  validateMoveToPartialLocking,
} from './utils';

function TransactionsLockingList({
  items,
  onLock,
  onUnlock,
  onUnlockPartial,
  onCancel,
}) {
  return items.map(
    ({
      is_enabled,
      is_partial_unlock,
      module,
      formatted_module,
      description,
      ...item
    }) => (
      <TransactionLockingContent
        name={formatted_module}
        module={module}
        description={description}
        isEnabled={is_enabled}
        isPartialUnlock={is_partial_unlock}
        onLock={onLock}
        onUnlockFull={onUnlock}
        onUnlockPartial={onUnlockPartial}
        onEditLock={onLock}
        onCancle={onCancel}
        lockToDate={item.formatted_lock_to_date}
        lockReason={item.lock_reason}
        unlockReason={item.unlock_reason}
        unlockFromDate={item.formatted_unlock_from_date}
        unlockToDate={item.formatted_unlock_to_date}
      />
    ),
  );
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

function TransactionsLockingBodyJsx({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,
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

  // Handle cancel.
  const handleCancelUnlockingPartail = (module) => {
    openAlert('cancel-unlocking-partail', { module: module });
  };

  return !isTransactionLockingLoading ? (
    transactionLockingType === 'partial' ? (
      <TransactionsLockingList
        items={modules}
        onLock={handleLockingTransactions}
        onUnlock={handleUnlockTransactions}
        onUnlockPartial={handleUnlockingPartial}
        onCancel={handleCancelUnlockingPartail}
      />
    ) : (
      <TransactionsLockingFull
        onLock={handleLockingTransactions}
        onUnlockPartial={handleUnlockingPartial}
      />
    )
  ) : (
    <TransactionLockingSkeletonList />
  );
}

const TransactionsLockingBody = R.compose(
  withAlertsActions,
  withDialogActions,
)(TransactionsLockingBodyJsx);

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

  ${AlertDesc} {
    color: #1f3255;
  }
`;
