// @ts-nocheck
import { useHistory } from 'react-router-dom';
import { DashboardInsider } from '@/components';
import { ImportView } from '@/containers/Import';

export default function BillsImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/bills');
  };
  const handleImportSuccess = () => {
    history.push('/bills');
  };

  return (
    <DashboardInsider name={'import-bills'}>
      <ImportView
        resource={'bills'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
