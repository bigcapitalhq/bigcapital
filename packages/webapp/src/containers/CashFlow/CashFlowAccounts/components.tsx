import {
  Button,
  Intent,
  Popover,
  Position,
  Tag,
  Tooltip,
} from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { CashflowAccountMenu } from './CashflowAccountMenu';
import styles from './CashFlowAccountsDataTable.module.scss';
import {
  CASHFLOW_ACCOUNT_SYNC_STATUS,
  getCashflowAccountSyncStatus,
} from './utils';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BankingAccountsListResponse } from '@bigcapital/sdk-ts';
import { Icon } from '@/components';
import { ACCOUNT_TYPE } from '@/constants';

export type CashflowAccountRow = BankingAccountsListResponse[number];

interface CellProps {
  cell: { row: { original: CashflowAccountRow } };
}

interface RowProps {
  row: { original: CashflowAccountRow };
}

interface CashflowAccountAvatarProps {
  account: CashflowAccountRow;
}

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  [ACCOUNT_TYPE.BANK]: 'bank',
  [ACCOUNT_TYPE.CASH]: 'cash',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'credit_card',
};

const ACCOUNT_TYPE_ICONS: Record<string, string> = {
  [ACCOUNT_TYPE.BANK]: 'account-balance',
  [ACCOUNT_TYPE.CASH]: 'payments',
  [ACCOUNT_TYPE.CREDIT_CARD]: 'credit-card',
};

const SYNC_STATUS_LABELS: Record<string, string> = {
  [CASHFLOW_ACCOUNT_SYNC_STATUS.SYNCED]: 'banking.status.synced',
  [CASHFLOW_ACCOUNT_SYNC_STATUS.PAUSED]: 'banking.status.paused',
  [CASHFLOW_ACCOUNT_SYNC_STATUS.NOT_CONNECTED]: 'banking.status.not_connected',
};

const SYNC_STATUS_INTENTS: Record<string, Intent> = {
  [CASHFLOW_ACCOUNT_SYNC_STATUS.SYNCED]: Intent.SUCCESS,
  [CASHFLOW_ACCOUNT_SYNC_STATUS.PAUSED]: Intent.WARNING,
  [CASHFLOW_ACCOUNT_SYNC_STATUS.NOT_CONNECTED]: Intent.NONE,
};

/**
 * Retrieves the account type label.
 */
function getAccountTypeLabel(account: CashflowAccountRow): string {
  return intl.get(ACCOUNT_TYPE_LABELS[account.accountType] || 'bank');
}

/**
 * Retrieves the account subtitle (sync source + account code).
 */
function getAccountSubtitle(account: CashflowAccountRow): string {
  const source = account.plaidItemId
    ? intl.get('banking.synced_via', {
        institution: account.plaidInstitutionName || 'Plaid',
      })
    : intl.get('banking.manual_account');

  return account.code ? `${source} · ${account.code}` : source;
}

/**
 * Bank account avatar with the institution logo and a type icon fallback.
 */
function CashflowAccountAvatar({ account }: CashflowAccountAvatarProps) {
  const [isLogoBroken, setIsLogoBroken] = React.useState(false);

  const logo = account.plaidInstitutionLogo;
  const icon = ACCOUNT_TYPE_ICONS[account.accountType] || 'account-balance';

  if (logo && !isLogoBroken) {
    return (
      <span className={`${styles.avatar} ${styles.avatarLogo}`}>
        <img src={logo} alt="" onError={() => setIsLogoBroken(true)} />
      </span>
    );
  }
  return (
    <span className={`${styles.avatar} ${styles.avatarIcon}`}>
      <Icon icon={icon} iconSize={16} />
    </span>
  );
}

/**
 * Account cell.
 */
export const AccountCell = ({ row }: RowProps) => {
  const account = row.original;

  return (
    <div className={styles.accountCell}>
      <CashflowAccountAvatar account={account} />
      <span className={styles.accountInfo}>
        <Link
          to={`/cashflow-accounts/${account.id}/transactions`}
          className={styles.accountName}
        >
          {account.name}
        </Link>
        <span className={styles.accountMeta}>
          {getAccountSubtitle(account)}
        </span>
      </span>
    </div>
  );
};

/**
 * Feeds sync status cell.
 */
export const StatusCell = ({ row }: RowProps) => {
  const account = row.original;
  const status = getCashflowAccountSyncStatus(account);

  const tag = (
    <Tag minimal={true} round={true} intent={SYNC_STATUS_INTENTS[status]}>
      {intl.get(SYNC_STATUS_LABELS[status])}
    </Tag>
  );
  if (!account.lastFeedsUpdatedFromNow) {
    return tag;
  }
  return (
    <Tooltip
      content={intl.get('banking.last_synced', {
        fromNow: account.lastFeedsUpdatedFromNow,
      })}
      position={Position.TOP}
      hoverOpenDelay={250}
    >
      {tag}
    </Tooltip>
  );
};

/**
 * Balance cell.
 */
export const BalanceCell = ({ cell }: CellProps) => {
  const account = cell.row.original;

  return account.amount !== null ? (
    <span>{account.formattedAmount}</span>
  ) : (
    <span className="placeholder">—</span>
  );
};

/**
 * Row actions cell.
 */
export const ActionsCell = ({ row }: RowProps) => {
  return (
    <Popover
      content={<CashflowAccountMenu account={row.original} />}
      position={Position.RIGHT_BOTTOM}
      minimal={true}
    >
      <Button
        icon={<Icon icon="more-h-16" iconSize={16} />}
        aria-label={intl.get('banking.label.account_actions')}
      />
    </Popover>
  );
};

/**
 * Retrieve Cash flow table columns.
 */
export function useCashFlowAccountsTableColumns(): DataTableColumn<CashflowAccountRow>[] {
  return React.useMemo(
    () => [
      {
        id: 'name',
        Header: intl.get('account'),
        accessor: 'name',
        Cell: AccountCell,
        className: 'account_name',
        width: 300,
        textOverview: true,
        skeletonWidthMin: 160,
        skeletonWidthMax: 240,
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (row: CashflowAccountRow) =>
          getCashflowAccountSyncStatus(row),
        Cell: StatusCell,
        className: 'status',
        width: 130,
        skeletonWidthMin: 70,
        skeletonWidthMax: 90,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        accessor: (row: CashflowAccountRow) => getAccountTypeLabel(row),
        className: 'type',
        width: 120,
        textOverview: true,
        skeletonWidthMin: 50,
        skeletonWidthMax: 80,
      },
      {
        id: 'balance',
        Header: intl.get('balance'),
        accessor: 'amount',
        Cell: BalanceCell,
        className: 'balance',
        width: 150,
        align: 'right',
        skeletonWidthMin: 70,
        skeletonWidthMax: 110,
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        disableSortBy: true,
        disableResizing: true,
        skeletonWidthMin: 20,
        skeletonWidthMax: 30,
      },
    ],
    [],
  );
}
