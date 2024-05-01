// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function PaymentMadesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/payment-mades');
  };
  const handleImportSuccess = () => {
    history.push('/payment-mades');
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
