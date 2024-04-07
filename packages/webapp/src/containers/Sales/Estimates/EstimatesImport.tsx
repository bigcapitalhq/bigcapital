// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function EstimatesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/estimates');
  };
  const handleImportSuccess = () => {
    history.push('/estimates');
  };

  return (
    <DashboardInsider name={'import-accounts'}>
      <ImportView
        resource={'sale_estimate'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
