// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { ImportView } from '@/containers/Import';
import { DashboardInsider } from '@/components';

export default function ReceiptsImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/accounts');
  };
  const handleImportSuccess = () => {
    history.push('/accounts');
  };

  return (
    <DashboardInsider name={'import-accounts'}>
      <ImportView
        resource={'sale_receipt'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
