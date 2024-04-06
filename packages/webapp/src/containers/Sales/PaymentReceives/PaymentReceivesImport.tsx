// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function PaymentsReceiveImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/');
  };
  const handleImportSuccess = () => {
    history.push('/accounts');
  };

  return (
    <DashboardInsider name={'import-accounts'}>
      <ImportView
        resource={'payment_receive'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
