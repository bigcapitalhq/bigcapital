import {
  Menu,
  Popover,
  Button,
  Position,
  MenuItem,
  MenuDivider,
  Intent,
  Tag,
} from '@blueprintjs/core';
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type { Currency } from '@bigcapital/sdk-ts';
import { Icon } from '@/components';
import { safeCallback } from '@/utils';

export interface ActionMenuListPayload {
  onEditCurrency?: (currency: Currency) => void;
  onDeleteCurrency?: (currency: Currency) => void;
}

interface ActionMenuListProps {
  row: { original: Currency };
  payload: ActionMenuListPayload;
}

/**
 * Row actions menu list.
 */
export function ActionMenuList({
  row: { original },
  payload: { onEditCurrency, onDeleteCurrency },
}: ActionMenuListProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={intl.get('edit_currency')}
        onClick={safeCallback(onEditCurrency, original)}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={intl.get('delete_currency')}
        onClick={safeCallback(onDeleteCurrency, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

interface ActionsCellProps {
  payload: ActionMenuListPayload;
  row: { original: Currency };
}

/**
 * Actions cell.
 */
export const ActionsCell = (props: ActionsCellProps) => {
  return (
    <Popover
      position={Position.RIGHT_BOTTOM}
      content={<ActionMenuList {...props} />}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
};

export const CurrencyNameAccessor = (value: Currency) => {
  return (
    <CurrencyNameRoot>
      {value.currencyName} {value.isBaseCurrency && <Tag>Base Currency</Tag>}
    </CurrencyNameRoot>
  );
};

const CurrencyNameRoot = styled.div`
  display: flex;
  gap: 8px;
`;

export function useCurrenciesTableColumns() {
  return useMemo(
    () => [
      {
        Header: intl.get('currency_name'),
        accessor: CurrencyNameAccessor,
        width: 150,
      },
      {
        Header: intl.get('currency_code'),
        accessor: 'currencyCode',
        className: 'currency_code',
        width: 120,
      },
      {
        Header: intl.get('currency_sign'),
        width: 120,
        accessor: 'currencySign',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [],
  );
}
