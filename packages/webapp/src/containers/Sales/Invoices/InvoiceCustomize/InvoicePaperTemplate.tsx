import clsx from 'classnames';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import styles from './InvoicePaperTemplate.module.scss';

interface PapaerLine {
  item?: string;
  description?: string;
  quantity?: string;
  rate?: string;
  total?: string;
}

interface PaperTax {
  label: string;
  amount: string;
}

interface PaperTemplateProps {
  primaryColor?: string;
  secondaryColor?: string;

  showCompanyLogo?: boolean;
  companyLogo?: string;

  showInvoiceNumber?: boolean;
  invoiceNumber?: string;
  invoiceNumberLabel?: string;

  showDateIssue?: boolean;
  dateIssue?: string;
  dateIssueLabel?: string;

  showDueDate?: boolean;
  dueDate?: string;
  dueDateLabel?: string;

  companyName?: string;
  bigtitle?: string;

  // Address
  showBillingToAddress?: boolean;
  showBilledFromAddress?: boolean;
  billedToLabel?: string;

  // Entries
  lineItemLabel?: string;
  lineDescriptionLabel?: string;
  lineRateLabel?: string;
  lineTotalLabel?: string;

  // Totals
  showTotal?: boolean;
  totalLabel?: string;
  total?: string;

  showDiscount?: boolean;
  discountLabel?: string;
  discount?: string;

  showSubtotal?: boolean;
  subtotalLabel?: string;
  subtotal?: string;

  showPaymentMade?: boolean;
  paymentMadeLabel?: string;
  paymentMade?: string;

  showTaxes?: boolean;

  showDueAmount?: boolean;
  showBalanceDue?: boolean;
  balanceDueLabel?: string;
  balanceDue?: string;

  // Footer
  termsConditionsLabel: string;
  showTermsConditions: boolean;
  termsConditions: string;

  statementLabel: string;
  showStatement: boolean;
  statement: string;

  lines?: Array<PapaerLine>;
  taxes?: Array<PaperTax>;

  billedFromAddres?: Array<string>;
  billedToAddress?: Array<string>;
}

function InvoicePaperTemplateRoot({
  primaryColor,
  secondaryColor,

  bigtitle = 'Invoice',
  companyName = 'Bigcapital Technology, Inc.',

  showCompanyLogo = true,
  companyLogo,

  dueDate = 'September 3, 2024',
  dueDateLabel = 'Date due',
  showDueDate,

  dateIssue = 'September 3, 2024',
  dateIssueLabel = 'Date of issue',
  showDateIssue,

  // dateIssue,
  invoiceNumberLabel = 'Invoice number',
  invoiceNumber = '346D3D40-0001',
  showInvoiceNumber,

  // Address
  showBillingToAddress = true,
  showBilledFromAddress = true,
  billedToLabel = 'Billed To',

  // Entries
  lineItemLabel = 'Item',
  lineDescriptionLabel = 'Description',
  lineRateLabel = 'Rate',
  lineTotalLabel = 'Total',

  totalLabel = 'Total',
  subtotalLabel = 'Subtotal',
  discountLabel = 'Discount',
  paymentMadeLabel = 'Payment Made',
  balanceDueLabel = 'Balance Due',

  // Totals
  showTotal = true,
  showSubtotal = true,
  showDiscount = true,
  showTaxes = true,
  showPaymentMade = true,
  showDueAmount = true,
  showBalanceDue = true,

  total = '$662.75',
  subtotal = '630.00',
  discount = '0.00',
  paymentMade = '100.00',
  balanceDue = '$562.75',

  // Footer paragraphs.
  termsConditionsLabel = 'Terms & Conditions',
  showTermsConditions = true,
  termsConditions = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',

  lines = [
    {
      item: 'Simply dummy text',
      description: 'Simply dummy text of the printing and typesetting',
      rate: '1',
      quantity: '1000',
      total: '$1000.00',
    },
  ],
  taxes = [
    { label: 'Sample Tax1 (4.70%)', amount: '11.75' },
    { label: 'Sample Tax2 (7.00%)', amount: '21.74' },
  ],

  statementLabel = 'Statement',
  showStatement = true,
  statement = 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
  billedToAddress = [
    'Bigcapital Technology, Inc.',
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
  billedFromAddres = [
    '131 Continental Dr Suite 305 Newark,',
    'Delaware 19713',
    'United States',
    '+1 762-339-5634',
    'ahmed@bigcapital.app',
  ],
}: PaperTemplateProps) {
  return (
    <div className={styles.root}>
      <style>{`:root { --invoice-primary-color: ${primaryColor}; --invoice-secondary-color: ${secondaryColor}; }`}</style>

      <div>
        <h1 className={styles.bigTitle}>{bigtitle}</h1>

        {showCompanyLogo && (
          <div className={styles.logoWrap}>
            <img alt="" src={companyLogo} />
          </div>
        )}
      </div>

      <div className={styles.details}>
        {showInvoiceNumber && (
          <div className={styles.detail}>
            <div className={styles.detailLabel}>{invoiceNumberLabel}</div>
            <div>{invoiceNumber}</div>
          </div>
        )}
        {showDateIssue && (
          <div className={styles.detail}>
            <div className={styles.detailLabel}>{dateIssueLabel}</div>
            <div>{dateIssue}</div>
          </div>
        )}
        {showDueDate && (
          <div className={styles.detail}>
            <div className={styles.detailLabel}>{dueDateLabel}</div>
            <div>{dueDate}</div>
          </div>
        )}
      </div>

      <div className={styles.addressRoot}>
        {showBilledFromAddress && (
          <div className={styles.addressBillTo}>
            <strong>{companyName}</strong> <br />
            {billedFromAddres.map((text, index) => (
              <div key={index}>{text}</div>
            ))}
          </div>
        )}

        {showBillingToAddress && (
          <div className={styles.addressFrom}>
            <strong>{billedToLabel}</strong> <br />
            {billedToAddress.map((text, index) => (
              <div key={index}>{text}</div>
            ))}
          </div>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>{lineItemLabel}</th>
            <th>{lineDescriptionLabel}</th>
            <th className={styles.rate}>{lineRateLabel}</th>
            <th className={styles.total}>{lineTotalLabel}</th>
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          {lines.map((line, index) => (
            <tr key={index}>
              <td>{line.item}</td>
              <td>{line.description}</td>
              <td className={styles.rate}>
                {line.quantity} X {line.rate}
              </td>
              <td className={styles.total}>{line.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex' }}>
        <div className={styles.totals}>
          {showSubtotal && (
            <div
              className={clsx(
                styles.totalsItem,
                styles.totalBottomGrayBordered,
              )}
            >
              <div className={styles.totalsItemLabel}>{subtotalLabel}</div>
              <div className={styles.totalsItemAmount}>{subtotal}</div>
            </div>
          )}

          {showDiscount && (
            <div className={styles.totalsItem}>
              <div className={styles.totalsItemLabel}>{discountLabel}</div>
              <div className={styles.totalsItemAmount}>{discount}</div>
            </div>
          )}

          {showTaxes && (
            <>
              {taxes.map((tax, index) => (
                <div key={index} className={styles.totalsItem}>
                  <div className={styles.totalsItemLabel}>{tax.label}</div>
                  <div className={styles.totalsItemAmount}>{tax.amount}</div>
                </div>
              ))}
            </>
          )}

          {showTotal && (
            <div
              className={clsx(styles.totalsItem, styles.totalBottomBordered)}
            >
              <div className={styles.totalsItemLabel}>{totalLabel}</div>
              <div className={styles.totalsItemAmount}>{total}</div>
            </div>
          )}

          {showPaymentMade && (
            <div className={styles.totalsItem}>
              <div className={styles.totalsItemLabel}>{paymentMadeLabel}</div>
              <div className={styles.totalsItemAmount}>{paymentMade}</div>
            </div>
          )}

          {showBalanceDue && (
            <div
              className={clsx(styles.totalsItem, styles.totalBottomBordered)}
            >
              <div className={styles.totalsItemLabel}>{balanceDueLabel}</div>
              <div className={styles.totalsItemAmount}>{balanceDue}</div>
            </div>
          )}
        </div>
      </div>

      {showTermsConditions && (
        <div className={styles.paragraph}>
          <div className={styles.paragraphLabel}>{termsConditionsLabel}</div>
          <div>{termsConditions}</div>
        </div>
      )}
      {showStatement && (
        <div className={styles.paragraph}>
          <div className={styles.paragraphLabel}>{statementLabel}</div>
          <div>{statement}</div>
        </div>
      )}
    </div>
  );
}

const withFormikProps = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: Omit<P, keyof PaperTemplateProps>) => {
    const { values } = useFormikContext<PaperTemplateProps>();

    return <Component {...(props as P)} {...values} />;
  };
};

export const InvoicePaperTemplate = R.compose(withFormikProps)(
  InvoicePaperTemplateRoot,
);
