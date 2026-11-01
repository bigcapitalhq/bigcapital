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
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useTransactionsLockingContext } from './TransactionsLockingProvider';
import type { TransactionsLockingMeta } from '@bigcapital/sdk-ts';
import { Hint, Icon, If, FormattedMessage as T } from '@/components';

export interface TransactionLockingHandlers {
  onLock?: (module: string, event: React.MouseEvent) => void;
  onEditLock?: (
    module: string,
    isEnabled: boolean,
    event: React.MouseEvent,
  ) => void;
  onCancelLock?: (module: string, event: React.MouseEvent) => void;
  onUnlockPartial?: (module: string, event: React.MouseEvent) => void;
  onCancelUnlockPartial?: (module: string, event: React.MouseEvent) => void;
}

export interface TransactionsLockingItemModuleProps
  extends TransactionLockingHandlers {
  module: TransactionsLockingMeta;
}

export interface TransactionLockingContentProps
  extends TransactionLockingHandlers {
  name: string;
  module: string;
  description: string;
  isEnabled: boolean;
  isPartialUnlock: boolean;
  lockToDate: string;
  lockReason: string;
  unlockReason: string;
  unlockFromDate: string;
  unlockToDate: string;
}

/**
 * Transaction locking module item.
 * @returns {React.JSX}
 */
export function TransactionsLockingItemModule({
  module,
  ...rest
}: TransactionsLockingItemModuleProps) {
  return (
    <TransactionLockingContent
      name={module.formattedModule}
      module={module.module}
      description={module.description}
      isEnabled={module.isEnabled}
      isPartialUnlock={module.isPartialUnlock}
      lockToDate={module.formattedLockToDate}
      lockReason={module.lockReason}
      unlockReason={module.unlockReason}
      unlockFromDate={module.formattedUnlockFromDate}
      unlockToDate={module.formattedUnlockToDate}
      {...rest}
    />
  );
}

/**
 * Transactions locking items modules list.
 * @returns {React.JSX}
 */
export function TransactionsLockingList({
  ...rest
}: Omit<TransactionsLockingItemModuleProps, 'module'>) {
  const { transactionsLocking } = useTransactionsLockingContext();
  const modules = transactionsLocking?.modules ?? [];

  return (
    <>
      {modules.map((module) => (
        <TransactionsLockingItemModule
          key={module.module}
          module={module}
          {...rest}
        />
      ))}
    </>
  );
}

/**
 * Transactions locking full module item.
 * @returns {React.JSX}
 */
export function TransactionsLockingFull({
  ...rest
}: Omit<TransactionsLockingItemModuleProps, 'module'>) {
  const { transactionsLocking } = useTransactionsLockingContext();

  if (!transactionsLocking) {
    return null;
  }
  return (
    <TransactionsLockingItemModule module={transactionsLocking.all} {...rest} />
  );
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
export const TransactionLockingItemSkeleton = () => {
  return (
    <TransactionLockingWrapp isEnabled={false}>
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
    </TransactionLockingWrapp>
  );
};

const TransactionsLockingItemContext = React.createContext<
  TransactionLockingContentProps | undefined
>(undefined);

const useTransactionsLockingItemContext =
  (): TransactionLockingContentProps => {
    const context = React.useContext(TransactionsLockingItemContext);

    if (!context) {
      throw new Error(
        'useTransactionsLockingItemContext must be used within a TransactionLockingContent',
      );
    }
    return context;
  };

/**
 * Transactions locking item.
 * @returns {React.JSX}
 */
export const TransactionLockingContent = (
  props: TransactionLockingContentProps,
) => {
  const { isEnabled } = props;

  return (
    <TransactionsLockingItemContext.Provider value={props}>
      <TransactionLockingWrapp isEnabled={isEnabled}>
        <TransLockingInner>
          <TransLockingIcon>
            <Icon icon="lock" iconSize={24} />
          </TransLockingIcon>

          <TransactionsLockingItemContent />
          <TransactionsLockingItemActions />
        </TransLockingInner>
      </TransactionLockingWrapp>
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

          <If condition={!!lockReason}>
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

          <If condition={!!unlockReason}>
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

  const handleLockClick = (event: React.MouseEvent) => {
    onLock?.(module, event);
  };
  const handleEditBtn = (event: React.MouseEvent) => {
    onEditLock?.(module, isEnabled, event);
  };
  const handleUnlockPartial = (event: React.MouseEvent) => {
    onUnlockPartial?.(module, event);
  };

  const handleUnlockFull = (event: React.MouseEvent) => {
    onCancelLock?.(module, event);
  };
  const handleCancelPartialUnlock = (event: React.MouseEvent) => {
    onCancelUnlockPartial?.(module, event);
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
                  text={<T id={'transactions_locking.paetial_unlock'} />}
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

const TransactionLockingWrapp = styled.div<{ isEnabled: boolean }>`
  display: flex;
  align-items: center;
  border-radius: 6px;
  border: 1px solid var(--color-transaction-locking-item-border);
  padding: 16px 18px;
  margin-bottom: 25px;
  background: var(--color-transaction-locking-item-background);
  box-shadow: 0 4px 20px -5px rgb(0 8 36 / 5%);

  ${(props) =>
    props.isEnabled &&
    `
    border-color: var(--color-transaction-locking-item-enabled-border);

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
  --x-text-color: #93a1ba;

  .bp4-dark & {
    --x-text-color: rgba(255, 255, 255, 0.6);
  }
  border: 1px solid var(--color-transaction-locking-item-icon-border);
  height: 45px;
  width: 45px;
  text-align: center;
  line-height: 45px;
  border-radius: 8px;
  color: var(--x-text-color);

  .bp4-icon {
    position: relative;
    top: 1px;
  }
`;

export const TransLockingActions = styled.div`
  display: flex;

  .bp4-divider {
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
  --x-text-color: #777;

  .bp4-dark & {
    --x-text-color: rgba(255, 255, 255, 0.6);
  }
  strong {
    color: var(--x-text-color);
  }
`;

const TransUnlockWrap = styled.div`
  -x-border-color: #ddd;

  .bp4-dark & {
    --x-border-color: rgba(255, 255, 255, 0.1);
  }
  padding-top: 10px;
  border-top: 1px solid var(--x-border-color);
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
