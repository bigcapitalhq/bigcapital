import { useParams } from 'react-router-dom';
import { PaymentPortal } from './PaymentPortal';
import { PaymentPortalBoot } from './PaymentPortalBoot';
import BodyClassName from 'react-body-classname';
import styles from './PaymentPortal.module.scss';

export default function PaymentPortalPage() {
  const { linkId } = useParams<{ linkId: string }>();

  return (
    <BodyClassName className={styles.rootBodyPage}>
      <PaymentPortalBoot linkId={linkId}>
        <PaymentPortal />
      </PaymentPortalBoot>
    </BodyClassName>
  );
}
