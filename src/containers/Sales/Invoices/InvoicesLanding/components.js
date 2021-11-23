import React from 'react';
import {
  Intent,
  Tag,
  Menu,
  MenuItem,
  MenuDivider,
  ProgressBar,
} from '@blueprintjs/core';
import intl from 'react-intl-universal';
import clsx from 'classnames';

import { CLASSES } from '../../../../common/classes';
import {
  FormatDateCell,
  FormattedMessage as T,
  AppToaster,
  Choose,
  If,
  Icon,
  Can,
} from 'components';
import { formattedAmount, safeCallback, calculateStatus } from 'utils';
import {
  Invoice_Abilities,
  PaymentReceive,
  AbilitySubject,
} from '../../../../common/abilityOption';

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
                {intl.get('overdue_by', { overdue: row.overdue_days })}
              </span>
            </Choose.When>
            <Choose.Otherwise>
              <span className={'due-status'}>
                {intl.get('due_in', { due: row.remaining_days })}
              </span>
            </Choose.Otherwise>
          </Choose>

          <If condition={row.is_partially_paid}>
            <span class="partial-paid">
              {intl.get('day_partially_paid', {
                due: formattedAmount(row.due_amount, row.currency_code),
              })}
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
      message: intl.get('the_invoice_cannot_be_deleted'),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find(
      (error) => error.type === 'INVOICE_AMOUNT_SMALLER_THAN_PAYMENT_AMOUNT',
    )
  ) {
    AppToaster.show({
      message: intl.get('the_payment_amount_that_received'),
      intent: Intent.DANGER,
    });
  }
};

export function ActionsMenu({
  payload: {
    onEdit,
    onDeliver,
    onDelete,
    onDrawer,
    onQuick,
    onViewDetails,
    onPrint,
  },
  row: { original },
}) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <Can I={Invoice_Abilities.Edit} a={AbilitySubject.Invoice}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_invoice')}
          onClick={safeCallback(onEdit, original)}
        />

        <If condition={!original.is_delivered}>
          <MenuItem
            icon={<Icon icon="send" iconSize={16} />}
            text={intl.get('mark_as_delivered')}
            onClick={safeCallback(onDeliver, original)}
          />
        </If>
      </Can>
      <Can I={PaymentReceive.Create} a={AbilitySubject.PaymentReceive}>
        <If condition={original.is_delivered && !original.is_fully_paid}>
          <MenuItem
            icon={<Icon icon="quick-payment-16" iconSize={16} />}
            text={intl.get('add_payment')}
            onClick={safeCallback(onQuick, original)}
          />
        </If>
      </Can>
      <Can I={Invoice_Abilities.View} a={AbilitySubject.Invoice}>
        <MenuItem
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={intl.get('print')}
          onClick={safeCallback(onPrint, original)}
        />
      </Can>
      <Can I={Invoice_Abilities.Delete} a={AbilitySubject.Invoice}>
        <MenuItem
          text={intl.get('delete_invoice')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

/**
 * Retrieve invoices table columns.
 */
export function useInvoicesTableColumns() {
  return React.useMemo(
    () => [
      {
        id: 'invoice_date',
        Header: intl.get('invoice_date'),
        accessor: 'invoice_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'invoice_date',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'customer',
        Header: intl.get('customer_name'),
        accessor: 'customer.display_name',
        width: 180,
        className: 'customer_id',
        clickable: true,
        textOverview: true,
      },

      {
        id: 'invoice_no',
        Header: intl.get('invoice_no__'),
        accessor: 'invoice_no',
        width: 100,
        className: 'invoice_no',
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('balance'),
        accessor: 'formatted_amount',
        width: 120,
        align: 'right',
        clickable: true,
        textOverview: true,
        className: clsx(CLASSES.FONT_BOLD),
      },
      {
        id: 'status',
        Header: intl.get('status'),
        accessor: (row) => statusAccessor(row),
        width: 160,
        className: 'status',
        clickable: true,
      },
      {
        id: 'due_date',
        Header: intl.get('due_date'),
        accessor: 'due_date',
        Cell: FormatDateCell,
        width: 110,
        className: 'due_date',
        clickable: true,
        textOverview: true,
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
}
