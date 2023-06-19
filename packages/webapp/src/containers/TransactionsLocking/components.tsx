// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';
import {
  Button,
  Position,
  MenuItem,
  Menu,
  Intent,
  Divider,
  Classes,
} from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

import { Hint, Icon, If, FormattedMessage as T } from '@/components';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import { safeInvoke } from '@/utils';

/**
 * Transaction locking module item.
 * @returns {React.JSX}
 */
export function TransactionsLockingItemModule({ module, ...rest }) {
  return (
    <TransactionLockingContent
      name={module.formatted_module}
      module={module.module}
      description={module.description}
      isEnabled={module.is_enabled}
      isPartialUnlock={module.is_partial_unlock}
      lockToDate={module.formatted_lock_to_date}
      lockReason={module.lock_reason}
      unlockReason={module.unlock_reason}
      unlockFromDate={module.formatted_unlock_from_date}
      unlockToDate={module.formatted_unlock_to_date}
      {...rest}
    />
  );
}

/**
 * Transactions locking items modules list.
 * @returns {React.JSX}
 */
export function TransactionsLockingList({ ...rest }) {
  const {
    transactionsLocking: { modules },
  } = useTransactionsLockingContext();

  return modules.map((module) => (
    <TransactionsLockingItemModule module={module} {...rest} />
  ));
}

/**
 * Transactions locking full module item.
 * @returns {React.JSX}
 */
export function TransactionsLockingFull({ ...rest }) {
  const {
    transactionsLocking: { all },
  } = useTransactionsLockingContext();

  return <TransactionsLockingItemModule module={all} {...rest} />;
}

/**
 * Transactions locking skeleton list.
 * @returns {React.JSX}
 */
export function TransactionLockingSkeletonList() {
  return (
    <>
      <TransactionLockingItemSkeleton />
      <TransactionLockingItemSkeleton />
      <TransactionLockingItemSkeleton />
    </>
  );
}

/**
 * Transactions locking skeleton item.
 * @returns {React.JSX}
 */
export const TransactionLockingItemSkeleton = ({}) => {
  return (
    <TransactionLockingWrap>
      <TransLockingInner>
        <TransLockingIcon>
          <Icon icon="lock" iconSize={24} />
        </TransLockingIcon>

        <TransLockingContent>
          <TransLockingItemTitle className={Classes.SKELETON}>
            XXXX
          </TransLockingItemTitle>

          <TransLockingItemDesc className={Classes.SKELETON}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          </TransLockingItemDesc>
        </TransLockingContent>
      </TransLockingInner>
    </TransactionLockingWrap>
  );
};

const TransactionsLockingItemContext = React.createContext();

const useTransactionsLockingItemContext = () =>
  React.useContext(TransactionsLockingItemContext);

/**
 * Transactions locking item.
 * @returns {React.JSX}
 */
export const TransactionLockingContent = (props) => {
  const {
    name,
    description,
    module,

    isEnabled,
    lockToDate,
    lockReason,

    // Unlock props.
    isPartialUnlock,
    unlockToDate,
    unlockFromDate,
    unlockReason,

    onLock,
    onCancelLock,
    onEditLock,
    onUnlockPartial,
    onCancelUnlockPartial,
  } = props;

  return (
    <TransactionsLockingItemContext.Provider value={props}>
      <TransactionLockingWrap isEnabled={isEnabled}>
        <TransLockingInner>
          <TransLockingIcon>
            <Icon icon="lock" iconSize={24} />
          </TransLockingIcon>

          <TransactionsLockingItemContent />
          <TransactionsLockingItemActions />
        </TransLockingInner>
      </TransactionLockingWrap>
    </TransactionsLockingItemContext.Provider>
  );
};

/**
 * Transactions locking item content.
 */
function TransactionsLockingItemContent() {
  const {
    name,
    description,

    isEnabled,
    lockToDate,
    lockReason,

    // Unlock props.
    isPartialUnlock,
    unlockToDate,
    unlockFromDate,
    unlockReason,
  } = useTransactionsLockingItemContext();

  return (
    <TransLockingContent>
      <TransLockingItemTitle>
        {name}
        <Hint content={description} position={Position.BOTTOM_LEFT} />
      </TransLockingItemTitle>

      <If condition={!isEnabled}>
        <TransLockingItemDesc>
          <T id={'transactions_locking.lock_item.no_lock'} />
        </TransLockingItemDesc>
      </If>

      <If condition={isEnabled}>
        <TransLockWrap>
          <TransLockingItemDesc>
            {intl.formatHTMLMessage(
              { id: 'transactions_locking.of_the_module_locked_to' },
              {
                value: lockToDate,
              },
            )}
          </TransLockingItemDesc>

          <If condition={lockReason}>
            <TransLockingReason>
              {intl.formatHTMLMessage(
                { id: 'transactions_locking.lock_reason' },
                { value: lockReason },
              )}
            </TransLockingReason>
          </If>
        </TransLockWrap>
      </If>

      <If condition={isPartialUnlock}>
        <TransUnlockWrap>
          <TransLockingItemDesc>
            {intl.formatHTMLMessage(
              { id: 'transactions_locking.partial_unlocked_from' },
              {
                fromDate: unlockFromDate,
                toDate: unlockToDate,
              },
            )}
          </TransLockingItemDesc>

          <If condition={unlockReason}>
            <TransLockingReason>
              {intl.formatHTMLMessage(
                { id: 'transactions_locking.unlock_reason' },
                { value: unlockReason },
              )}
            </TransLockingReason>
          </If>
        </TransUnlockWrap>
      </If>
    </TransLockingContent>
  );
}

/**
 * Transactions locking item actions.
 */
function TransactionsLockingItemActions() {
  const {
    module,
    isEnabled,

    // Unlock props.
    isPartialUnlock,

    onLock,
    onCancelLock,
    onEditLock,
    onUnlockPartial,
    onCancelUnlockPartial,
  } = useTransactionsLockingItemContext();

  const handleLockClick = (event) => {
    safeInvoke(onLock, module, event);
  };
  const handleEditBtn = (event) => {
    safeInvoke(onEditLock, module, isEnabled, event);
  };
  const handleUnlockPartial = (event) => {
    safeInvoke(onUnlockPartial, module, event);
  };

  const handleUnlockFull = (event) => {
    safeInvoke(onCancelLock, module, event);
  };
  const handleCancelPartialUnlock = (event) => {
    safeInvoke(onCancelUnlockPartial, module, event);
  };

  return (
    <TransLockingActions>
      <If condition={!isEnabled}>
        <Button
          small={true}
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={handleLockClick}
        >
          <T id={'transactions_locking.lock'} />
        </Button>
      </If>

      <If condition={isEnabled}>
        <Button
          small={true}
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={handleEditBtn}
        >
          <T id={'edit'} />
        </Button>
        <Divider />
        <Popover2
          content={
            <Menu>
              <MenuItem
                text={<T id={'transactions_locking.full_unlock'} />}
                onClick={handleUnlockFull}
              />

              <If condition={!isPartialUnlock}>
                <MenuItem
                  text={<T id={'transactions_locking.partial_unlock'} />}
                  onClick={handleUnlockPartial}
                />
              </If>
              <If condition={isPartialUnlock}>
                <MenuItem
                  text={<T id={'transactions_locking.cancel_partial_unlock'} />}
                  onClick={handleCancelPartialUnlock}
                />
              </If>
            </Menu>
          }
          placement={'bottom-start'}
          minimal={true}
        >
          <Button small={true} minimal={true} intent={Intent.PRIMARY}>
            <T id={'transactions_locking.unlock'} />
          </Button>
        </Popover2>
      </If>
    </TransLockingActions>
  );
}

const TransactionLockingWrap = styled.div`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #c4d2d7;
  padding: 16px 18px;
  margin-bottom: 25px;
  background: #fff;
  box-shadow: 0 4px 20px -5px rgb(0 8 36 / 5%);

  ${(props) =>
    props.isEnabled &&
    `
    border-color: #fc8483; 

    ${TransLockingIcon} {
      color: #ef6d6d;
    }
  `}
`;

const TransLockingInner = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 0;
`;

const TransLockingItemTitle = styled.h1`
  font-size: 18px;
  margin: 0 0 8px;
  line-height: 1;
  font-weight: 600;
`;
const TransLockingItemDesc = styled.p`
  margin-bottom: 0;
  opacity: 0.9;
`;

const TransLockingIcon = styled.div`
  border: 1px solid #d2dde2;
  height: 45px;
  width: 45px;
  text-align: center;
  line-height: 45px;
  border-radius: 8px;
  color: #93a1ba;

  .bp3-icon {
    position: relative;
    top: 1px;
  }
`;

export const TransLockingActions = styled.div`
  display: flex;

  .bp3-divider {
    margin: 2px;
  }
`;

export const TransLockingContent = styled.div`
  flex: 1 1 0;
  margin-left: 20px;
  width: 100%;
  padding-right: 10px;
`;

export const TransLockingReason = styled.div`
  font-size: 13px;

  strong {
    color: #777;
  }
`;

const TransUnlockWrap = styled.div`
  padding-top: 10px;
  border-top: 1px solid #ddd;
  margin-top: 10px;

  ${TransLockingReason} {
    margin-top: 8px;
  }
  ${TransLockingItemDesc} {
    font-size: 13px;
  }
`;

const TransLockWrap = styled.div`
  ${TransLockingReason} {
    margin-top: 10px;
  }
`;
