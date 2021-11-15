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
import clsx from 'classnames';
import { CLASSES } from '../../../common/classes';
import {
  Icon,
  FormattedMessage as T,
  Choose,
  FormatDateCell,
  FormatNumberCell,
} from '../../../components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

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

export const BadDebtMenuItem = ({
  payload: { onCancelBadDebt, onBadDebt, onNotifyViaSMS },
}) => {
  const { invoice } = useInvoiceDetailDrawerContext();

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
              <MenuItem
                text={<T id={'bad_debt.dialog.bad_debt'} />}
                onClick={onBadDebt}
              />
            </Choose.When>
            <Choose.When condition={invoice.is_writtenoff}>
              <MenuItem
                onClick={onCancelBadDebt}
                text={<T id={'bad_debt.dialog.cancel_bad_debt'} />}
              />
            </Choose.When>
          </Choose>
          <MenuItem
            onClick={onNotifyViaSMS}
            text={<T id={'notify_via_sms.dialog.notify_via_sms'} />}
          />
        </Menu>
      }
    >
      <Button icon={<Icon icon="more-vert" iconSize={16} />} minimal={true} />
    </Popover>
  );
};

/**
 * Retrieve invoice payment transactions table columns.
 */
export const useInvoicePaymentTransactionsColumns = () => {
  return React.useMemo(
    () => [
      {
        id: 'date',
        Header: intl.get('payment_date'),
        accessor: 'date',
        Cell: FormatDateCell,
        width: 110,
        className: 'date',
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'amount',
        // accessor: 'formatted_amount',
        align: 'right',
        width: 120,
        className: clsx(CLASSES.FONT_BOLD),
        textOverview: true,
      },
      {
        id: 'payment_receive_no.',
        Header: intl.get('payment_no'),
        accessor: 'payment_receive_no',
        width: 100,
        className: 'payment_receive_no',
      },
      {
        id: 'reference_no',
        Header: intl.get('reference_no'),
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
};
