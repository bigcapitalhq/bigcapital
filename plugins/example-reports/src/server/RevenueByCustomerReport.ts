import type {
  ReportContext,
  ReportProvider,
  ReportResult,
} from '@bigcapital/extension-sdk/bridges';

export const REVENUE_BY_CUSTOMER_REPORT_ID = 'revenue-by-customer';

interface RevenueParameters {
  from?: string;
  to?: string;
}

interface TransactionRow {
  customerId?: number | null;
  balance?: number | string | null;
  paymentAmount?: number | string | null;
  creditedAmount?: number | string | null;
  writtenoffAmount?: number | string | null;
  total?: number | string | null;
}

interface ContactRow {
  id: number;
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

export const revenueByCustomerReport: ReportProvider = {
  key: 'default',

  list: () => [
    {
      id: REVENUE_BY_CUSTOMER_REPORT_ID,
      name: 'Revenue by Customer',
      description: 'Total invoiced revenue grouped by customer.',
      category: 'sales',
      parametersSchema: {
        type: 'object',
        properties: {
          from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        },
      },
    },
  ],

  run: async (
    reportId: string,
    context: ReportContext,
  ): Promise<ReportResult> => {
    if (reportId !== REVENUE_BY_CUSTOMER_REPORT_ID) {
      throw new Error(`Unknown example report "${reportId}".`);
    }

    const parameters = (context.parameters ?? {}) as RevenueParameters;

    const [transactions, contacts] = await Promise.all([
      context.query.transactions.list({
        from: parameters.from,
        to: parameters.to,
      }),
      context.query.contacts.list(),
    ]);

    const contactsById = new Map<number, ContactRow>();

    (contacts as ContactRow[]).forEach((contact) => {
      contactsById.set(Number(contact.id), contact);
    });

    const totals = new Map<number, number>();

    (transactions as TransactionRow[]).forEach((transaction) => {
      if (transaction.customerId == null) {
        return;
      }

      const customerId = Number(transaction.customerId);

      if (!Number.isFinite(customerId)) {
        return;
      }

      totals.set(
        customerId,
        (totals.get(customerId) ?? 0) + invoiceTotal(transaction),
      );
    });

    const rows = Array.from(totals.entries())
      .map(([customerId, total]) => ({
        customerId,
        customer: customerDisplayName(contactsById.get(customerId), customerId),
        total,
      }))
      .sort((a, b) => b.total - a.total);

    return {
      columns: [
        { key: 'customer', label: 'Customer' },
        { key: 'total', label: 'Revenue' },
      ],
      rows,
      meta: {
        from: parameters.from ?? null,
        to: parameters.to ?? null,
      },
    };
  },
};

/**
 * Reconstructs the original invoice total from the remaining balance plus
 * payments, credits, and write-offs. Falls back to `total` for simple rows
 * (for example, in tests or future facades).
 */
function invoiceTotal(transaction: TransactionRow): number {
  const components = [
    transaction.balance,
    transaction.paymentAmount,
    transaction.creditedAmount,
    transaction.writtenoffAmount,
  ].filter((value) => value !== undefined && value !== null);

  if (components.length > 0) {
    return components.reduce<number>(
      (sum, value) => sum + Number(value ?? 0),
      0,
    );
  }

  return Number(transaction.total ?? 0);
}

function customerDisplayName(
  contact: ContactRow | undefined,
  customerId: number,
): string {
  const displayName = contact?.displayName?.trim();

  if (displayName) {
    return displayName;
  }

  const fullName = [contact?.firstName, contact?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || `Customer ${customerId}`;
}
