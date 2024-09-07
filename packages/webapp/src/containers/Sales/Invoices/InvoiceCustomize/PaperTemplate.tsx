import styles from './PaperTemplate.module.scss';

export function PaperTemplate() {
  return (
    <div className={styles.root}>
      <div>
        <h1 className={styles.bigTitle}>Invoice</h1>

        <div className={styles.logoWrap}>
          <img alt="" src="https://cdn-development.mercury.com/demo-assets/avatars/mercury-demo-dark.png" />
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

        <div className={styles.addressFrom}>
          Billed To <br />
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
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Simply dummy text</td>
            <td>Simply dummy text of the printing and typesetting</td>
            <td>1 X $100,00</td>
            <td>$100,00</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'flex' }}>
        <div className={styles.totals}>
          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Sub Total</div>
            <div>630.00</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Discount</div>
            <div>0.00</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Sample Tax1 (4.70%)</div>
            <div>11.75</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Sample Tax2 (7.00%)</div>
            <div>21.00</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Total</div>
            <div>$662.75</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Payment Made</div>
            <div>100.00</div>
          </div>

          <div className={styles.totalsItem}>
            <div className={styles.totalsItemLabel}>Balance Due</div>
            <div className={styles.totalsItemLabel}>$562.75</div>
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
