import { Card, H4, HTMLTable, Intent, Tag, Text } from '@blueprintjs/core';
import { useBillingPageBoot } from './BillingPageBoot';

const STATUS_INTENTS: Record<string, Intent> = {
  paid: Intent.SUCCESS,
  open: Intent.WARNING,
  void: Intent.NONE,
  uncollectible: Intent.DANGER,
  draft: Intent.NONE,
};

/**
 * Recent Stripe invoices for the organization.
 */
export function BillingInvoices() {
  const { billingOverview } = useBillingPageBoot();

  if (!billingOverview?.customer) {
    return null;
  }

  const invoices = billingOverview.invoices || [];

  return (
    <Card style={{ marginTop: '2rem' }}>
      <H4 style={{ marginTop: 0 }}>Invoices</H4>

      {invoices.length ? (
        <HTMLTable condensed interactive style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.number || invoice.id}</td>
                <td>{invoice.createdAtFormatted}</td>
                <td>{invoice.amountFormatted}</td>
                <td>
                  <Tag
                    minimal
                    intent={STATUS_INTENTS[invoice.status || ''] || Intent.NONE}
                  >
                    {invoice.status || 'unknown'}
                  </Tag>
                </td>
                <td>
                  {invoice.hostedInvoiceUrl || invoice.invoicePdf ? (
                    <a
                      href={
                        invoice.hostedInvoiceUrl || invoice.invoicePdf || ''
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      ) : (
        <Text className="bp4-text-muted">No invoices yet.</Text>
      )}
    </Card>
  );
}
