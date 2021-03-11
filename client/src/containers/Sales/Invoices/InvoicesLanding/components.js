import React from 'react';
import {
  Intent,
  Tag,
  Menu,
  MenuItem,
  MenuDivider,
  ProgressBar,
  Popover,
  Position,
  Button,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';
import moment from 'moment';
import { round } from 'lodash';
import { Choose, If, Icon } from 'components';
import { Money, AppToaster } from 'components';
import { formatMessage } from 'services/intl';
import { safeCallback } from 'utils';

const calculateStatus = (paymentAmount, balanceAmount) => {
  return round(paymentAmount / balanceAmount, 2);
};

export const statusAccessor = (row) => {
  return (
    <div className={'status-accessor'}>
      <Choose>
        <Choose.When condition={row.is_fully_paid && row.is_delivered}>
          <span className={'fully-paid-icon'}>
            <Icon icon="small-tick" iconSize={18} />
          </span>
          <span class="fully-paid-text">
            <T id={'paid'} />
          </span>
        </Choose.When>

        <Choose.When condition={row.is_delivered}>
          <Choose>
            <Choose.When condition={row.is_overdue}>
              <span className={'overdue-status'}>
                <T id={'overdue_by'} values={{ overdue: row.overdue_days }} />
              </span>
            </Choose.When>
            <Choose.Otherwise>
              <span className={'due-status'}>
                <T id={'due_in'} values={{ due: row.remaining_days }} />
              </span>
            </Choose.Otherwise>
          </Choose>

          <If condition={row.is_partially_paid}>
            <span class="partial-paid">
              <T
                id={'day_partially_paid'}
                values={{
                  due: <Money amount={row.due_amount} currency={'USD'} />,
                }}
              />
            </span>
            <ProgressBar
              animate={false}
              stripes={false}
              intent={Intent.PRIMARY}
              value={calculateStatus(row.payment_amount, row.balance)}
            />
          </If>
        </Choose.When>
        <Choose.Otherwise>
          <Tag minimal={true}>
            <T id={'draft'} />
          </Tag>
        </Choose.Otherwise>
      </Choose>
    </div>
  );
};

export const handleDeleteErrors = (errors) => {
  if (
    errors.find(
      (error) => error.type === 'INVOICE_HAS_ASSOCIATED_PAYMENT_ENTRIES',
    )
  ) {
    AppToaster.show({
      message: formatMessage({
        id: 'the_invoice_cannot_be_deleted',
      }),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT',
    )
  ) {
    AppToaster.show({
      message: formatMessage({
        id: 'the_payment_amount_that_received',
      }),
      intent: Intent.DANGER,
    });
  }
};

export function ActionsMenu({
  payload: { onEdit, onDeliver, onDelete, onDrawer },
  row: { original },
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={formatMessage({ id: 'view_details' })}
      />
      <MenuDivider />
      <MenuItem
        icon={<Icon icon="pen-18" />}
        text={formatMessage({ id: 'edit_invoice' })}
        onClick={safeCallback(onEdit, original)}
      />
      <If condition={!original.is_delivered}>
        <MenuItem
          icon={<Icon icon="send" iconSize={16} />}
          text={formatMessage({ id: 'mark_as_delivered' })}
          onClick={safeCallback(onDeliver, original)}
        />
      </If>
      <MenuItem
        icon={<Icon icon={'receipt-24'} iconSize={16} />}
        text={formatMessage({ id: 'invoice_paper' })}
        onClick={safeCallback(onDrawer, original)}
      />
      <MenuItem
        text={formatMessage({ id: 'delete_invoice' })}
        intent={Intent.DANGER}
        onClick={safeCallback(onDelete, original)}
        icon={<Icon icon="trash-16" iconSize={16} />}
      />
    </Menu>
  );
}

function ActionsCell(props) {
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
 * Retrieve invoices table columns.
 */
export function useInvoicesTableColumns() {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'invoice_date',
        Header: formatMessage({ id: 'invoice_date' }),
        accessor: (r) => moment(r.invoice_date).format('YYYY MMM DD'),
        width: 110,
        className: 'invoice_date',
      },
      {
        id: 'customer',
        Header: formatMessage({ id: 'customer_name' }),
        accessor: 'customer.display_name',
        width: 180,
        className: 'customer_id',
      },
      {
        id: 'balance',
        Header: formatMessage({ id: 'balance' }),
        accessor: (r) => <Money amount={r.balance} currency={r.currency_code} />,
        width: 110,
        className: 'balance',
      },
      {
        id: 'invoice_no',
        Header: formatMessage({ id: 'invoice_no__' }),
        accessor: 'invoice_no',
        width: 100,
        className: 'invoice_no',
      },
      {
        id: 'status',
        Header: formatMessage({ id: 'status' }),
        accessor: (row) => statusAccessor(row),
        width: 160,
        className: 'status',
      },
      {
        id: 'due_date',
        Header: formatMessage({ id: 'due_date' }),
        accessor: (r) => moment(r.due_date).format('YYYY MMM DD'),
        width: 110,
        className: 'due_date',
      },
      {
        id: 'reference_no',
        Header: formatMessage({ id: 'reference_no' }),
        accessor: 'reference_no',
        width: 90,
        className: 'reference_no',
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
    [formatMessage],
  );
}
