import { Classes, Dialog, HTMLTable, Spinner } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { useRecurringInvoiceFormContext } from './RecurringInvoiceFormProvider';
import { useRecurringInvoiceInvoices } from '@/hooks/query';

export function RecurringInvoiceGeneratedInvoicesDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { recurringInvoice } = useRecurringInvoiceFormContext();
  const { data, isLoading } = useRecurringInvoiceInvoices(
    isOpen ? recurringInvoice?.id : undefined,
    { pageSize: 100 },
    { enabled: isOpen && !!recurringInvoice?.id },
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={intl.get('recurring_invoice.generated_invoices')}
      icon={'document'}
      style={{ width: 760 }}
    >
      <div className={Classes.DIALOG_BODY}>
        {isLoading ? (
          <Spinner />
        ) : (
          <HTMLTable striped interactive style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>{intl.get('invoice_number')}</th>
                <th>{intl.get('invoice_date')}</th>
                <th>{intl.get('due_date')}</th>
                <th style={{ textAlign: 'right' }}>{intl.get('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {(data?.data ?? []).map((invoice: any) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNo}</td>
                  <td>{invoice.invoiceDateFormatted}</td>
                  <td>{invoice.dueDateFormatted}</td>
                  <td style={{ textAlign: 'right' }}>
                    {invoice.totalFormatted}
                  </td>
                </tr>
              ))}
              {!isLoading && (data?.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center' }}>
                    {intl.get('recurring_invoice.no_generated_invoices')}
                  </td>
                </tr>
              )}
            </tbody>
          </HTMLTable>
        )}
      </div>
    </Dialog>
  );
}
