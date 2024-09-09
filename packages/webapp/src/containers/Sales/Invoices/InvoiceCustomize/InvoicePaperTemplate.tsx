import clsx from 'classnames';
import styles from './PaperTemplate.module.scss';

interface PaperTemplateProps {
  invoiceNumber?: string;
  invoiceNumberLabel?: string;

  dateIssue?: string;
  dateIssueLabel?: string;

  dueDate?: string;
  dueDateLabel?: string;

  companyName?: string;

  bigtitle?: string;

  itemRateLabel?: string;
  itemQuantityLabel?: string;
  itemTotalLabel?: string;

  // Totals
  showDueAmount?: boolean;
  showDiscount?: boolean;
  showPaymentMade?: boolean;
  showTaxes?: boolean;
  showSubtotal?: boolean;
  showTotal?: boolean;
  showBalanceDue?: boolean;

  paymentMadeLabel?: string;
  discountLabel?: string;
  subtotalLabel?: string;
  totalLabel?: string;
  balanceDueLabel?: string;
}

export function InvoicePaperTemplate({
  bigtitle = 'Invoice',

  companyName = 'Bigcapital Technology, Inc.',
  // dueDateLabel,

  dueDate = 'September 3, 2024',
  dueDateLabel = 'Date due',

  dateIssue = 'September 3, 2024',
  dateIssueLabel = 'Date of issue',

  // dateIssue,
  invoiceNumberLabel = 'Invoice number',
  invoiceNumber = '346D3D40-0001',

  // Entries
  itemQuantityLabel = 'Quantity',
  itemRateLabel = 'Rate',
  itemTotalLabel = 'Total',

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
}: PaperTemplateProps) {
  return (
    <div className={styles.root}>
      <div>
        <h1 className={styles.bigTitle}>{bigtitle}</h1>
        <div className={styles.logoWrap}>
          <img
            alt=""
            src="https://cdn-development.mercury.com/demo-assets/avatars/mercury-demo-dark.png"
          />
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <div className={styles.detailLabel}>{invoiceNumberLabel}</div>
          <div>{invoiceNumber}</div>
        </div>

        <div className={styles.detail}>
          <div className={styles.detailLabel}>{dateIssueLabel}</div>
          <div>{dateIssue}</div>
        </div>

        <div className={styles.detail}>
          <div className={styles.detailLabel}>{dueDateLabel}</div>
          <div>{dueDate}</div>
        </div>
      </div>

      <div className={styles.addressRoot}>
        <div className={styles.addressBillTo}>
          <strong>{companyName}</strong> <br />
          131 Continental Dr Suite 305 Newark,
          <br />
          Delaware 19713
          <br />
          United States
          <br />
          +1 762-339-5634
          <br />
          ahmed@bigcapital.app
        </div>

        <div className={styles.addressFrom}>
          <strong>Billed To</strong> <br />
          Bigcapital Technology, Inc. <br />
          131 Continental Dr Suite 305 Newark,
          <br />
          Delaware 19713
          <br />
          United States
          <br />
          +1 762-339-5634
          <br />
          ahmed@bigcapital.app
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th className={styles.rate}>{itemRateLabel}</th>
            <th className={styles.total}>{itemTotalLabel}</th>
          </tr>
        </thead>

        <tbody className={styles.tableBody}>
          <tr>
            <td>Simply dummy text</td>
            <td>Simply dummy text of the printing and typesetting</td>
            <td className={styles.rate}>1 X $100,00</td>
            <td className={styles.total}>$100,00</td>
          </tr>
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
              <div className={styles.totalsItemAmount}>630.00</div>
            </div>
          )}

          {showDiscount && (
            <div className={styles.totalsItem}>
              <div className={styles.totalsItemLabel}>{discountLabel}</div>
              <div className={styles.totalsItemAmount}>0.00</div>
            </div>
          )}

          {showTaxes && (
            <>
              <div className={styles.totalsItem}>
                <div className={styles.totalsItemLabel}>
                  Sample Tax1 (4.70%)
                </div>
                <div className={styles.totalsItemAmount}>11.75</div>
              </div>

              <div className={styles.totalsItem}>
                <div className={styles.totalsItemLabel}>
                  Sample Tax2 (7.00%)
                </div>
                <div className={styles.totalsItemAmount}>21.00</div>
              </div>
            </>
          )}

          {showTotal && (
            <div
              className={clsx(styles.totalsItem, styles.totalBottomBordered)}
            >
              <div className={styles.totalsItemLabel}>{totalLabel}</div>
              <div className={styles.totalsItemAmount}>$662.75</div>
            </div>
          )}

          {showPaymentMade && (
            <div className={styles.totalsItem}>
              <div className={styles.totalsItemLabel}>{paymentMadeLabel}</div>
              <div className={styles.totalsItemAmount}>100.00</div>
            </div>
          )}

          {showBalanceDue && (
            <div
              className={clsx(styles.totalsItem, styles.totalBottomBordered)}
            >
              <div className={styles.totalsItemLabel}>{balanceDueLabel}</div>
              <div className={styles.totalsItemAmount}>$562.75</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.paragraph}>
        <div className={styles.paragraphLabel}>Terms & Conditions</div>
        <div>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </div>
      </div>

      <div className={styles.paragraph}>
        <div className={styles.paragraphLabel}>Statement</div>
        <div>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </div>
      </div>
    </div>
  );
}
