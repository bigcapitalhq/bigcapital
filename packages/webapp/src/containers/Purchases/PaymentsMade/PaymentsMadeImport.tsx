// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function PaymentsMadeImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/payments-made');
  };
  const handleImportSuccess = () => {
    history.push('/payments-made');
  };

  return (
    <DashboardInsider name={'import-payment-mades'}>
      <ImportView
        resource={'bill_payment'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
