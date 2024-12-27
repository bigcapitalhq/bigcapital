// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
  Intent,
  Tag,
} from '@blueprintjs/core';
import {
  TextOverviewTooltipCell,
  FormattedMessage as T,
  Choose,
  Icon,
} from '@/components';
import { getColumnWidth } from '@/utils';
import { useBillDrawerContext } from './BillDrawerProvider';

/**
 * Retrieve bill readonly details entries table columns.
 */
export const useBillReadonlyEntriesTableColumns = () => {
  const {
    bill: { entries },
  } = useBillDrawerContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        Cell: TextOverviewTooltipCell,
        width: 150,
        className: 'item',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        Cell: TextOverviewTooltipCell,
        className: 'description',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity_formatted',
        width: getColumnWidth(entries, 'quantity_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate_formatted',
        width: getColumnWidth(entries, 'rate', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
      {
        id: 'discount',
        Header: 'Discount',
        accessor: 'discount_formatted',
        align: 'right',
        disableSortBy: true,
        textOverview: true,
        width: getColumnWidth(entries, 'discount_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
      },
      {
        Header: intl.get('amount'),
        accessor: 'total_formatted',
        width: getColumnWidth(entries, 'total_formatted', {
          minWidth: 60,
          magicSpacing: 5,
        }),
        align: 'right',
        disableSortBy: true,
        textOverview: true,
      },
    ],
    [],
  );
};

/**
 * Bill details status.
 * @returns {React.JSX}
 */
export function BillDetailsStatus({ bill }) {
  return (
    <Choose>
      <Choose.When condition={bill.is_fully_paid && bill.is_open}>
        <StatusTag intent={Intent.SUCCESS} round={true}>
          <T id={'paid'} />
        </StatusTag>
      </Choose.When>

      <Choose.When condition={bill.is_open}>
        <Choose>
          <Choose.When condition={bill.is_overdue}>
            <StatusTag intent={Intent.WARNING} round={true}>
              <T id={'overdue'} />
            </StatusTag>
          </Choose.When>
          <Choose.Otherwise>
            <StatusTag intent={Intent.PRIMARY} round={true}>
              <T id={'due'} />
            </StatusTag>
          </Choose.Otherwise>
        </Choose>
      </Choose.When>
      <Choose.Otherwise>
        <StatusTag round={true} minimal={true}>
          <T id={'draft'} />
        </StatusTag>
      </Choose.Otherwise>
    </Choose>
  );
}

export const BillMenuItem = ({
  payload: { onConvert, onAllocateLandedCost },
}) => {
  return (
    <Popover
      minimal={true}
      interactionKind={PopoverInteractionKind.CLICK}
      position={Position.BOTTOM_LEFT}
      modifiers={{
        offset: { offset: '0, 4' },
      }}
      content={
        <Menu>
          <MenuItem
            onClick={onAllocateLandedCost}
            text={<T id={'bill.allocate_landed_coast'} />}
          />
          <MenuItem
            onClick={onConvert}
            text={<T id={'bill.convert_to_credit_note'} />}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};

const StatusTag = styled(Tag)`
  min-width: 65px;
  text-align: center;
`;
