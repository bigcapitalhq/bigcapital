import {
  Button,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Tooltip,
  Intent,
  Classes,
} from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import type { Vendor } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import { Can, Icon, Money, If, AvatarCell } from '@/components';
import { VendorAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback, firstLettersArgs } from '@/utils';

type ActionsMenuPayload = {
  onEdit?: (row: Vendor) => void;
  onDelete?: (row: Vendor) => void;
  onDuplicate?: (row: Vendor) => void;
  onInactivate?: (row: Vendor) => void;
  onActivate?: (row: Vendor) => void;
  onViewDetails: (row: Vendor) => void;
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
  row: { original: Vendor };
  payload: ActionsMenuPayload;
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={VendorAction.Edit} a={AbilitySubject.Vendor}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_vendor')}
          onClick={safeCallback(onEdit, original)}
        />
      </Can>
      <Can I={VendorAction.Create} a={AbilitySubject.Customer}>
        <MenuItem
          icon={<Icon icon="content-copy" iconSize={16} />}
          text={intl.get('duplicate')}
          onClick={safeCallback(onDuplicate, original)}
        />
      </Can>
      <Can I={VendorAction.Edit} a={AbilitySubject.Vendor}>
        <If condition={original.active}>
          <MenuItem
            text={intl.get('inactivate_item')}
            icon={<Icon icon="pause-16" iconSize={16} />}
            onClick={safeCallback(onInactivate, original)}
          />
        </If>
        <If condition={!original.active}>
          <MenuItem
            text={intl.get('activate_item')}
            icon={<Icon icon="play-16" iconSize={16} />}
            onClick={safeCallback(onActivate, original)}
          />
        </If>
      </Can>
      <Can I={VendorAction.Delete} a={AbilitySubject.Vendor}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={intl.get('delete_vendor')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
        />
      </Can>
    </Menu>
  );
}

/**
 * Actions cell.
 */
export function ActionsCell(props: {
  row: { original: Vendor };
  payload: ActionsMenuPayload;
}) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

/**
 * Avatar table accessor.
 */
export function AvatarAccessor(row: Vendor) {
  return <span className="avatar">{firstLettersArgs(row.displayName)}</span>;
}

/**
 * Phone number accessor.
 */
export function PhoneNumberAccessor(row: Vendor) {
  return <div className={'work_phone'}>{row.workPhone}</div>;
}

/**
 * Balance accessor.
 */
export function BalanceAccessor(row: Vendor) {
  return <Money amount={row.closingBalance} currency={row.currencyCode} />;
}

/**
 * Note column accessor.
 */
export function NoteAccessor(row: Vendor) {
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

const column = createColumnHelper<BP_TableFeatures, Vendor>();

export function useVendorsTableColumns(size: string) {
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
          size: 150,
        }),
        column.accessor('companyName', {
          id: 'company_name',
          header: intl.get('company_name'),
          size: 150,
          meta: { bodyCellClassName: Classes.TEXT_MUTED },
        }),
        column.accessor('workPhone', {
          id: 'work_phone',
          header: intl.get('phone_number'),
          size: 100,
          cell: ({ row }) => PhoneNumberAccessor(row.original),
          meta: { bodyCellClassName: Classes.TEXT_MUTED },
        }),
        column.accessor('note', {
          id: 'note',
          header: intl.get('note'),
          size: 85,
          cell: ({ row }) => NoteAccessor(row.original),
          enableSorting: false,
          meta: { bodyCellClassName: Classes.TEXT_MUTED },
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
