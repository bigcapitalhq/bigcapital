// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import {
  Menu,
  MenuItem,
  MenuDivider,
  Intent,
  Tooltip,
  Position,
  Classes,
} from '@blueprintjs/core';

import { Can, Icon, Money, If, AvatarCell } from '@/components';
import { CustomerAction, AbilitySubject } from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

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
export function PhoneNumberAccessor(row) {
  return <div className={'work_phone'}>{row.personal_phone}</div>;
}

/**
 * Balance accessor.
 */
export function BalanceAccessor(row) {
  return <Money amount={row.closing_balance} currency={row.currency_code} />;
}

/**
 * Note column accessor.
 */
export function NoteAccessor(row) {
  return (
    <If condition={row.note}>
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

/**
 * Retrieve customers table columns.
 */
export function useCustomersTableColumns() {
  return useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        Cell: AvatarCell,
        className: 'avatar',
        width: 45,
        disableResizing: true,
        disableSortBy: true,
        clickable: true,
      },
      {
        id: 'display_name',
        Header: intl.get('display_name'),
        accessor: 'display_name',
        className: 'display_name',
        width: 150,
        clickable: true,
      },
      {
        id: 'company_name',
        Header: intl.get('company_name'),
        accessor: 'company_name',
        className: 'company_name',
        width: 150,
        clickable: true,
      },
      {
        id: 'work_phone',
        Header: intl.get('phone_number'),
        accessor: PhoneNumberAccessor,
        className: 'phone_number',
        width: 100,
        clickable: true,
      },
      {
        id: 'note',
        Header: intl.get('note'),
        accessor: NoteAccessor,
        disableSortBy: true,
        width: 85,
        clickable: true,
      },
      {
        id: 'balance',
        Header: intl.get('receivable_balance'),
        accessor: BalanceAccessor,
        align: 'right',
        width: 100,
        clickable: true,
      },
    ],
    [],
  );
}
