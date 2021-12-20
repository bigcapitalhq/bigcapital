import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { Intent, Tag } from '@blueprintjs/core';

import {
  FormatNumberCell,
  FormattedMessage as T,
  Choose,
} from '../../../components';

/**
 * Retrieve bill readonly details entries table columns.
 */
export const useBillReadonlyEntriesTableColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        width: 150,
        className: 'item',
        disableSortBy: true,
      },
      {
        Header: intl.get('description'),
        accessor: 'description',
        className: 'description',
        disableSortBy: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('rate'),
        accessor: 'rate',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
      {
        Header: intl.get('amount'),
        accessor: 'amount',
        Cell: FormatNumberCell,
        width: 100,
        align: 'right',
        disableSortBy: true,
      },
    ],
    [],
  );

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
              Overdue
            </StatusTag>
          </Choose.When>
          <Choose.Otherwise>
            <StatusTag intent={Intent.PRIMARY} round={true}>
              Due
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

const StatusTag = styled(Tag)`
  min-width: 65px;
  text-align: center;
`;
