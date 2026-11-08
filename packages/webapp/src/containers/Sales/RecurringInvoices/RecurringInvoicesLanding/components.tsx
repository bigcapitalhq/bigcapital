import { Intent, Menu, MenuDivider, MenuItem, Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { RecurringInvoicesListResponse } from '@bigcapital/sdk-ts';
import { Can, Icon } from '@/components';
import {
  AbilitySubject,
  RecurringInvoiceAction,
} from '@/constants/abilityOption';
import { safeCallback } from '@/utils';

export type RecurringInvoiceTableRow = NonNullable<
  RecurringInvoicesListResponse['data']
>[number];

interface RecurringInvoiceActionsPayload {
  onEdit: (recurringInvoice: RecurringInvoiceTableRow) => void;
  onDelete: (recurringInvoice: RecurringInvoiceTableRow) => void;
  onPause: (recurringInvoice: RecurringInvoiceTableRow) => void;
  onResume: (recurringInvoice: RecurringInvoiceTableRow) => void;
  onGenerate: (recurringInvoice: RecurringInvoiceTableRow) => void;
  onViewInvoices: (recurringInvoice: RecurringInvoiceTableRow) => void;
  onViewDetails: (recurringInvoice: RecurringInvoiceTableRow) => void;
}

interface ActionsMenuProps {
  row: { original: RecurringInvoiceTableRow };
  payload: RecurringInvoiceActionsPayload;
}

export function RecurringInvoiceStatus({
  status,
  failureCount,
}: {
  status: string;
  failureCount?: number;
}) {
  if (failureCount && failureCount > 0) {
    return (
      <Tag intent={Intent.WARNING} round minimal>
        {intl.get('recurring_invoice.status.needs_attention')}
      </Tag>
    );
  }
  const intents = {
    active: Intent.SUCCESS,
    paused: Intent.WARNING,
    completed: Intent.NONE,
  } as Record<string, Intent>;

  return (
    <Tag intent={intents[status] ?? Intent.NONE} round minimal>
      {intl.get(`recurring_invoice.status.${status}`)}
    </Tag>
  );
}

export function ActionsMenu({
  row: { original },
  payload: {
    onEdit,
    onDelete,
    onPause,
    onResume,
    onGenerate,
    onViewInvoices,
    onViewDetails,
  },
}: ActionsMenuProps) {
  return (
    <Menu>
      <MenuItem
        icon={<Icon icon="reader-18" />}
        text={intl.get('view_details')}
        onClick={safeCallback(onViewDetails, original)}
      />
      <MenuItem
        icon={<Icon icon="document" />}
        text={intl.get('recurring_invoice.view_generated_invoices')}
        onClick={safeCallback(onViewInvoices, original)}
      />
      <Can I={RecurringInvoiceAction.Edit} a={AbilitySubject.RecurringInvoice}>
        <MenuDivider />
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={intl.get('edit_recurring_invoice')}
          onClick={safeCallback(onEdit, original)}
        />
        <MenuItem
          icon={<Icon icon="refresh" />}
          text={intl.get('recurring_invoice.generate_now')}
          onClick={safeCallback(onGenerate, original)}
        />
        {original.status === 'paused' ? (
          <MenuItem
            icon={<Icon icon="play" />}
            text={intl.get('recurring_invoice.resume')}
            onClick={safeCallback(onResume, original)}
          />
        ) : (
          original.status === 'active' && (
            <MenuItem
              icon={<Icon icon="pause" />}
              text={intl.get('recurring_invoice.pause')}
              onClick={safeCallback(onPause, original)}
            />
          )
        )}
      </Can>
      <Can
        I={RecurringInvoiceAction.Delete}
        a={AbilitySubject.RecurringInvoice}
      >
        <MenuDivider />
        <MenuItem
          text={intl.get('delete_recurring_invoice')}
          intent={Intent.DANGER}
          onClick={safeCallback(onDelete, original)}
          icon={<Icon icon="trash-16" iconSize={16} />}
        />
      </Can>
    </Menu>
  );
}

export const useRecurringInvoicesTableColumns = (): Array<
  DataTableColumn<RecurringInvoiceTableRow>
> => {
  return React.useMemo(
    () => [
      {
        id: 'profile_name',
        Header: intl.get('recurring_invoice.field.profile_name'),
        accessor: 'profileName',
        width: 190,
        className: 'profile_name',
      },
      {
        id: 'customer',
        Header: intl.get('recurring_invoice.field.customer'),
        accessor: (row) => row.customer?.displayName,
        width: 170,
      },
      {
        id: 'frequency',
        Header: intl.get('recurring_invoice.field.frequency'),
        accessor: (row) =>
          intl.get('recurring_invoice.frequency_summary', {
            interval: row.repeatInterval,
            frequency: intl.get(`recurring_invoice.frequency.${row.frequency}`),
          }),
        width: 150,
      },
      {
        id: 'next_invoice_date',
        Header: intl.get('recurring_invoice.field.next_invoice_date'),
        accessor: (row) => row.nextInvoiceDateFormatted || row.nextInvoiceDate,
        width: 150,
      },
      {
        id: 'last_invoice_date',
        Header: intl.get('recurring_invoice.field.last_invoice_date'),
        accessor: (row) => row.lastInvoiceDateFormatted || row.lastInvoiceDate,
        width: 150,
      },
      {
        id: 'total',
        Header: intl.get('recurring_invoice.field.amount'),
        accessor: (row) => row.totalFormatted,
        width: 130,
        align: 'right',
        money: true,
      },
      {
        id: 'status',
        Header: intl.get('recurring_invoice.field.status'),
        accessor: (row) => (
          <RecurringInvoiceStatus
            status={row.status}
            failureCount={row.failureCount}
          />
        ),
        width: 120,
      },
    ],
    [],
  );
};
