import clsx from 'classnames';
import styles from './PaperTemplate.module.scss';

export function PaperTemplate() {
  return (
    <div className={styles.root}>
      <div>
        <h1 className={styles.bigTitle}>Invoice</h1>

        <div className={styles.logoWrap}>
          <img
            alt=""
            src="https://cdn-development.mercury.com/demo-assets/avatars/mercury-demo-dark.png"
          />
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <div className={styles.detailLabel}>Invoice number</div>
          <div>346D3D40-0001</div>
        </div>

        <div className={styles.detail}>
          <div className={styles.detailLabel}>Date of issue</div>
          <div>September 3, 2024</div>
        </div>

        <div className={styles.detail}>
          <div className={styles.detailLabel}>Date due</div>
          <div>October 3, 2024</div>
        </div>
      </div>

      <div className={styles.addressRoot}>
        <div className={styles.addressBillTo}>
          <strong>Bigcapital Technology, Inc.</strong> <br />
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
            <th className={styles.rate}>Rate</th>
            <th className={styles.total}>Total</th>
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
          <div
            className={clsx(styles.totalsItem, styles.totalBottomGrayBordered)}
          >
            <div className={styles.totalsItemLabel}>Sub Total</div>
            <div className={styles.totalsItemAmount}>630.00</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Discount</div>
            <div className={styles.totalsItemAmount}>0.00</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Sample Tax1 (4.70%)</div>
            <div className={styles.totalsItemAmount}>11.75</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Sample Tax2 (7.00%)</div>
            <div className={styles.totalsItemAmount}>21.00</div>
          </div>

          <div className={clsx(styles.totalsItem, styles.totalBottomBordered)}>
            <div className={styles.totalsItemLabel}>Total</div>
            <div className={styles.totalsItemAmount}>$662.75</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Payment Made</div>
            <div className={styles.totalsItemAmount}>100.00</div>
          </div>

          <div className={clsx(styles.totalsItem, styles.totalBottomBordered)}>
            <div className={styles.totalsItemLabel}>Balance Due</div>
            <div className={styles.totalsItemAmount}>$562.75</div>
          </div>
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
