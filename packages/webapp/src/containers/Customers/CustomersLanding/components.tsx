import {
  Menu,
  MenuItem,
  MenuDivider,
  Intent,
  Tooltip,
  Position,
  Classes,
} from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import type { Customer } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Can, Icon, Money, If, AvatarCell } from '@/components';
import { CLASSES } from '@/constants';
import { CustomerAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

type ActionsMenuPayload = {
  onEdit?: (row: Customer) => void;
  onDelete?: (row: Customer) => void;
  onDuplicate?: (row: Customer) => void;
  onInactivate?: (row: Customer) => void;
  onActivate?: (row: Customer) => void;
  onViewDetails: (row: Customer) => void;
};

/**
 * Actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDelete,
    onDuplicate,
    onInactivate,
    onActivate,
    onViewDetails,
  },
}: {
  row: { original: Customer };
  payload: ActionsMenuPayload;
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={CustomerAction.Edit} a={AbilitySubject.Customer}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_customer')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={CustomerAction.Create} a={AbilitySubject.Customer}>
        <MenuItem
          icon={<Icon icon="content-copy" iconSize={16} />}
          text={intl.get('duplicate')}
          onClick={safeCallback(onDuplicate, original)}
        />
      </Can>
      <Can I={CustomerAction.Edit} a={AbilitySubject.Customer}>
        <If condition={original.active}>
          <MenuItem
            text={intl.get('inactivate_customer')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(onInactivate, original)}
          />
        </If>
        <If condition={!original.active}>
          <MenuItem
            text={intl.get('activate_customer')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(onActivate, original)}
          />
        </If>
      </Can>
      <Can I={CustomerAction.Delete} a={AbilitySubject.Customer}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={intl.get('delete_customer')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
}

/**
 * Phone number accessor.
 */
export function PhoneNumberAccessor(row: Customer) {
  return <div className={'work_phone'}>{row.personalPhone}</div>;
}

/**
 * Balance accessor.
 */
export function BalanceAccessor(row: Customer) {
  return <Money amount={row.closingBalance} currency={row.currencyCode} />;
}

/**
 * Note column accessor.
 */
export function NoteAccessor(row: Customer) {
  return (
    <If condition={Boolean(row.note)}>
      <Tooltip
        className={Classes.TOOLTIP_INDICATOR}
        content={row.note}
        position={Position.LEFT_TOP}
        hoverOpenDelay={50}
      >
        <Icon icon={'file-alt'} iconSize={16} />
      </Tooltip>
    </If>
  );
}

const column = createColumnHelper<BP_TableFeatures, Customer>();

export function useCustomersTableColumns(size: string) {
  return useMemo(
    () =>
      column.columns([
        column.accessor('displayName', {
          id: 'avatar',
          header: '',
          size: 45,
          cell: ({ row }) => <AvatarCell row={row} size={size} />,
          enableSorting: false,
          enableResizing: false,
        }),
        column.accessor('displayName', {
          id: 'display_name',
          header: intl.get('display_name'),
          size: 250,
        }),
        column.accessor('companyName', {
          id: 'company_name',
          header: intl.get('company_name'),
          size: 150,
          meta: { bodyCellClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('personalPhone', {
          id: 'work_phone',
          header: intl.get('phone_number'),
          size: 100,
          cell: ({ row }) => PhoneNumberAccessor(row.original),
          meta: { bodyCellClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('note', {
          id: 'note',
          header: intl.get('note'),
          size: 85,
          cell: ({ row }) => NoteAccessor(row.original),
          enableSorting: false,
          meta: { bodyCellClassName: CLASSES.TEXT_MUTED },
        }),
        column.accessor('closingBalance', {
          id: 'balance',
          header: intl.get('receivable_balance'),
          size: 100,
          cell: ({ row }) => BalanceAccessor(row.original),
          meta: { textAlign: 'right', bodyCellClassName: 'numeric-cell' },
        }),
      ]),
    [size],
  );
}
