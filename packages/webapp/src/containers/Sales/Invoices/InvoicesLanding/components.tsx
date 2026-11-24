import { Intent, Tag, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import intl from 'react-intl-universal';
import type { SaleInvoicesListResponse } from '@bigcapital/sdk-ts';
import type { BP_TableFeatures } from '@bigcapitalhq/blueprintjs-react-table';
import {
  FormatDate,
  FormattedMessage as T,
  AppToaster,
  Choose,
  If,
  Icon,
  Can,
} from '@/components';
import { MoneyDisplay } from '@/components/Money/MoneyDisplay';
import {
  SaleInvoiceAction,
  PaymentReceiveAction,
  AbilitySubject,
} from '@/constants/abilityOption';
import { formattedAmount, safeCallback } from '@/utils';

export type InvoiceTableRow = NonNullable<
  SaleInvoicesListResponse['data']
>[number];

interface InvoiceActionsPayload {
  onEdit: (invoice: InvoiceTableRow) => void;
  onDeliver: (invoice: InvoiceTableRow) => void;
  onDelete: (invoice: InvoiceTableRow) => void;
  onConvert: (invoice: InvoiceTableRow) => void;
  onQuick: (invoice: InvoiceTableRow) => void;
  onViewDetails: (invoice: InvoiceTableRow) => void;
  onPrint: (invoice: InvoiceTableRow) => void;
  onSendMail: (invoice: InvoiceTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: InvoiceTableRow };
  payload: InvoiceActionsPayload;
}

interface DeleteError {
  type: string;
}

export function InvoiceStatus({ invoice }: { invoice: InvoiceTableRow }) {
  return (
    <Choose>
      <Choose.When condition={!!(invoice.isFullyPaid && invoice.isDelivered)}>
        <Tag intent={Intent.SUCCESS} round minimal>
          <T id={'paid'} />
        </Tag>
      </Choose.When>

      <Choose.When condition={!!(invoice.isDelivered && invoice.isOverdue)}>
        <Tag intent={Intent.DANGER} round minimal>
          {intl.get('overdue_by', { overdue: invoice.overdueDays })}
        </Tag>
      </Choose.When>

      <Choose.When condition={!!(invoice.isDelivered && !invoice.isOverdue)}>
        <Tag intent={Intent.WARNING} round minimal>
          {intl.get('due_in', { due: invoice.remainingDays })}
        </Tag>
      </Choose.When>

      <Choose.When condition={!!invoice.isPartiallyPaid}>
        <Tag intent={Intent.PRIMARY} round minimal>
          {intl.get('day_partially_paid', {
            due: formattedAmount(invoice.dueAmount, invoice.currencyCode),
          })}
        </Tag>
      </Choose.When>

      <Choose.Otherwise>
        <Tag round minimal>
          <T id={'draft'} />
        </Tag>
      </Choose.Otherwise>
    </Choose>
  );
}

export const handleDeleteErrors = (errors: DeleteError[]) => {
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
}: ActionsMenuProps) {
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
        <If condition={!original.isDelivered}>
          <MenuItem
            icon={<Icon icon="send" iconSize={16} />}
            text={intl.get('mark_as_delivered')}
            onClick={safeCallback(onDeliver, original)}
          />
        </If>
      </Can>
      <Can I={PaymentReceiveAction.Create} a={AbilitySubject.PaymentReceive}>
        <If condition={!!(original.isDelivered && !original.isFullyPaid)}>
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

const column = createColumnHelper<BP_TableFeatures, InvoiceTableRow>();

export function useInvoicesTableColumns() {
  return React.useMemo(
    () =>
      column.columns([
        column.accessor('invoiceDateFormatted', {
          id: 'invoice_date',
          header: intl.get('invoice_date'),
          size: 110,
        }),
        column.accessor((invoice) => invoice.customer?.displayName, {
          id: 'customer',
          header: intl.get('customer_name'),
          size: 180,
        }),
        column.accessor('invoiceNo', {
          id: 'invoice_no',
          header: intl.get('invoice_no__'),
          size: 100,
        }),
        column.accessor('totalFormatted', {
          id: 'amount',
          header: intl.get('amount'),
          size: 120,
          meta: { textAlign: 'right' },
          cell: ({ getValue }) => <MoneyDisplay>{getValue()}</MoneyDisplay>,
        }),
        column.accessor((invoice) => invoice, {
          id: 'status',
          header: intl.get('status'),
          size: 160,
          cell: ({ getValue }) => <InvoiceStatus invoice={getValue()} />,
        }),
        column.accessor('dueDate', {
          id: 'due_date',
          header: intl.get('due_date'),
          size: 110,
          cell: ({ getValue }) => <FormatDate value={getValue()} />,
        }),
        column.accessor('referenceNo', {
          id: 'reference_no',
          header: intl.get('reference_no'),
          size: 90,
        }),
      ]),
    [],
  );
}
