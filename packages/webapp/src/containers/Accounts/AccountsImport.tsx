// @ts-nocheck
import { DashboardInsider } from '@/components';
import { ImportView } from '../Import/ImportView';
import { useHistory } from 'react-router-dom';

export default function AccountsImport() {
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
        resource={'accounts'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
