// @ts-nocheck
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
import { CLASSES } from '@/constants/classes';
import {
  FormatDateCell,
  FormattedMessage as T,
  AppToaster,
  Choose,
  If,
  Icon,
  Can,
} from '@/components';
import { formattedAmount, safeCallback, calculateStatus } from '@/utils';
import {
  SaleInvoiceAction,
  PaymentReceiveAction,
  AbilitySubject,
} from '@/constants/abilityOption';

export function InvoiceStatus({ invoice }) {
  return (
    <Choose>
      <Choose.When condition={invoice.is_fully_paid && invoice.is_delivered}>
        <span className={'fully-paid-icon'}>
          <Icon icon="small-tick" iconSize={18} />
        </span>
        <span class="fully-paid-text">
          <T id={'paid'} />
        </span>
      </Choose.When>

      <Choose.When condition={invoice.is_delivered}>
        <Choose>
          <Choose.When condition={invoice.is_overdue}>
            <span className={'overdue-status'}>
              {intl.get('overdue_by', { overdue: invoice.overdue_days })}
            </span>
          </Choose.When>
          <Choose.Otherwise>
            <span className={'due-status'}>
              {intl.get('due_in', { due: invoice.remaining_days })}
            </span>
          </Choose.Otherwise>
        </Choose>

        <If condition={invoice.is_partially_paid}>
          <span class="partial-paid">
            {intl.get('day_partially_paid', {
              due: formattedAmount(invoice.due_amount, invoice.currency_code),
            })}
          </span>
          <ProgressBar
            animate={false}
            stripes={false}
            intent={Intent.PRIMARY}
            value={calculateStatus(invoice.balance_amount, invoice.balance)}
          />
        </If>
      </Choose.When>
      <Choose.Otherwise>
        <Tag minimal={true} round={true}>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

export const statusAccessor = (row) => {
  return (
    <div className={'status-accessor'}>
      <InvoiceStatus invoice={row} />
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
  if (
    errors.find(
      (error) => error.type === 'SALE_INVOICE_HAS_APPLIED_TO_CREDIT_NOTES',
    )
  ) {
    AppToaster.show({
      message: intl.get(
        'invoices.error.you_couldn_t_delete_sale_invoice_that_has_reconciled',
      ),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((e) => e.type === 'CANNOT_DELETE_TRANSACTION_MATCHED')) {
    AppToaster.show({
      intent: Intent.DANGER,
      message: 'Cannot delete a transaction matched with a bank transaction.',
    });
  }
};

export function ActionsMenu({
  payload: {
    onEdit,
    onDeliver,
    onDelete,
    onConvert,
    onQuick,
    onViewDetails,
    onPrint,
    onSendMail,
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
      <Can I={SaleInvoiceAction.Edit} a={AbilitySubject.Invoice}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_invoice')}
          onClick={safeCallback(onEdit, original)}
        />
        <MenuItem
          icon={<Icon icon="convert_to" />}
          text={intl.get('invoice.convert_to_credit_note')}
          onClick={safeCallback(onConvert, original)}
        />
        <If condition={!original.is_delivered}>
          <MenuItem
            icon={<Icon icon="send" iconSize={16} />}
            text={intl.get('mark_as_delivered')}
            onClick={safeCallback(onDeliver, original)}
          />
        </If>
      </Can>
      <Can I={PaymentReceiveAction.Create} a={AbilitySubject.PaymentReceive}>
        <If condition={original.is_delivered && !original.is_fully_paid}>
          <MenuItem
            icon={<Icon icon="quick-payment-16" iconSize={16} />}
            text={intl.get('add_payment')}
            onClick={safeCallback(onQuick, original)}
          />
        </If>
      </Can>
      <Can I={SaleInvoiceAction.View} a={AbilitySubject.Invoice}>
        <MenuItem
          icon={<Icon icon={'envelope'} iconSize={16} />}
          text={'Send Mail'}
          onClick={safeCallback(onSendMail, original)}
        />
        <MenuItem
          icon={<Icon icon={'print-16'} iconSize={16} />}
          text={intl.get('print')}
          onClick={safeCallback(onPrint, original)}
        />
      </Can>
      <Can I={SaleInvoiceAction.Delete} a={AbilitySubject.Invoice}>
        <MenuDivider />
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
        accessor: 'invoice_date_formatted',
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
        clickable: true,
        textOverview: true,
      },
      {
        id: 'amount',
        Header: intl.get('amount'),
        accessor: 'total_formatted',
        width: 120,
        align: 'right',
        clickable: true,
        textOverview: true,
        money: true,
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
        clickable: true,
        textOverview: true,
      },
    ],
    [],
  );
}
