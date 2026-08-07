// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export function ReceiptsImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/receipts');
  };
  const handleImportSuccess = () => {
    history.push('/receipts');
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
