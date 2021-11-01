import React from 'react';
import intl from 'react-intl-universal';

import {
  Button,
  Popover,
  PopoverInteractionKind,
  Position,
  MenuItem,
  Menu,
} from '@blueprintjs/core';
import { If, Icon, FormattedMessage as T, Choose } from 'components';
import { FormatNumberCell } from '../../../components';

/**
 * Retrieve invoice readonly details table columns.
 */
export const useInvoiceReadonlyEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('product_and_service'),
        accessor: 'item.name',
        width: 150,
        className: 'name',
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

export const BadDebtMenuItem = ({ invoice, onDialog, onAlert }) => {
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
          <Choose>
            <Choose.When condition={!invoice.is_writtenoff}>
              <MenuItem text={<T id={'badDebt.label'} />} onClick={onDialog} />
            </Choose.When>
            <Choose.When condition={invoice.is_writtenoff}>
              <MenuItem
                onClick={onAlert}
                text={<T id={'badDebt.label_cancel_bad_debt'} />}
              />
            </Choose.When>
          </Choose>
        </Menu>
      }
      position={Position.BOTTOM}
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};
