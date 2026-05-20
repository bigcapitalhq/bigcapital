export type TranslateFn = (key: string, options?: { args?: Record<string, any> }) => string;

const defaultT: TranslateFn = (key) => key;

/**
 * Format camelCase subject to readable text using i18n.
 */
export function formatSubject(subject: string, t: TranslateFn = defaultT): string {
  return t(`audit_log.subject.${subject}`);
}

/**
 * Format action to capitalized text using i18n.
 */
export function formatAction(action: string, t: TranslateFn = defaultT): string {
  if (!action) return '';
  return t(`audit_log.action.${action}`);
}

/**
 * Format metadata into a human-readable summary based on subject type.
 */
export function formatMetadataSummary(
  metadata: Record<string, unknown> | null,
  subject: string,
  t: TranslateFn = defaultT,
): string {
  if (metadata == null) return '';

  const formatters: Record<string, (m: Record<string, unknown>) => string> = {
    Bill: (m) => {
      if (m.billNumber) {
        return m.amount
          ? t('audit_log.metadata.bill_with_amount', {
              args: { billNumber: String(m.billNumber), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.bill', {
              args: { billNumber: String(m.billNumber) },
            });
      }
      return String(m.billNumber || '');
    },
    SaleInvoice: (m) => {
      if (m.invoiceNumber) {
        return m.balance
          ? t('audit_log.metadata.invoice_with_balance', {
              args: { invoiceNumber: String(m.invoiceNumber), balance: String(m.balance), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.invoice', {
              args: { invoiceNumber: String(m.invoiceNumber) },
            });
      }
      return String(m.invoiceNumber || '');
    },
    SaleReceipt: (m) => {
      if (m.receiptNumber) {
        return m.amount
          ? t('audit_log.metadata.receipt_with_amount', {
              args: { receiptNumber: String(m.receiptNumber), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.receipt', {
              args: { receiptNumber: String(m.receiptNumber) },
            });
      }
      return String(m.receiptNumber || '');
    },
    SaleEstimate: (m) => {
      if (m.estimateNumber) {
        return m.total
          ? t('audit_log.metadata.estimate_with_total', {
              args: { estimateNumber: String(m.estimateNumber), total: String(m.total), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.estimate', {
              args: { estimateNumber: String(m.estimateNumber) },
            });
      }
      return String(m.estimateNumber || '');
    },
    PaymentReceive: (m) => {
      if (m.paymentReceiveNo) {
        return m.amount
          ? t('audit_log.metadata.payment_receive_with_amount', {
              args: { paymentReceiveNo: String(m.paymentReceiveNo), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.payment_receive', {
              args: { paymentReceiveNo: String(m.paymentReceiveNo) },
            });
      }
      return String(m.paymentReceiveNo || '');
    },
    PaymentMade: (m) => {
      if (m.paymentNumber) {
        return m.amount
          ? t('audit_log.metadata.payment_made_with_amount', {
              args: { paymentNumber: String(m.paymentNumber), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.payment_made', {
              args: { paymentNumber: String(m.paymentNumber) },
            });
      }
      return String(m.paymentNumber || '');
    },
    Expense: (m) => {
      if (m.amount) {
        return m.currencyCode
          ? t('audit_log.metadata.expense_with_currency', {
              args: { amount: String(m.amount), currencyCode: String(m.currencyCode) },
            })
          : t('audit_log.metadata.expense', {
              args: { amount: String(m.amount) },
            });
      }
      return t('audit_log.metadata.expense_plain');
    },
    CreditNote: (m) => {
      if (m.creditNoteNumber) {
        return m.amount
          ? t('audit_log.metadata.credit_note_with_amount', {
              args: { creditNoteNumber: String(m.creditNoteNumber), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.credit_note', {
              args: { creditNoteNumber: String(m.creditNoteNumber) },
            });
      }
      return String(m.creditNoteNumber || '');
    },
    VendorCredit: (m) => {
      if (m.vendorCreditNumber) {
        return m.total
          ? t('audit_log.metadata.vendor_credit_with_total', {
              args: { vendorCreditNumber: String(m.vendorCreditNumber), total: String(m.total), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.vendor_credit', {
              args: { vendorCreditNumber: String(m.vendorCreditNumber) },
            });
      }
      return String(m.vendorCreditNumber || '');
    },
    ManualJournal: (m) => {
      if (m.journalNumber) {
        return m.amount
          ? t('audit_log.metadata.journal_with_amount', {
              args: { journalNumber: String(m.journalNumber), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.journal', {
              args: { journalNumber: String(m.journalNumber) },
            });
      }
      return String(m.journalNumber || '');
    },
    Cashflow: (m) => {
      if (m.amount) {
        return m.currencyCode
          ? t('audit_log.metadata.cashflow_with_currency', {
              args: { amount: String(m.amount), currencyCode: String(m.currencyCode) },
            })
          : t('audit_log.metadata.cashflow', {
              args: { amount: String(m.amount) },
            });
      }
      return t('audit_log.metadata.cashflow_plain');
    },
    Account: (m) => {
      if (m.name) {
        return m.code
          ? t('audit_log.metadata.account_with_code', {
              args: { name: String(m.name), code: String(m.code) },
            })
          : t('audit_log.metadata.account', {
              args: { name: String(m.name) },
            });
      }
      return t('audit_log.metadata.account_plain');
    },
    InventoryAdjustment: (m) => {
      return m.reason
        ? t('audit_log.metadata.adjustment', {
            args: { reason: String(m.reason) },
          })
        : t('audit_log.metadata.adjustment_plain');
    },
    WarehouseTransfer: (m) => {
      if (m.transactionNumber) {
        return t('audit_log.metadata.transfer', {
          args: { transactionNumber: String(m.transactionNumber) },
        });
      }
      return t('audit_log.metadata.transfer_plain');
    },
    Item: (m) => {
      if (m.name) {
        return m.code
          ? t('audit_log.metadata.item_with_code', {
              args: { name: String(m.name), code: String(m.code) },
            })
          : t('audit_log.metadata.item', {
              args: { name: String(m.name) },
            });
      }
      return t('audit_log.metadata.item_plain');
    },
    Customer: (m) => {
      if (m.displayName) {
        return m.email
          ? t('audit_log.metadata.customer_with_email', {
              args: { displayName: String(m.displayName), email: String(m.email) },
            })
          : t('audit_log.metadata.customer', {
              args: { displayName: String(m.displayName) },
            });
      }
      return t('audit_log.metadata.customer_plain');
    },
    Vendor: (m) => {
      if (m.displayName) {
        return m.email
          ? t('audit_log.metadata.vendor_with_email', {
              args: { displayName: String(m.displayName), email: String(m.email) },
            })
          : t('audit_log.metadata.vendor', {
              args: { displayName: String(m.displayName) },
            });
      }
      return t('audit_log.metadata.vendor_plain');
    },
    Role: (m) => {
      if (m.roleName) {
        return m.oldRoleName
          ? t('audit_log.metadata.role_with_old', {
              args: { roleName: String(m.roleName), oldRoleName: String(m.oldRoleName) },
            })
          : t('audit_log.metadata.role', {
              args: { roleName: String(m.roleName) },
            });
      }
      return t('audit_log.metadata.role_plain');
    },
    TaxRate: (m) => {
      if (m.name) {
        return m.rate !== undefined
          ? t('audit_log.metadata.tax_rate', {
              args: { name: String(m.name), rate: String(m.rate) },
            })
          : t('audit_log.metadata.tax_rate_name', {
              args: { name: String(m.name) },
            });
      }
      return t('audit_log.metadata.tax_rate_plain');
    },
    Warehouse: (m) => {
      return m.code
        ? t('audit_log.metadata.warehouse', {
            args: { code: String(m.code) },
          })
        : t('audit_log.metadata.warehouse_plain');
    },
    Branch: (m) => {
      if (m.name) {
        return m.code
          ? t('audit_log.metadata.branch_with_code', {
              args: { name: String(m.name), code: String(m.code) },
            })
          : t('audit_log.metadata.branch', {
              args: { name: String(m.name) },
            });
      }
      return t('audit_log.metadata.branch_plain');
    },
    ItemCategory: (m) => {
      return m.name
        ? t('audit_log.metadata.item_category', {
            args: { name: String(m.name) },
          })
        : t('audit_log.metadata.item_category_plain');
    },
    BankRule: (m) => {
      return m.name
        ? t('audit_log.metadata.bank_rule', {
            args: { name: String(m.name) },
          })
        : t('audit_log.metadata.bank_rule_plain');
    },
    TransactionsLocking: (m) => {
      if (m.module) {
        return m.lockToDate
          ? t('audit_log.metadata.locking_with_date', {
              args: { module: String(m.module), lockToDate: String(m.lockToDate) },
            })
          : t('audit_log.metadata.locking_module', {
              args: { module: String(m.module) },
            });
      }
      return t('audit_log.metadata.locking_plain');
    },
    CreditNoteRefund: (m) => {
      if (m.amount) {
        return t('audit_log.metadata.refund_amount', {
          args: { amount: String(m.amount) },
        });
      }
      return t('audit_log.metadata.refund_plain');
    },
    VendorCreditRefund: (m) => {
      if (m.amount) {
        return t('audit_log.metadata.refund_amount', {
          args: { amount: String(m.amount) },
        });
      }
      return t('audit_log.metadata.refund_plain');
    },
    UncategorizedTransaction: (m) => {
      if (m.amount) {
        return m.payee
          ? t('audit_log.metadata.imported_with_payee', {
              args: { payee: String(m.payee), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.imported', {
              args: { amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            });
      }
      return t('audit_log.metadata.imported_plain');
    },
    PlaidTransactions: (m) => {
      if (m.plaidAccountId) {
        return m.batch
          ? t('audit_log.metadata.plaid_with_batch', {
              args: { plaidAccountId: String(m.plaidAccountId), batch: String(m.batch) },
            })
          : t('audit_log.metadata.plaid', {
              args: { plaidAccountId: String(m.plaidAccountId) },
            });
      }
      return t('audit_log.metadata.plaid_plain');
    },
    BankTransaction: (m) => {
      if (m.amount) {
        return m.payee
          ? t('audit_log.metadata.bank_with_payee', {
              args: { payee: String(m.payee), amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            })
          : t('audit_log.metadata.bank', {
              args: { amount: String(m.amount), currencyCode: String(m.currencyCode || '') },
            });
      }
      return t('audit_log.metadata.bank_plain');
    },
  };

  const formatter = formatters[subject];
  if (formatter) {
    try {
      return formatter(metadata);
    } catch (e) {
      // Fallback to default below
    }
  }

  const entries = Object.entries(metadata).filter(
    ([, value]) => value !== null && value !== undefined && value !== '',
  );

  if (entries.length === 0) return '';

  return entries
    .slice(0, 3)
    .map(([key, value]) => {
      const displayKey = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      return `${displayKey}: ${value}`;
    })
    .join(', ');
}
